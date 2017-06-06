/*@jsx Neact.createElement*/
'use strict';
import * as Neact from 'neact';
import { addLeadingSlash, createPath, parsePath } from 'history/es/PathUtils';
import Router from './Router';

const normalizeLocation = (object) => {
    const { pathname = '/', search = '', hash = '' } = object

    return {
        pathname,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash
    }
}

const addBasename = (basename, location) => {
    if (!basename)
        return location

    return {
        ...location,
        pathname: addLeadingSlash(basename) + location.pathname
    }
}

const stripBasename = (basename, location) => {
    if (!basename)
        return location

    const base = addLeadingSlash(basename)

    if (location.pathname.indexOf(base) !== 0)
        return location

    return {
        ...location,
        pathname: location.pathname.substr(base.length)
    }
}

const createLocation = (location) =>
    typeof location === 'string' ? parsePath(location) : normalizeLocation(location)

const createURL = (location) =>
    typeof location === 'string' ? location : createPath(location)

const staticHandler = (methodName) => () => {
    throw new Error(`You cannot %{methodName} with <StaticRouter>`);
}

const noop = () => {}

/**
 * The public top-level API for a "static" <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */
const StaticRouter = Neact.createClass({

    getChildContext() {
        return {
            router: {
                staticContext: this.props.context
            }
        }
    },

    createHref(path) {
        return addLeadingSlash(this.props.basename + createURL(path))
    },

    handlePush(location) {
        const { basename, context } = this.props
        context.action = 'PUSH'
        context.location = addBasename(basename, createLocation(location))
        context.url = createURL(context.location)
    },

    handleReplace(location) {
        const { basename, context } = this.props
        context.action = 'REPLACE'
        context.location = addBasename(basename, createLocation(location))
        context.url = createURL(context.location)
    },

    handleListen(){ return noop},

    handleBlock(){ return noop},

    render() {
        const { basename, context, location, ...props } = this.props

        const history = {
            createHref: this.createHref,
            action: 'POP',
            location: stripBasename(basename, createLocation(location)),
            push: this.handlePush,
            replace: this.handleReplace,
            go: staticHandler('go'),
            goBack: staticHandler('goBack'),
            goForward: staticHandler('goForward'),
            listen: this.handleListen,
            block: this.handleBlock
        }

        return <Router {...props } history = { history } />
    }
});

StaticRouter.defaultProps = {
        basename: '',
        location: '/'
    }

export default StaticRouter