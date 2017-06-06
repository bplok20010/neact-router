/*@jsx Neact.createElement*/
'use strict';
import * as Neact from 'neact';
import createHistory from 'history/es/createMemoryHistory'
import Router from './Router'

/**
 * The public API for a <Router> that stores location in memory.
 */
const MemoryRouter = Neact.createClass({
    construct(){
        this.history = createHistory(this.props);
    },
    render() {
        return <Router history={this.history} children={this.props.children} />
    }
});

export default MemoryRouter
