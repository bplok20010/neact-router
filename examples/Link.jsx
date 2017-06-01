"use strict";
/*@jsx Neact.createElement*/
var Router = NeactRouter.Router,
    Route = NeactRouter.Route,
	Link = NeactRouter.Link;

const PEEPS = [
  { id: 0, name: 'Michelle', friends: [ 1, 2, 3 ] },
  { id: 1, name: 'Sean', friends: [ 0, 3 ] },
  { id: 2, name: 'Kim', friends: [ 0, 1, 3 ], },
  { id: 3, name: 'David', friends: [ 1, 2 ] }
]

const find = (id) => PEEPS.find(p => p.id == id)

const RecursiveExample = () => (
  <Router history={History.createHashHistory()}>
    <Person match={{ params: { id: 0 }, url: '' }}/>
  </Router>
)

const Person = ({ match }) => {
  const person = find(match.params.id)
  console.log(match.params);
  return (
    <div>
      <h3>{person.name}’s Friends</h3>
      <Link to={{
        pathname: '/3',
        search: '?sort=name',
        hash: '#the-hash',
        state: { fromDashboard: true }
      }}>Test</Link>
      <Route path="/3" component={(props)=> { console.log(props); return 'search...'}} />
      <ul>
        {person.friends.map(id => (
          <li key={id}>
            <Link to={`${match.url}/${id}`} search="?name=nobo">
              {find(id).name}
            </Link>
          </li>
        ))}
      </ul>
      <Route path={`${match.url}/:id`} component={Person}/>
    </div>
  )
}	


Neact.render((
	<RecursiveExample />
), demo);