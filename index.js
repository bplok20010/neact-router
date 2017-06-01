"use strict";

var Router = NeactRouter.Router,
    Route = NeactRouter.Route;
function App() {
	return React.createElement(
		Router,
		null,
		React.createElement(
			Route,
			{ path: "/" },
			"Hello"
		)
	);
}
