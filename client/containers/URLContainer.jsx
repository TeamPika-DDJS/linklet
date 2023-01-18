import React, { useState, useEffect } from "react";
import URLComponent from "../components/URLComponent"

// username comes from App
const ListContainer = ({ userName }) => {
    // dynamically rendered state from backend using userName
    const [links, setLinks] = useState({
        1: "https://www.google.com",
        2: "http://www.yahoo.com",
        3: "http://www.msn.com"
    })
    const URLs = Object.values(links).map((url, i) => <URLComponent key={i} url={url} />);

    return (
        <div>
            <h3>This {userName}'s list</h3>
            {URLs}
        </div>
    )
}

export default ListContainer;