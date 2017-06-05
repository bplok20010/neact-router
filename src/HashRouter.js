/*@jsx Neact.createElement*/
'use strict';
import Neact from 'neact';
import createHistory from 'history/es/createHashHistory';
import Router from './Router';

/**
 * The public API for a <Router> that uses window.location.hash.
 */
const HashRouter = Neact.createClass({
    construct(){
        this.history = createHistory(this.props);
    },
    render() {
        return <Router history={this.history} children={this.props.children} />
    }
});

export default HashRouter
