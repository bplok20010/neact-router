"use strict";
/*@jsx Neact.createElement*/

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _NeactRouter = NeactRouter,
    Router = _NeactRouter.Router,
    Route = _NeactRouter.Route,
    Switch = _NeactRouter.Switch,
    Link = _NeactRouter.Link,
    Redirect = _NeactRouter.Redirect;


var NoMatchExample = function () {
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
            { to: "/" },
            "Home"
          )
        ),
        Neact.createElement(
          "li",
          null,
          Neact.createElement(
            Link,
            { to: "/old-match" },
            "Old Match, to be redirected"
          )
        ),
        Neact.createElement(
          "li",
          null,
          Neact.createElement(
            Link,
            { to: "/will-match" },
            "Will Match"
          )
        ),
        Neact.createElement(
          "li",
          null,
          Neact.createElement(
            Link,
            { to: "/will-not-match" },
            "Will Not Match"
          )
        ),
        Neact.createElement(
          "li",
          null,
          Neact.createElement(
            Link,
            { to: "/also/will/not/match" },
            "Also Will Not Match"
          )
        )
      ),
      Neact.createElement(
        Switch,
        null,
        Neact.createElement(Route, { path: "/", exact: true, component: Home }),
        Neact.createElement(Redirect, { from: "/old-match", to: "/will-match" }),
        Neact.createElement(Route, { path: "/will-match", component: WillMatch }),
        Neact.createElement(Route, { component: NoMatch })
      )
    )
  );
};

var Home = function () {
  return Neact.createElement(
    "p",
    null,
    "A ",
    Neact.createElement(
      "code",
      null,
      "<Switch>"
    ),
    " renders the first child ",
    Neact.createElement(
      "code",
      null,
      "<Route>"
    ),
    " that matches. A ",
    Neact.createElement(
      "code",
      null,
      "<Route>"
    ),
    " with no ",
    Neact.createElement(
      "code",
      null,
      "path"
    ),
    " always matches."
  );
};

var WillMatch = function () {
  return Neact.createElement(
    "h3",
    null,
    "Matched!"
  );
};

var NoMatch = function (_ref) {
  var location = _ref.location;
  return Neact.createElement(
    "div",
    null,
    Neact.createElement(
      "h3",
      null,
      "No match for ",
      Neact.createElement(
        "code",
        null,
        location.pathname
      )
    )
  );
};

function s(_ref2) {
  var a = _ref2.a,
      b = _ref2.b,
      c = _ref2.c,
      z = _objectWithoutProperties(_ref2, ["a", "b", "c"]);

  return {
    n: 3,
    a: 8,
    b: 1
  };
}

console.log(s({
  a: 1, b: 0, c: 1, x: 1, y: 1, n: 2
}));

Neact.render(Neact.createElement(NoMatchExample, null), demo);