import Fmt from '../components/Formatters';

export const portfolioActions = {
  ADD_PORTFOLIO:      'ADD_PORTFOLIO',
  DELETE_PORTFOLIO:   'DELETE_PORTFOLIO',
  ERROR_PORTFOLIOS:   'ERROR_PORTFOLIOS',
  LOAD_PORTFOLIOS:    'LOAD_PORTFOLIOS',
  SORT_PORTFOLIOS:    'SORT_PORTFOLIOS',
  UPDATE_PORTFOLIOS:  'UPDATE_PORTFOLIOS',
  UPDATING_PORTFOLIO: 'UPDATING_PORTFOLIO',
  ADD_POSITION:       'ADD_POSITION',
  DELETE_POSITION:    'DELETE_POSITION',
  ERROR_POSITIONS:    'ERROR_POSITIONS',
  SORT_POSITIONS:     'SORT_POSITIONS',
  UPDATE_POSITIONS:   'UPDATE_POSITIONS',
  UPDATING_POSITION:  'UPDATING_POSITION',
};

export default function portfoliosReducer(state= {updatingPortfolios: false, portfolios: []}, action) {

  // A generic sort comparator function.
  var sort_by = function(field, reverse = false, compareFn) {
    var key = function (x) {return compareFn ? compareFn(x[field]) : x[field]};
    return function (a,b) {
  	  var A = key(a), B = key(b);
      return ( ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [1,-1][+!!reverse] );
    }
  }

console.log("ACTION: " + action.type);
  switch ( action.type ) {

    // *************************
    // >>> PORTFOLIO ACTIONS <<<
    // *************************

    // Add a Portfolio.
    case portfolioActions.ADD_PORTFOLIO: {
      const portfolios = [action.payload, ...state.portfolios];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Delete a Portfolio.
    case portfolioActions.DELETE_PORTFOLIO: {
      const payloadPortfolioId = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolioId;});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), ...state.portfolios.slice(portfolioIndex+1)]
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Error on Portfolio action.
    case portfolioActions.ERROR_PORTFOLIOS: {
      const {error, prefix} = action.payload;
      alert(Fmt.ServerError(error, prefix));
      return Object.assign({}, state, {updatingPortfolios: false});
    }

    // Load Portfolios.
    case portfolioActions.LOAD_PORTFOLIOS: {
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: action.payload});
    }

    // Sort Portfolios.
    case portfolioActions.SORT_PORTFOLIOS: {
      const portfolios = [...state.portfolios];
      if (portfolios.length === 0) {
        return state;
      }
      const {columnName, reverseSort} = action.payload;
      switch (columnName) {
        case 'name':
          portfolios.sort(sort_by(columnName, reverseSort, function(a){return a.toUpperCase()}));
          break;
        case 'gainLoss':     // fall through
        case 'marketValue':  // fall through
        case 'totalCost':
          portfolios.sort(sort_by(columnName, reverseSort, parseFloat));
          break;
        default:
          portfolios.sort(sort_by(columnName, reverseSort));
          break;
      }
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Update a Portfolio.
    case portfolioActions.UPDATE_PORTFOLIOS: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id;});
console.log("PORTFOLIOINDEX: " + portfolioIndex);
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Show that one or more Portfolios are being modified.
    case portfolioActions.UPDATING_PORTFOLIO:   // fall through
    case portfolioActions.UPDATING_POSITION:
      return Object.assign({}, state, {updatingPortfolios: true});

    // **********************************
    // >>> PORTFOLIO POSITION ACTIONS <<<
    // **********************************

    // Update a Position.
    case portfolioActions.ADD_POSITION: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id;});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Delete a Position.
    case portfolioActions.DELETE_POSITION: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id;});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Error on Position action.
    case portfolioActions.ERROR_POSITIONS: {
      const {error, prefix} = action.payload;
      alert(Fmt.ServerError(error, prefix));
      return Object.assign({}, state, {updatingPortfolios: false});
    }

    // Sort Positions within a Portfolio.
    case portfolioActions.SORT_POSITIONS: {
      const {portfolio_id, columnName, reverseSort} = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === portfolio_id;});
      const portfolio = Object.assign({}, state.portfolios[portfolioIndex]);
      switch (columnName) {
        case 'stock_symbol':
          portfolio.open_positions.sort(sort_by('stock_symbol', reverseSort, function(a){return a.name.toUpperCase()}));
          break;
        case 'date_acquired':
          portfolio.open_positions.sort(sort_by(columnName, reverseSort, parseInt));
          break;
        case 'cost':           // fall through
        case 'gainLoss':       // fall through
        case 'lastClosePrice': // fall through
        case 'marketValue':    // fall through
        case 'quantity':
          portfolio.open_positions.sort(sort_by(columnName, reverseSort, parseFloat));
          break;
        default:
          portfolio.open_positions.sort(sort_by(columnName, reverseSort));
          break;
      }
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), portfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Update a Position.
    case portfolioActions.UPDATE_POSITIONS: {
      const payloadPortfolio = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id;});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolios: false, portfolios: portfolios});
    }

    // Default action.
    default:
      return state;
  }
}
