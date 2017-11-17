# This is the Yahoo Finance API handler.
# This API is defunct as of November 2017.
module Yahoo extend ActiveSupport::Concern
  require 'csv'
  #
  # See the bottom of this file for sample data.
  #
  # Response file .csv column positions.
  SYMBOL_COL           = 0
  LAST_TRADE_PRICE_COL = 1
  LAST_TRADE_DATE_COL  = 2
  LAST_TRADE_TIME_COL  = 3
  DAY_CHANGE_COL       = 4

  # Makes data request(s) for an array of symbols and returns results in trades.
  def YAHOO_latest_trades(symbols, trades)
    fetch_time = DateTime.now
    symbol_list = symbols.join('+')
    trades = Array.new(symbols.length)
    begin
      logger.debug "YAHOO PRICE FETCH BEGIN for: #{symbol_list}."
      conn = Faraday.new(url: 'https://download.finance.yahoo.com/d/quotes.csv')
      resp = conn.get '', { s: symbol_list, f: 'sl1d1t1c1' }
      logger.debug "YAHOO PRICE FETCH END   for: #{symbol_list}."
      response = CSV.parse(resp.body)
      raise LoadError, 'The feed is down.' if resp.body.include? '999 Unable to process request at this time'
    rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
      logger.error "YAHOO PRICE FETCH ERROR for: #{symbol_list}: Faraday client error: #{e}."
      fetch_failure(symbols, trades, 'The feed is down.')
    rescue CSV::MalformedCSVError => e
      logger.error "YAHOO PRICE FETCH ERROR for: #{symbol_list}: CSV parse error: #{e}."
      fetch_failure(symbols, trades, 'The feed is down.')
    rescue LoadError => e
      logger.error "YAHOO PRICE FETCH ERROR for: #{symbol_list}: #{e}."
      fetch_failure(symbols, trades, 'The feed is down.')
    else
      symbols.each_with_index do |symbol, i|
        trades[i] = YAHOO_process_response(symbol, response)
        trades[i].created_at = fetch_time
      end
    end
    trades
  end

private

  #
  # overall Fetch error example
  # resp.body: "<html><head><title>Yahoo! - 999 Unable to process request at this time -- error 999</title></head><body>Sorry, Unable to process request at this time -- error 999.</body></html>"
  # => [["<html><head><title>Yahoo! - 999 Unable to process request at this time -- error 999</title></head><body>Sorry", " Unable to process request at this time -- error 999.</body></html>"]]
  #

  # Extract trade data or an error from the response.
  def YAHOO_process_response(symbol, response)
    response_index = response.index { |row| row[SYMBOL_COL] == symbol }
    if response_index.nil?
      trade = error_trade(symbol, 'Price is not available.')
    else
      response_row = response[response_index]
      if response_row[LAST_TRADE_PRICE_COL] == 'N/A'
        # Error example: "AXXX","N/A","N/A","N/A","N/A"
        trade = error_trade(symbol, 'Price is not available.')
      else
        # TODO: Replace 'EDT' with proper timezone info.
        trade = Trade.new do |t|
          t.instrument   = Instrument.find_by(symbol: symbol)
          t.trade_date   = DateTime.strptime("#{response_row[LAST_TRADE_DATE_COL]} #{response[response_index][LAST_TRADE_TIME_COL]} EDT", '%m/%d/%Y %l:%M%P %Z').to_f/1000.0.round(4).to_datetime
          t.trade_price  = response_row[LAST_TRADE_PRICE_COL].to_f.round(4)
          t.price_change = response_row[DAY_CHANGE_COL].to_f.round(4)
        end
      end
    end
    trade
  end
end

# ##################
# ## SAMPLE DATA  ##
# ##################
#
# https://download.finance.yahoo.com/d/quotes.csv?s=ORCL+CL&f=sl1d1t1c1
# \"ORCL\",50.88,\"10/27/2017\",\"4:01pm\",+0.73\n\"CL\",70.40,\"10/27/2017\",\"4:00pm\",-0.81\n
# After conversion:
# [
#  ["ORCL", "50.88", "10/27/2017", "4:01pm", "+0.73"],
#  ["CL",   "70.40", "10/27/2017", "4:00pm", "-0.81"]
# ]
