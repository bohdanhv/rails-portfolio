import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/positionActions.js';
import Positions from '../components/Positions';

class PositionsPage extends Component {

  componentDidMount() {
    if (!("open_positions" in this.props.positions)) {
      const pathParts = this.props.location.pathname.split('/');
      const portfolio_id = pathParts[pathParts.length-1];
      this.props.actions.fetchPositions(portfolio_id);
    }
  }

  updatePosition = (newValues) => {
    this.props.actions.updatePosition({
      id: newValues.id,
      portfolio_id: newValues.portfolio_id,
      stock_symbol: newValues.stock_symbol,
      quantity: newValues.quantity,
      cost: newValues.cost,
      date_acquired: newValues.date_acquired,
    });
  }

  removePosition = (itemIndex) => {
    if (window.confirm('Are you sure?')) {
      this.props.actions.deletePosition(itemIndex);
    }
  }

  render() {
    return (<Positions portfolio_id={this.props.portfolio_id} positions={this.props.positions} prices={this.props.prices} onClickUpdate={this.updatePosition} onClickRemove={this.removePosition}/>);
  }
}

function mapStateToProps(state) {
  return {portfolio_id: state.positions.portfolio_id, positions: state.positions.positions, prices: state.prices.prices};
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsPage);
