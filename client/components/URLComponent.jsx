import React from "react";
import { Link } from "react-router-dom";

const URLComponent = ({ url }) => {
    return (
        <div>
            <a href={url}>Hi</a>
        </div>
    )
}

export default URLComponent;