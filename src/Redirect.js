'use strict';

import Neact from 'neact';

const Redirect = Neact.createClass({
    isStatic() {
        return this.context.router && this.context.router.staticContext;
    },

    componentWillMount() {
        if (this.isStatic()) {
            this.perform();
        }
    },

    componentDidMount() {
        if (!this.isStatic()) {
            this.perform();
        }
    },

    perform() {
        const { history } = this.context.router;
        const { push, to } = this.props;

        if (push) {
            history.push(to);
        } else {
            history.replace(to);
        }
    },

    render() {
        return null;
    }
});

Redirect.displayName = "Redirect";

Redirect.defaultProps = {
    push: false
};

export default Redirect;