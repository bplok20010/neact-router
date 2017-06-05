'use strict';

import Neact from 'neact';
import _assign from 'object-assign';

const isModifiedEvent = (event) =>
    !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const Link = Neact.createClass({
    handleClick(event) {
        if (this.props.onClick) {
            this.props.onClick(event);
        }

        if (!event.defaultPrevented && // onClick prevented default
            event.button === 0 && // ignore right clicks
            !this.props.target && // let browser handle "target=_blank" etc.
            !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
            event.preventDefault();

            const { history, route } = this.context.router;
            let { replace, to } = this.props;

            if (replace) {
                history.replace(to);
            } else {
                history.push(to);
            }
        }
    },

    render() {
        let { replace, to, ...props } = this.props;

        const href = this.context.router.history.createHref(
            typeof to === 'string' ? { pathname: to } : to
        );

        return Neact.createElement('a', _assign({}, props, {
            onClick: (e) => this.handleClick(e),
            href: href
        }));
    }

});

Link.defaultProps = {
    replace: false
};

export default Link;