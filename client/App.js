import { stringLiteral } from "@babel/types";
import React from "react";
import {  
    HashRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Home from "./containers/Home";
import URLComponent from "./components/URLComponent";

const App = () => {
    return (
        <>
        <Router>
            <Routes>
                <Route
                exact 
                path="/"
                element={<Home />}
                />
                <Route 
                exact
                path="/banana"
                element={<URLComponent />}
                />
            </Routes>
        </Router>
        </>
    )
}

export default App;
