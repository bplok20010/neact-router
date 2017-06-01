'use strict';

import warning from 'warning';
import * as Neact from 'neact';
import matchPath from './matchPath';

import _assign from 'object-assign';

import {
    isArray,
    normalizeUrl
} from './shared';

const Route = Neact.createClass({
    construct(props, context) {
        this.normalizePath(props, context);

        this.state.match = this.computeMatch(props, context.router);
    },

    normalizePath(props, context) {
        const router = context.router;
        const baseUrl = router.route.match ? router.route.match.url : '/';

        props.path = normalizeUrl(props.path, baseUrl);
    },

    computeMatch({ location, path, strict, exact, computedMatch }, { route }) {
        if (computedMatch) {
            return computedMatch;
        }

        const pathname = (location || route.location).pathname;

        return path ? matchPath(pathname, { path, strict, exact }) : route.match;
    },

    getChildContext() {
        return {
            router: _assign({}, this.context.router, {
                route: {
                    location: this.props.location || this.context.router.route.location,
                    match: this.state.match
                }
            })
        };
    },

    componentWillMount() {
        const { component, render, children } = this.props;

        warning(!(component && render),
            'You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored'
        );

        warning(!(component && children),
            'You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored'
        );

        warning(!(render && children),
            'You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored'
        );
    },

    componentWillReceiveProps(nextProps, nextContext) {
        warning(!(nextProps.location && !this.props.location),
            '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
        );

        warning(!(!nextProps.location && this.props.location),
            '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
        );

        this.normalizePath(nextProps, nextContext);

        this.setState({
            match: this.computeMatch(nextProps, nextContext.router)
        });
    },

    render() {
        const { match } = this.state;
        const { children, component, render } = this.props;
        const { history, route, staticContext } = this.context.router;
        const location = this.props.location || route.location;
        const props = { match, location, history, staticContext };

        return (
            component ? ( // component prop gets first priority, only called if there's a match
                match ? Neact.createElement(component, props, children) : null
            ) : render ? ( // render prop is next, only called if there's a match
                match ? render(props) : null
            ) : children ? ( // children come last, always called
                typeof children === 'function' ? (
                    children(props)
                ) : !isArray(children) || children.length ? ( // Preact defaults to empty children array
                    Neact.Children.only(children)
                ) : (
                    null
                )
            ) : (
                null
            )
        )
    }
});

export default Route;