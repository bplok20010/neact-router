'use strict';

import warning from 'warning';
import Neact from 'neact';

import _assign from 'object-assign';

const Router = Neact.createClass({
    construct(props) {
        if (!props.history) {
            throw new TypeError('history must be required!');
        }

        this.state.match = this.computeMatch(props.history.location.pathname);
    },

    getChildContext() {
        return {
            router: _assign({}, this.context.router, {
                history: this.props.history,
                route: {
                    location: this.props.history.location,
                    match: this.state.match
                }
            })
        };
    },

    computeMatch(pathname) {
        return {
            path: '/',
            url: '/',
            params: {},
            isExact: pathname === '/'
        };
    },

    render() {
        const { children } = this.props;
        return children ? Neact.Children.only(children) : null;
    },

    componentWillMount() {
        const { children, history } = this.props;

        this.unlisten = history.listen(() => {
            this.setState({
                match: this.computeMatch(history.location.pathname)
            });
        });
    },

    componentWillReceiveProps(nextProps) {
        warning(
            this.props.history === nextProps.history,
            'You cannot change <Router history>'
        );
    },

    componentWillUnmount() {
        this.unlisten();
    }
});

export default Router;