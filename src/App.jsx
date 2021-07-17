import React, { useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import "./assets/tailwind.css"
import { initialise } from "./helpers/config"
import Home from "./pages/Home"
import Game from "./pages/Game"

function App() {
	useEffect(() => {
		initialise()
	}, [])

	return (
		<div className="w-screen min-h-screen bg-gray-50 md:flex md:flex-row md:justify-center">
			<div className="min-h-screen flex flex-col bg-gray-50 justify-start items-stretch text-center md:w-2/3 p-8 md:p-8 md:pt-24">
				<Router>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/:code" component={Game} />
					</Switch>
				</Router>
			</div>
		</div>
	)
}

export default App
