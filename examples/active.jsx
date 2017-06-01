"use strict";
/*@jsx Neact.createElement*/
var Router = NeactRouter.Router,
    Route = NeactRouter.Route,
    Switch = NeactRouter.Switch,
	Link = NeactRouter.Link;
var React = Neact;

var uid = 1;

const CustomLinkExample = () => (
  <Router history={History.createHashHistory()}>
    <div>
      <OldSchoolMenuLink activeOnlyWhenExact={true} to="/" label="Home"/>
      <OldSchoolMenuLink to="/about" label="About"/>
      <Route path="/test/:myId" children={()=> (
          <div>
              <Link to="./mmms">{uid++}</Link>
              <Route path="./:You" component={About} />
          </div>
        )}>
        
      </Route>
      <hr/>
      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
    </div>
  </Router>
)

const OldSchoolMenuLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <div className={match ? 'active' : ''}>
      {match ? '> ' : ''}<Link to={to}>{label}</Link>
    </div>
  )}/>
)

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = (props) => {
  console.log(props)
  
return  (
  <div>
    <h2>About</h2>
  </div>
)}

Neact.render((
	<CustomLinkExample />
), demo);