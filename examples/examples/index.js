"use strict";
/*@jsx Neact.createElement*/

var Router = NeactRouter.Router,
    Route = NeactRouter.Route,
    Link = NeactRouter.Link;

var BasicExample = function () {
  return Neact.createElement(
    Router,
    null,
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
            { to: "/about" },
            "About"
          )
        ),
        Neact.createElement(
          "li",
          null,
          Neact.createElement(
            Link,
            { to: "/topics" },
            "Topics"
          )
        )
      ),
      Neact.createElement("hr", null),
      Neact.createElement(Route, { exact: true, path: "/", component: Home }),
      Neact.createElement(Route, { path: "/about", component: About }),
      Neact.createElement(Route, { path: "/topics", component: Topics })
    )
  );
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

var About = function () {
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

var Topics = function (_ref) {
  var match = _ref.match;
  return Neact.createElement(
    "div",
    null,
    Neact.createElement(
      "h2",
      null,
      "Topics"
    ),
    Neact.createElement(
      "ul",
      null,
      Neact.createElement(
        "li",
        null,
        Neact.createElement(
          Link,
          { to: match.url + "/rendering" },
          "Rendering with React"
        )
      ),
      Neact.createElement(
        "li",
        null,
        Neact.createElement(
          Link,
          { to: match.url + "/components" },
          "Components"
        )
      ),
      Neact.createElement(
        "li",
        null,
        Neact.createElement(
          Link,
          { to: match.url + "/props-v-state" },
          "Props v. State"
        )
      )
    ),
    Neact.createElement(Route, { path: match.url + "/:topicId", component: Topic }),
    Neact.createElement(Route, { exact: true, path: match.url, render: function () {
        return Neact.createElement(
          "h3",
          null,
          "Please select a topic."
        );
      } })
  );
};

var Topic = function (_ref2) {
  var match = _ref2.match;
  return Neact.createElement(
    "div",
    null,
    Neact.createElement(
      "h3",
      null,
      match.params.topicId
    )
  );
};

Neact.render(Neact.createElement(BasicExample, null), demo);