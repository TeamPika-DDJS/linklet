import React from "react";
import ListContainer from "./ListContainer"

const Home = () => {

    return (
        <div>
            <h3>My lists</h3>
            <ListContainer />

            <h3>All other lists</h3>
            <ListContainer />

        </div>
    )
}

export default Home;