import React, {Component} from 'react';
// import logo from './logo.svg';
// import './App.css';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {Button, Dropdown, Grid, Header, Image, Menu, Table} from 'semantic-ui-react';
import ConfirmDialog from './containers/ConfirmDialog';
import HeadlinesPage from './containers/HeadlinesPage';
import HelpPage from './containers/HelpPage';
import LoginPage from './containers/LoginPage';
import PortfoliosPage from './containers/PortfoliosPage';
import PositionsPage from './containers/PositionsPage';
import * as Request from './utils/request';
import SettingsEditPage from './containers/SettingsEditPage';
import SymbolsPage from './containers/SymbolsPage';

class App extends Component {
  menuItemAdmin() {
    return (
      <Dropdown item text='Admin'>
        <Dropdown.Menu>
          <ConfirmDialog triggerType='dropdown' title='Refresh Instruments...'   header='Background refresh instrument inventory from data feed'         onClickConfirm={Request.instrumentsRefresh}/>
          <ConfirmDialog triggerType='dropdown' title='Refresh Active Series...' header='Background refresh active series prices'                        onClickConfirm={Request.seriesRefreshActive}/>
          <ConfirmDialog disabled triggerType='dropdown' title='Refresh All Prices...'    header='Background reprice entire instrument inventory (runs 12 hours)' onClickConfirm={Request.pricesRefresh}/>
          <ConfirmDialog disabled triggerType='dropdown' title='Refresh All Series...'    header='Background refresh all series prices (runs 2 days)'             onClickConfirm={Request.seriesRefreshAll}/>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  menuItemHelp() {
    return (
      <Dropdown item text='Help'>
        <Dropdown.Menu>
          <HelpPage trigger={<Dropdown.Item>Usage Notes</Dropdown.Item>}/>
          <Dropdown.Divider/>
          <Dropdown.Item disabled as={Link} to='/about'>About</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  pageBody() {
    return (
      <Grid.Row columns={2}>
        <Grid.Column width={11} style={{paddingRight:'5px'}}>
          <Switch>
            <Route exact path='/'           component={PortfoliosPage}/>
            <Route path='/about'            component={PortfoliosPage}/>
            <Route path='/home'             component={PortfoliosPage}/>
            <Route exact path='/portfolios' component={PortfoliosPage}/>
            <Route path='/portfolios/:id'   component={PositionsPage}/>
          </Switch>
        </Grid.Column>
        <Grid.Column width={5} style={{paddingLeft:'5px'}}>
          <HeadlinesPage/>
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageFooter() {
    return (
      <Grid.Row columns={1}>
        <Grid.Column>
          {this.pageFooterRow()}
        </Grid.Column>
      </Grid.Row>
    );
  }

  // <Button content='Refresh' icon='refresh' title='Refresh portfolios' loading={updatingPortfolio} compact inverted size='tiny' style={{paddingRight:'3px', color:'purple'}} onClick={() => refreshPortfolios()}/>
  pageFooterRow() {
    return (
      <Table compact striped style={{marginTop:0}}>
        <Table.Header>
          <Table.Row textAlign='center'>
            <Table.HeaderCell>
              <span style={{color:'grey', textAlign:'center'}}>
                            &bull; Historical data by <a href='https://www.alphavantage.co' target='_blank' rel='noopener noreferrer'>Alpha Vantage</a>
                &emsp;&ensp;&bull; Market data by <a href='https://iexcloud.io' target='_blank' rel='noopener noreferrer'>IEX</a>
                &emsp;&ensp;&bull; Headline news by <a href='https://newsapi.org' target='_blank' rel='noopener noreferrer'>NewsAPI.org</a>
                &emsp;&ensp;&bull; DJIA by <a href='https://finance.yahoo.com/' target='_blank' rel='noopener noreferrer'>Yahoo Finance</a>
                &emsp;&ensp;&bull; The prices shown may not be the correct prices or the latest prices.
                &emsp;&ensp;&bull; See <HelpPage trigger={<Button content='Help->Usage Notes' className='link' inverted size='medium' style={{paddingLeft:'2px', paddingRight:'1px', color:'#1e70bf'}}/>}/>for more information.
              </span>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
    );
  }

  pageHeader() {
    return (
      <Grid.Row columns={1}>
        <Grid.Column stretched>
          <Image src='/images/logo.jpg'/>
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageMenu() {
    return (
      <Grid.Row columns={1}>
        <Grid.Column>
          <Menu>
            {this.pageMenuLeft()}
            {this.pageMenuCenter()}
            {this.pageMenuRight()}
          </Menu>
        </Grid.Column>
      </Grid.Row>
    );
  }

  pageMenuLeft() {
    return (
      <Header className='shadow' color='purple' size='large' style={{lineHeight:0.75, marginRight:0, marginLeft:'1em', marginTop:'.5em', marginBottom:'.5em'}}>
        Portfolio Analyzer
      </Header>
    );
  }

  pageMenuCenter() {
    return (
      <Menu.Menu position='left'>
        <Menu.Item style={{padding:'.8em'}}></Menu.Item>
        <Menu.Item as={Link} to='/'>Portfolios</Menu.Item>
        {<SymbolsPage/>}
      </Menu.Menu>
    );
  }

  pageMenuRight() {
    return (
      <Menu.Menu position='right'>
        {<LoginPage/>}
        {this.menuItemAdmin()}
        {<SettingsEditPage/>}
        {this.menuItemHelp()}
      </Menu.Menu>
    );
  }

  render() {
    return (
      <Router>
        <Grid padded stackable>
          {this.pageHeader()}
          {this.pageMenu()}
          {this.pageBody()}
          {this.pageFooter()}
        </Grid>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {state: state}
}

export const WrapperApp = connect(mapStateToProps)(App)
