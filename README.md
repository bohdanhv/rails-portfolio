# PORTFOLIO ANALYZER

[![GitHub version](https://badge.fury.io/gh/jcpny1%2Fportfolio-analyzer.svg)](https://badge.fury.io/gh/jcpny1%2Fportfolio-analyzer)
[![Build Status](https://travis-ci.org/jcpny1/portfolio-analyzer.svg?branch=master)](https://travis-ci.org/jcpny1/portfolio-analyzer)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7ca3b07d0b24fbcd472b/test_coverage)](https://codeclimate.com/github/jcpny1/portfolio-analyzer/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/7ca3b07d0b24fbcd472b/maintainability)](https://codeclimate.com/github/jcpny1/portfolio-analyzer/maintainability)
[![Inline docs](http://inch-ci.org/github/jcpny1/portfolio-analyzer.svg)](http://inch-ci.org/github/jcpny1/portfolio-analyzer)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/d5225aab819e4d609fac1d0daf3ebfb9)](https://www.codacy.com/gh/jcpny1/portfolio-analyzer/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jcpny1/portfolio-analyzer&amp;utm_campaign=Badge_Grade)

## Overview

The Portfolio Analyzer App is a portfolio monitoring tool.
You can enter your investment holdings and monitor their total value and intra-day value change.

![Portfolio Analyzer Positions Page](https://github.com/jcpny1/portfolio-analyzer/blob/master/Screenshot-2017-11-13%20PortfolioAnalyzer.png?raw=true "Portfolio Analyzer Positions Page")

It was created to meet the requirements of the [Flatiron School](https://flatironschool.com/)'s React Redux portfolio project.
It incorporates Rails, Node.js, React, Redux, Thunk, and Semantic-UI-React.

The Javascript front end code is in the ```client``` folder.
The remaining folders are primarily for the Ruby server code.

Free quote services do not work on a subscriber or push model, so the architecture of this app is a bit different than it would normally be.
When the client is started, the latest quotes shown are those that had been previously stored in the server's database, no matter how old.
When the user presses the refresh button in the client, the server obtains new quotes from the service provider, stores them in the server's database, then forwards them to the client.
If the server (or client) polled the service provider periodically (to keep the quotes fresh), the free quote service's request quotas would quickly be reached.

The test code coverage is currently around 82%. This is because there is quite a bit of error handling code in the various service provider interfaces that I haven't taken the time to build test cases for, yet.

## History
```
28-Apr-22  1.0.8  Update gems, especially Rails, to implement security fixes.
20-Mar-22  1.0.7  Address Dependabot alerts for Javascript.
20-Mar-22  1.0.6  Address Dependabot alerts for Ruby.
31-Dec-20  1.0.5  Disable long running background jobs. Update AV call rate back to free plan.
22-Dec-20  1.0.4  Use Yahoo for DJIA instead of Alpha Vantage.
17-Dec-20  1.0.3  Implement trade price bulk load from feed.
07-Dec-20  1.0.2  Bulk load series data in the background takes more than one day (with throttling to avoid free plan quota limits).
                  Heroku restarts dynos every 24 hours causing the job to start over again, so it never finishes.
                  This update implements restart logic, so the job can pick up where it left off.
21-Nov-20  1.0.1  Update remaining packages. Comment out failing test (new Enzyme package?).
14-Nov-20  1.0.0  Updated remaining gems and packages where possible. Updated test code and configs.
10-Nov-20  0.9.0  Updated Ruby to 2.7.2. Updated gems. Updated Highcharts and Highstock.
10-Oct-20  0.8.1  Updated client packages for Github-identified security vulnerabilities.
14-Aug-19  0.8.0  Updated IEX Trading API to latest version and update Gems to eliminate GitHub security warnings.
15-Feb-19  0.7.1  Updated Babel syntax for V7 to fix test suite errors.
30-Nov-18  0.7.0  Upgraded Ruby from 2.4.2 to 2.5.3. Updated gems, node packages, etc.
06-May-18  0.6.2  Added more Jest tests.
                  Added option to bulk load series data only for symbols contained in Positions table.
                  Removed option to bulk load Series data only for symbols missing from Series table.
                  Updated gems.
                  Increased index fetch and series fetch throttling delays.
                  Keep tripping AV rate limits (might be a feed bug; it's not me).
                  Refresh Series data points for newly added Position Instrument.
10-Apr-18  0.6.1  Updated gems.
10-Apr-18  0.6.0  Enhanced series feed error handling.
                  Cut Sidekiq threads from 10 to 1.
                  Reduces Heroku worker dyno memory utilization and prevents concurrent bulk operations.
                  Bulk refresh instrument prices will now update in sorted symbol order.
                  Localized refresh time string and hover tooltip.
                  Updated usage notes.
                  Updated gems.
                  Updated node packages.
                  Moved chart code out of formatter and into new ChartData class.
                  Memoized data feed vendor keys.
                  Added first jest test.
                  Only chart a portfolio value to the earliest end date of underlying instruments to avoid incorrect
                  valuation due to missing data.
                  Reduction in RuboCop findings.
                  Reduced series fetch rate to prevent exceeding vendor limits.
                  Now storing all available series data; Removed hardcoded year 2013 start date. Pass date range from client.
                  Series fetch API now accepts a date range.
                  Removed dividend reinvestment adjustments from chart now that we are using adjusted data.
                  Moved Settings menu item from Help menu to main level.
                  When editing an existing position, the date-acquired field will now show the existing value instead of
                  today's date.
                  Display portfolio name in red/green/black color depending on gain/loss value.
27-Mar-18  0.5.0  Added portfolio composite to chart in addition to individual instruments.
                  Reduced headlines refresh rate to not exceed the free license limit with just two Portfolio Analyzer
                  client apps running.
                  Bulk refresh series data will now update in symbol order.
                  Incorporated a few Code Climate suggestions. Also updated config file to V2.
                  Added new Decimal class data type 'percent'.
                  Added new derived field 'pctTotalMV' (percentage of Total Market Value of portfolio) to class Position.
                  Removed lastUpdate from the positions page.
                  Added pctTotalMV to the positions page.
                  Removed some code smells from feed handlers.
                  Starting chart date will be the latest start date of all instruments in the chart.
23-Mar-18  0.4.1  Update for loofah gem security fix.
                  Update chart $ symbol display.
                  Only keep the latest data point for each month in the monthly series table.
                  Added chart button to positions page next to portfolio name.
21-Mar-18  0.4.0  Monthly series data is now bulk loaded into the database on demand. Chart app now pulls data from database.
17-Mar-18  0.3.0  Switched from the default json serializer adapter to the more standard json_api serializer adapter.
03-Mar-18  0.2.0  Updates for changes to NewsApi.org's API. Fixed bug where a new position could not be added to a portfolio.
12-Nov-17  0.1.0  Initial release.
```

## Installation

Portfolio-Analyzer was developed using earlier versions of the following, but was released using Ruby 2.4.2, Rails 5.1.4, Node.js 8.9.1.

### Initialize the project
*   Clone the [Portfolio Analyzer Repository](https://github.com/jcpny1/portfolio-analyzer).
*   `cd` into the project directory.
*   `rbenv install 2.7.2` (if necessary)
*   `bundle install`

### Install redis server (if not installed yet)
*   `sudo apt-get install redis-server`

*   In /etc/rc.local, add:
    ``` bash
    if test -f /sys/kernel/mm/transparent_hugepage/enabled; then
      echo never > /sys/kernel/mm/transparent_hugepage/enabled
    fi
    ```

### Setup the database
*   Install postgresql, if necessary. `sudo apt update` then `sudo apt install postgresql postgresql-contrib`

*   `sudo apt-get install nodejs`

*   `sudo -u postgres createdb portfolio_analyzer_dev`

*   `sudo -u postgres createuser jcpny1` if necessary

*   `rake db:migrate`

*   `rake db:seed`

After a fresh install of seed data, the application should be showing a Total Gain/Loss of $179,565.842.

### Install npm packages
*   `cd client`

*   `sudo apt install nodejs`

*   `npm install`

### Setup the data provider keys
To receive market data, the server requires an internet connection and a few API keys:
*   Market data from [IEX](https://iextrading.com/) requires a key. Registration is required. There is no charge.

*   Index data from [Alpha Vantage](https://www.alphavantage.co/) requires a key. Registration is required. There is no charge.

*   Headline news from [News API](https://newsapi.org/) requires a key. Registration is required. There is no charge.

The keys should be placed in the project's home directory in a file called `.env`, as in the following example:
``` bash
  ALPHA_VANTAGE_API_KEY: ABCDEFGHIJKLMNOP
  IEX_API_KEY: xyz123
  NEWSAPI_API_KEY: abcdefghijklmnopqrstuvwxyzabcdef
```

## Usage

*   From the project home directory, type `rake start`.

*   The server will start.
    When the server is ready, a new default browser tab will open at the Portfolio Analyzer home page.

*   When your positions are first loaded, they will be priced with the latest available information from the Portfolio Analyzer database.
    Each time you hit Refresh, the prices will be updated with latest data from the market data provider.

*   The latest news headlines and DJIA value are presently set to update as follows: on the initial page load,
    when the entire page is refreshed, and once per two minutes.

*   Database seed data includes just ten ticker symbols to work with. If you need more, there are Admin menu options to download a complete list of
    symbols from the market data vendor into the database and to download the latest prices into the database for each of those symbols.

## Warnings

*   There is no login logic at this time. Any data you enter into the system is subject to being viewed, edited, or deleted by anyone else with access to the same server.

*   The market data shown may not be the latest information available or may be inaccurate.

*   Any data, tools, or methods offered are for software development practice only.
    They may not be accurate. No decisions should be based on what is presented in this application.

## Testing

*   If the test DB does not exist -`sudo -u postgres /bin/createdb travis_ci_test` and `RAILS_ENV=test rake db:migrate`.

To run the RSpec test suite:
*   In one window, run `npm start` from the client directory.

*   In another window, run `RAILS_ENV=test bundle exec rspec` from the project home directory.

To run the Jest test suite:
*   Run `npm test` from the client directory.

## Deployment

*   To deploy on Heroku, `git push heroku master`.

## Problems

* If sidekiq jobs are queued but are not executing, make sure the sidekiq process is active. For some reason, it is not auto-starting on system reboot.
``` bash
  sudo systemctl status sidekiq
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jcpny1/portfolio-analyzer.
This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The application is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
