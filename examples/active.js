"use strict";
/*@jsx Neact.createElement*/

var Router = NeactRouter.Router,
    Route = NeactRouter.Route,
    Switch = NeactRouter.Switch,
    Link = NeactRouter.Link;
var React = Neact;

var uid = 1;

var CustomLinkExample = function () {
  return Neact.createElement(
    Router,
    { history: History.createHashHistory() },
    Neact.createElement(
      "div",
      null,
      Neact.createElement(OldSchoolMenuLink, { activeOnlyWhenExact: true, to: "/", label: "Home" }),
      Neact.createElement(OldSchoolMenuLink, { to: "/about", label: "About" }),
      Neact.createElement(Route, { path: "/test/:myId", children: function () {
          return Neact.createElement(
            "div",
            null,
            Neact.createElement(
              Link,
              { to: "./mmms" },
              uid++
            ),
            Neact.createElement(Route, { path: "./:You", component: About })
          );
        } }),
      Neact.createElement("hr", null),
      Neact.createElement(Route, { exact: true, path: "/", component: Home }),
      Neact.createElement(Route, { path: "/about", component: About })
    )
  );
};

var OldSchoolMenuLink = function (_ref) {
  var label = _ref.label,
      to = _ref.to,
      activeOnlyWhenExact = _ref.activeOnlyWhenExact;
  return Neact.createElement(Route, { path: to, exact: activeOnlyWhenExact, children: function (_ref2) {
      var match = _ref2.match;
      return Neact.createElement(
        "div",
        { className: match ? 'active' : '' },
        match ? '> ' : '',
        Neact.createElement(
          Link,
          { to: to },
          label
        )
      );
    } });
};

var Home = function () {
  return Neact.createElement(
    "div",
    null,
    Neact.createElement(
      "h2",
      null,
      "Home"
    )
  );
};

var About = function (props) {
  console.log(props);

  return Neact.createElement(
    "div",
    null,
    Neact.createElement(
      "h2",
      null,
      "About"
    )
  );
};

Neact.render(Neact.createElement(CustomLinkExample, null), demo);