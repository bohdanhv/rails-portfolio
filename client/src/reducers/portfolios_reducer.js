import Fmt from '../components/Formatters';

export const portfolioActions = {
  ADD_PORTFOLIO     : 'ADD_PORTFOLIO',
  DELETE_PORTFOLIO  : 'DELETE_PORTFOLIO',
  ERROR_PORTFOLIOS  : 'ERROR_PORTFOLIOS',
  UPDATE_PORTFOLIO  : 'UPDATE_PORTFOLIO',
  UPDATE_PORTFOLIOS : 'UPDATE_PORTFOLIOS',
  UPDATING_PORTFOLIO: 'UPDATING_PORTFOLIO',
};

export function addPortfolioAction(portfolio)      {return {type: portfolioActions.ADD_PORTFOLIO,     payload: portfolio}}
export function deletePortfolioAction(portfolioId) {return {type: portfolioActions.DELETE_PORTFOLIO,  payload: portfolioId}}
export function errorPortfolioAction(error)        {return {type: portfolioActions.ERROR_PORTFOLIOS,  payload: error}}
export function updatePortfolioAction(portfolio)   {return {type: portfolioActions.UPDATE_PORTFOLIO,  payload: portfolio}}
export function updatePortfoliosAction(portfolios) {return {type: portfolioActions.UPDATE_PORTFOLIOS, payload: portfolios}}
export function updatingPortfolioAction()          {return {type: portfolioActions.UPDATING_PORTFOLIO}}

// Redo portfolio summary calculations whenever a portfolio has changed.
function recomputePortfolioSummary(portfolio) {
  portfolio.marketValue = 0.0;
  portfolio.totalCost   = 0.0;
  portfolio.gainLoss    = 0.0;
  portfolio.open_positions.forEach(function(position) {
    portfolio.marketValue  += position.marketValue;
    portfolio.totalCost    += position.cost;
    portfolio.gainLoss     += position.gainLoss;
  });
}

export function portfoliosReducer(state= {updatingPortfolio: false, portfolios: []}, action) {
  console.log("ACTION: " + action.type);
  switch ( action.type ) {
    // Add a Portfolio.
    case portfolioActions.ADD_PORTFOLIO: {
      const payloadPortfolio = action.payload;
      const portfolios = [payloadPortfolio, ...state.portfolios];
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
    }

    // Delete a Portfolio.
    case portfolioActions.DELETE_PORTFOLIO: {
      const payloadPortfolioId = action.payload;
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolioId;});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), ...state.portfolios.slice(portfolioIndex+1)]
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
    }

    // Error on Portfolio action.
    case portfolioActions.ERROR_PORTFOLIOS: {
      const {error, prefix} = action.payload;
      alert(Fmt.ServerError(error, prefix));
      return Object.assign({}, state, {updatingPortfolio: false});
    }

    // Update a Portfolio.
    case portfolioActions.UPDATE_PORTFOLIO: {
      const payloadPortfolio = action.payload;
      recomputePortfolioSummary(payloadPortfolio);
      const portfolioIndex = state.portfolios.findIndex(portfolio => {return portfolio.id === payloadPortfolio.id});
      const portfolios = [...state.portfolios.slice(0,portfolioIndex), payloadPortfolio, ...state.portfolios.slice(portfolioIndex+1)];
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: portfolios});
    }

    // Update all Portfolios.
    case portfolioActions.UPDATE_PORTFOLIOS: {
      const payloadPortfolios = action.payload;
      return Object.assign({}, state, {updatingPortfolio: false, portfolios: payloadPortfolios});
    }

    // Show that one or more Portfolios are being modified.
    case portfolioActions.UPDATING_PORTFOLIO:
      return Object.assign({}, state, {updatingPortfolio: true});

    // Default action.
    default:
      return state;
  }
}
