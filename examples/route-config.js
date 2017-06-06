"use strict";
/*@jsx Neact.createElement*/

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Router = NeactRouter.BrowserRouter,
    Route = NeactRouter.Route,
    Switch = NeactRouter.Switch,
    Link = NeactRouter.Link;

var React = Neact;

// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

////////////////////////////////////////////////////////////
// first our route components
var Main = function () {
  return Neact.createElement(
    "h2",
    null,
    "Main"
  );
};

var Sandwiches = function () {
  return Neact.createElement(
    "h2",
    null,
    "Sandwiches"
  );
};

var Tacos = function (_ref) {
  var routes = _ref.routes;
  return Neact.createElement(
    "div",
    null,
    Neact.createElement(
      "h2",
      null,
      "Tacos"
    ),
    Neact.createElement(
      "ul",
      null,
      Neact.createElement(
        "li",
        null,
        Neact.createElement(
          Link,
          { to: "/tacos/bus" },
          "Bus"
        )
      ),
      Neact.createElement(
        "li",
        null,
        Neact.createElement(
          Link,
          { to: "/tacos/cart" },
          "Cart"
        )
      )
    ),
    routes.map(function (route, i) {
      return Neact.createElement(RouteWithSubRoutes, _extends({ key: i }, route));
    })
  );
};

var Bus = function () {
  return Neact.createElement(
    "h3",
    null,
    "Bus"
  );
};
var Cart = function () {
  return Neact.createElement(
    "h3",
    null,
    "Cart"
  );
};

////////////////////////////////////////////////////////////
// then our route config
var routes = [{ path: '/sandwiches',
  component: Sandwiches
}, { path: '/tacos',
  component: Tacos,
  routes: [{ path: '/tacos/bus',
    component: Bus
  }, { path: '/tacos/cart',
    component: Cart
  }]
}];

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
var RouteWithSubRoutes = function (route) {
  return Neact.createElement(Route, { path: route.path, render: function (props) {
      return (
        // pass the sub-routes down to keep nesting
        Neact.createElement(route.component, _extends({}, props, { routes: route.routes }))
      );
    } });
};

var RouteConfigExample = function () {
  return Neact.createElement(
    Router,
    { history: History.createHashHistory() },
    Neact.createElement(
      "div",
      null,
      Neact.createElement(
        "ul",
        null,
        Neact.createElement(
          "li",
          null,
          Neact.createElement(
            Link,
            { to: "/tacos" },
            "Tacos"
          )
        ),
        Neact.createElement(
          "li",
          null,
          Neact.createElement(
            Link,
            { to: "/sandwiches" },
            "Sandwiches"
          )
        )
      ),
      routes.map(function (route, i) {
        return Neact.createElement(RouteWithSubRoutes, _extends({ key: i }, route));
      })
    )
  );
};

Neact.render(Neact.createElement(RouteConfigExample, null), demo);