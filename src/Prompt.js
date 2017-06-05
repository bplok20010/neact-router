'use strict';
import Neact from 'neact';

/**
 * The public API for prompting the user before navigating away
 * from a screen with a component.
 */
const Prompt = Neact.createClass({

  

  enable(message) {
    if (this.unblock)
      this.unblock();

    this.unblock = this.context.router.history.block(message);
  },

  disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = null;
    }
  },

  componentWillMount() {
    if (this.props.when)
      this.enable(this.props.message);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.when) {
      if (!this.props.when || this.props.message !== nextProps.message)
        this.enable(nextProps.message);
    } else {
      this.disable();
    }
  },

  componentWillUnmount() {
    this.disable();
  },

  render() {
    return null;
  }
});

Prompt.defaultProps = {
    when: true
};

export default Prompt
