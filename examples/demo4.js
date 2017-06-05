'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var i = 1;
var React = Neact;

var Content = function (_React$Component) {
	_inherits(Content, _React$Component);

	function Content() {
		_classCallCheck(this, Content);

		return _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).apply(this, arguments));
	}

	_createClass(Content, [{
		key: 'render',
		value: function render() {
			console.log('35');
			return React.createElement(
				'div',
				null,
				i++
			);
		}
	}]);

	return Content;
}(React.Component);

var Router = function (_React$Component2) {
	_inherits(Router, _React$Component2);

	function Router() {
		_classCallCheck(this, Router);

		return _possibleConstructorReturn(this, (Router.__proto__ || Object.getPrototypeOf(Router)).apply(this, arguments));
	}

	_createClass(Router, [{
		key: 'render',
		value: function render() {
			var children = this.props.children;
			console.log('34');
			return React.Children.only(children);
		}
	}, {
		key: 'getChildContext',
		value: function getChildContext() {
			return {
				ta: 12
			};
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this3 = this;

			console.log('...');
			setInterval(function () {
				console.log('interval');
				_this3.forceUpdate();
			}, 1000);
		}
	}]);

	return Router;
}(React.Component);

var App = function (_React$Component3) {
	_inherits(App, _React$Component3);

	function App() {
		_classCallCheck(this, App);

		return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
	}

	_createClass(App, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				Router,
				null,
				React.createElement(
					'div',
					null,
					React.createElement(
						'h1',
						null,
						'Title',
						i++
					),
					React.createElement(Content, null)
				)
			);
		}
	}]);

	return App;
}(React.Component);

Neact.render(React.createElement(App, null), demo);