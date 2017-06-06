/*@jsx Neact.createElement*/
'use strict';
import * as Neact from 'neact';
import createHistory from 'history/es/createBrowserHistory';
import Router from './Router';

/**
 * The public API for a <Router> that uses HTML5 history.
 */
const BrowserRouter = Neact.createClass({
    construct(){
        this.history = createHistory(this.props);
    },
    render() {
        return <Router history={this.history} children={this.props.children} />
    }
});

export default BrowserRouter
