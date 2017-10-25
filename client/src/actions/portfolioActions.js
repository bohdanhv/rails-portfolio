import fetch from 'isomorphic-fetch';
import ActionUtils from './actionUtils';
import * as PortfolioReducerFunctions from '../reducers/portfolios_reducer';

const GUEST_USER_ID = 1;

export function addPortfolio(portfolio) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch('/api/portfolios/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: GUEST_USER_ID,
          name: portfolio.name,
        }),
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(newPortfolio => {
        if (!newPortfolio.id) {
          throw newPortfolio;
        }
        dispatch(PortfolioReducerFunctions.addPortfolioAction(newPortfolio));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Add Portfolio Error: ', error: error})))
    );
  }
}

export function deletePortfolio(portfolioId) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(deletedPortfolio => {
        if (!deletedPortfolio.id) {
          throw deletedPortfolio;
        }
        dispatch(PortfolioReducerFunctions.deletePortfolioAction(portfolioId));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Delete Portfolio Error: ', error: error})))
    );
  }
}

// Initialize a portfolio's summary values. Return an array of stock symbols contained in the portfolio.
function initPortfolioSummaryValues(portfolio) {
  let symbols = [];
  portfolio.open_positions.forEach(function(position) {
    position.lastClosePrice = 0.0;
    position.marketValue    = 0.0;
    position.gainLoss       = 0.0;
    symbols.push(position.stock_symbol.name);
  });
  return symbols;
}

// Specify portfolioId to load one portfolio. Do not specify portfolioId to load all portfolios.
export function loadPortfolios(loadLivePrices, portfolioId) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    const pId = (typeof portfolioId === 'number') ? portfolioId : '';
    return (
      fetch(`/api/portfolios/${pId}`, {
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(portfolios => {
        if (!portfolios.length) {
          throw new Error('Empty response from server');
        }

        let symbols = [];
        portfolios.forEach(function(portfolio) {
          symbols.push(...initPortfolioSummaryValues(portfolio));
        });

        if (symbols.length > 0) {
          const livePrices = (loadLivePrices === true) ? '&livePrices' : '';
          fetch(`/api/daily_trades/lastPrices?symbols=${symbols.toString()}${livePrices}`, {
            headers: {
              'Accept': 'application/json',
            },
          })
          .then(ActionUtils.checkStatus)
          .then(response => response.json())
          .then(dailyTrades => {
            if (!dailyTrades.length) {
              throw new Error('Empty response from server');
            }
            portfolios.forEach(function(portfolio) {processPrices(portfolio, dailyTrades)});

            if (pId.length === 0) {
              dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios));
            } else {
              dispatch(PortfolioReducerFunctions.updatePortfolioAction(portfolios[0]));
            }
          });
        }
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios Error: ', error: error})))
    );
  }
}

// Update open positions with dailyTrade prices.
function processPrices(portfolio, dailyTrades) {
  portfolio.open_positions.forEach(function(position) {
    const dailyTradesIndex = dailyTrades.findIndex(dailyTrade => {return dailyTrade.stock_symbol_id === position.stock_symbol.id});
    if (dailyTradesIndex !== -1) {
      position.lastClosePrice = dailyTrades[dailyTradesIndex].close_price;
      position.marketValue    = position.quantity * position.lastClosePrice;
      position.gainLoss       = position.marketValue - position.cost;
    }
  });
}

// Update a portfolio's valuation. Get any missing position prices first.
export function repricePortfolio(portfolio) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());

    let symbols = [];
    portfolio.open_positions.forEach(function(position) {
      if (!('lastClosePrice' in position)) {
        symbols.push(position.stock_symbol.name);
      }
    });

// TODO candidate for consolidation with other price lookups.
    if (symbols.length > 0) {
      const livePrices = '&livePrices';
      fetch(`/api/daily_trades/lastPrices?symbols=${symbols.toString()}${livePrices}`, {
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(dailyTrades => {
        if (!dailyTrades.length) {
          throw new Error('Empty response from server');
        }
        processPrices(portfolio, dailyTrades);
        dispatch(PortfolioReducerFunctions.updatePortfolioAction(portfolio));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Reprice Portfolio Error: ', error: error})))
    }
  }
}

// Updates a position's applicable portfolio with new prices.
export function repricePortfolioForPosition(portfolio, openPosition) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/daily_trades/lastPrices?symbols=${openPosition.stock_symbol.name}&livePrices`, {
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(dailyTrades => {
        if (!dailyTrades.length) {
          throw new Error('Empty response from server');
        }
        processPrices(portfolio, dailyTrades);
        dispatch(PortfolioReducerFunctions.updatePortfolioAction(portfolio));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Load Portfolios Error: ', error: error})))
    );
  }
}

export function sortPortfolios(portfolios, columnName, reverseSort) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    switch (columnName) {
      case 'name':
        portfolios.sort(ActionUtils.sort_by(columnName, reverseSort, function(a){return a.toUpperCase()}));
        break;
      case 'gainLoss':     // fall through
      case 'marketValue':  // fall through
      case 'totalCost':
        portfolios.sort(ActionUtils.sort_by(columnName, reverseSort, parseFloat));
        break;
      default:
        portfolios.sort(ActionUtils.sort_by(columnName, reverseSort));
        break;
    }
    return (dispatch(PortfolioReducerFunctions.updatePortfoliosAction(portfolios)));
  }
}

export function updatePortfolio(portfolio) {
  return function(dispatch) {
    dispatch(PortfolioReducerFunctions.updatingPortfolioAction());
    return (
      fetch(`/api/portfolios/${portfolio.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: portfolio.name,
        }),
      })
      .then(ActionUtils.checkStatus)
      .then(response => response.json())
      .then(updatedPortfolio => {
        if (!updatedPortfolio.id) {
          throw updatedPortfolio;
        }
        dispatch(PortfolioReducerFunctions.updatePortfolioAction(updatedPortfolio));
      })
      .catch(error => dispatch(PortfolioReducerFunctions.errorPortfolioAction({prefix: 'Update Portfolio Error: ', error: error})))
    );
  }
}
