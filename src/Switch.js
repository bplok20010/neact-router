'use strict';

import * as Neact from 'neact';
import warning from 'warning';
import matchPath from './matchPath';
import _assign from 'object-assign';
import {
    isNullOrUndef,
    normalizeUrl
} from './shared';

const Switch = Neact.createClass({
    componentWillReceiveProps(nextProps) {
        warning(!(nextProps.location && !this.props.location),
            '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
        );

        warning(!(!nextProps.location && this.props.location),
            '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
        );
    },

    render() {
        const { route } = this.context.router;
        const { children } = this.props;
        const location = this.props.location || route.location;
        const baseName = route.match ? route.match.url : '/';

        let match, child;
        Neact.Children.forEach(children, element => {
            if (!Neact.isValidElement(element)) { return; }

            const { path: pathProp, exact, strict, from } = element.props;
            let path = pathProp || from;

            if (isNullOrUndef(match)) {
                child = element;
                match = path ? matchPath(location.pathname, { path: normalizeUrl(path, baseName), exact, strict }) : route.match;
            }
        });

        child.props = _assign(child.props || (child.props = {}), { location, computedMatch: match })

        return match ? child : null;
    }
});

export default Switch;