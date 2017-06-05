let i=1;
const React = Neact

class Content extends React.Component{
	render(){
		console.log('35')
		return <div>{i++}</div>
	}
}

class Router extends React.Component {
	render(){
		var children = this.props.children;
		console.log('34')
		return React.Children.only(children);
	}
	
	getChildContext() {
		return {
			ta: 12
		}
	}
	
	componentDidMount(){
		console.log('...')
		setInterval(()=>{
			console.log('interval')
			this.forceUpdate();
		},1000)
	}
}

class App extends React.Component {
	render(){
		return (
		<Router>
			<div><h1>Title{i++}</h1>
				<Content />
			</div>
		</Router>
		);
	}
}

Neact.render(<App />, demo);