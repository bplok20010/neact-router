"use strict";
/*@jsx Neact.createElement*/

var Router = NeactRouter.Router,
    Route = NeactRouter.Route,
    Link = NeactRouter.Link;

var PEEPS = [{ id: 0, name: 'Michelle', friends: [1, 2, 3] }, { id: 1, name: 'Sean', friends: [0, 3] }, { id: 2, name: 'Kim', friends: [0, 1, 3] }, { id: 3, name: 'David', friends: [1, 2] }];

var find = function (id) {
  return PEEPS.find(function (p) {
    return p.id == id;
  });
};

var RecursiveExample = function () {
  return Neact.createElement(
    Router,
    { history: History.createHashHistory() },
    Neact.createElement(Person, { match: { params: { id: 0 }, url: '' } })
  );
};

var Person = function (_ref) {
  var match = _ref.match;

  var person = find(match.params.id);
  console.log(match.params);
  return Neact.createElement(
    'div',
    null,
    Neact.createElement(
      'h3',
      null,
      person.name,
      '\u2019s Friends'
    ),
    Neact.createElement(
      Link,
      { to: {
          pathname: '/3',
          search: '?sort=name',
          hash: '#the-hash',
          state: { fromDashboard: true }
        } },
      'Test'
    ),
    Neact.createElement(Route, { path: '/3', component: function (props) {
        console.log(props);return 'search...';
      } }),
    Neact.createElement(
      'ul',
      null,
      person.friends.map(function (id) {
        return Neact.createElement(
          'li',
          { key: id },
          Neact.createElement(
            Link,
            { to: match.url + '/' + id, search: '?name=nobo' },
            find(id).name
          )
        );
      })
    ),
    Neact.createElement(Route, { path: match.url + '/:id', component: Person })
  );
};

Neact.render(Neact.createElement(RecursiveExample, null), demo);