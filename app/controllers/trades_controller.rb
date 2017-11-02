class TradesController < ApplicationController
   include Yahoo

  # Retrieve the latest prices for the supplied symbols.
  # from live feed if 'livePrices' is specified. Else, from database.
  # To handle case of feed down not trashing client's existing prices,
  # first load database latest prices, then overlay with whatever we
  # can get from live feed.

  # NOTE: Keep symbols array and trades array in sync by symbol name.
  #       Use trade.error to signal a failed price fetch.

  # TODO Combine symbols and trades arrays into a single object.

  def latest_prices
    symbols = symbolsForUser(params['userId'])
    trades = Array.new(symbols.length)

    # Load last saved prices from database.
    symbols.each_with_index { |symbol, i|
      stock_symbol = StockSymbol.find_by(name: symbol)
      if !stock_symbol.nil?
        trade = Trade.where('stock_symbol_id = ?', stock_symbol.id).order('trade_date DESC, created_at DESC').first
        if !trade.nil?
          trades[i] = trade
        else
          trades[i] = error_trade(symbol, 'No trades available.')
        end
      else
        trades[i] = error_trade(symbol, 'Invalid symbol.')
      end
    }

    if params.key?('livePrices')
      liveTrades = Array.new(symbols.length)
      # Fetch live prices
      fillTrades(symbols, liveTrades);
      # Save new prices to database.
      liveTrades.each_with_index { |trade, i|
        if !trade.trade_price.nil?
          # TODO When we get a feed that has some sort of unique identifier in it, then add that id to the database to avoid saving duplicates.
          begin
            trade.save
            trades[i] = trade
          rescue ActiveRecord::ActiveRecordError => e
            puts "Error saving trade: #{trade.inspect}, #{e}"
          end
        end
      }
    end
    render json: trades, each_serializer: TradeSerializer
  end

  # TODO Consolidate these two functions into one place in common with yahoo.rb
  def error_trade(symbol, errorMsg)
    Trade.new(stock_symbol: StockSymbol.new(name: symbol), error: "#{symbol}: #{errorMsg}")
  end

  def fetch_failure(symbols, trades, errorMsg)
    symbols.each_with_index { |symbol, i|
      trades[i] = error_trade(symbol, errorMsg)
    }
  end

  def symbolsForUser(user_id)
    symbols = []
    portfolios = Portfolio.where('user_id = ?', params['userId'])
    portfolios.each { |portfolio|
      portfolio.positions.each { |position|
        symbols.push(position.stock_symbol.name)
      }
    }
    symbols.uniq
  end
end
