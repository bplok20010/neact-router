'use strict';

import * as Neact from 'neact';
import {
    isObject
} from './shared';

import _assign from 'object-assign';

import Route from './Route';
import Link from './Link';

const NavLink = ({
    to,
    exact,
    strict,
    activeClassName,
    className,
    activeStyle,
    style,
    isActive: getIsActive,
    ...rest
}) => (
    Neact.createElement(Route, {
        path: isObject(to) ? to.pathname : to,
        exact,
        strict,
        children: ({ location, match }) => {
            const isActive = !!(getIsActive ? getIsActive(match, location) : match);

            return Neact.createElement(Link, _assign({}, rest, {
                to,
                className: isActive ? [activeClassName, className].join(' ') : className,
                style: isActive ? _assign({}, style, activeStyle) : style
            }));
        }
    })
);

NavLink.defaultProps = {
    activeClassName: 'active'
};

export default NavLink;