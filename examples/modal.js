"use strict";
/*@jsx Neact.createElement*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Router = NeactRouter.Router,
    Route = NeactRouter.Route,
    Switch = NeactRouter.Switch,
    Link = NeactRouter.Link;
var React = Neact;

var ModalSwitch = function (_React$Component) {
  _inherits(ModalSwitch, _React$Component);

  // We can pass a location to <Switch/> that will tell it to
  // ignore the router's current location and use the location
  // prop instead.
  //
  // We can also use "location state" to tell the app the user
  // wants to go to `/images/2` in a modal, rather than as the
  // main page, keeping the gallery visible behind it.
  //
  // Normally, `/images/2` wouldn't match the gallery at `/`.
  // So, to get both screens to render, we can save the old
  // location and pass it to Switch, so it will think the location
  // is still `/` even though its `/images/2`.
  function ModalSwitch() {
    var _ref;

    _classCallCheck(this, ModalSwitch);

    for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
      a[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = ModalSwitch.__proto__ || Object.getPrototypeOf(ModalSwitch)).call.apply(_ref, [this].concat(a)));

    _this.previousLocation = _this.props.location;
    return _this;
  }

  _createClass(ModalSwitch, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      var location = this.props.location;
      // set previousLocation if props.location is not modal

      if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
        this.previousLocation = this.props.location;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var location = this.props.location;

      var isModal = !!(location.state && location.state.modal && this.previousLocation !== location // not initial render
      );
      return Neact.createElement(
        'div',
        null,
        Neact.createElement(
          Switch,
          { location: isModal ? this.previousLocation : location },
          Neact.createElement(Route, { exact: true, path: '/', component: Home }),
          Neact.createElement(Route, { path: '/gallery', component: Gallery }),
          Neact.createElement(Route, { path: '/img/:id', component: ImageView })
        ),
        isModal ? Neact.createElement(Route, { path: '/img/:id', component: Modal }) : null
      );
    }
  }]);

  return ModalSwitch;
}(React.Component);

var IMAGES = [{ id: 0, title: 'Dark Orchid', color: 'DarkOrchid' }, { id: 1, title: 'Lime Green', color: 'LimeGreen' }, { id: 2, title: 'Tomato', color: 'Tomato' }, { id: 3, title: 'Seven Ate Nine', color: '#789' }, { id: 4, title: 'Crimson', color: 'Crimson' }];

var Thumbnail = function (_ref2) {
  var color = _ref2.color;
  return Neact.createElement('div', { style: {
      width: 50,
      height: 50,
      background: color
    } });
};

var Image = function (_ref3) {
  var color = _ref3.color;
  return Neact.createElement('div', { style: {
      width: '100%',
      height: 400,
      background: color
    } });
};

var Home = function () {
  return Neact.createElement(
    'div',
    null,
    Neact.createElement(
      Link,
      { to: '/gallery' },
      'Visit the Gallery'
    ),
    Neact.createElement(
      'h2',
      null,
      'Featured Images'
    ),
    Neact.createElement(
      'ul',
      null,
      Neact.createElement(
        'li',
        null,
        Neact.createElement(
          Link,
          { to: '/img/2' },
          'Tomato'
        )
      ),
      Neact.createElement(
        'li',
        null,
        Neact.createElement(
          Link,
          { to: '/img/4' },
          'Crimson'
        )
      )
    )
  );
};

var Gallery = function () {
  return Neact.createElement(
    'div',
    null,
    IMAGES.map(function (i) {
      return Neact.createElement(
        Link,
        {
          key: i.id,
          to: {
            pathname: '/img/' + i.id,
            search: '?a=5',
            // this is the trick!
            state: { modal: true }
          }
        },
        Neact.createElement(Thumbnail, { color: i.color }),
        Neact.createElement(
          'p',
          null,
          i.title
        )
      );
    })
  );
};

var ImageView = function (_ref4) {
  var match = _ref4.match;

  var image = IMAGES[parseInt(match.params.id, 10)];
  if (!image) {
    return Neact.createElement(
      'div',
      null,
      'Image not found'
    );
  }

  return Neact.createElement(
    'div',
    null,
    Neact.createElement(
      'h1',
      null,
      image.title
    ),
    Neact.createElement(Image, { color: image.color })
  );
};

var Modal = function (_ref5) {
  var match = _ref5.match,
      history = _ref5.history;

  var image = IMAGES[parseInt(match.params.id, 10)];
  if (!image) {
    return null;
  }
  var back = function (e) {
    e.stopPropagation();
    history.goBack();
  };
  return Neact.createElement(
    'div',
    {
      onClick: back,
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.15)'
      }
    },
    Neact.createElement(
      'div',
      { className: 'modal', style: {
          position: 'absolute',
          background: '#fff',
          top: 25,
          left: '10%',
          right: '10%',
          padding: 15,
          border: '2px solid #444'
        } },
      Neact.createElement(
        'h1',
        null,
        image.title
      ),
      Neact.createElement(Image, { color: image.color }),
      Neact.createElement(
        'button',
        { type: 'button', onClick: back },
        'Close'
      )
    )
  );
};

var ModalGallery = function () {
  return Neact.createElement(
    Router,
    { history: History.createHashHistory() },
    Neact.createElement(Route, { path: '/', component: ModalSwitch })
  );
};

Neact.render(Neact.createElement(ModalGallery, null), demo);