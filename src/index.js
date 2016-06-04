import React from "react";
import ReactDOM from "react-dom";
import Layout from "./components/Layout"

let mountNode = document.createElement("div");
document.body.appendChild(mountNode);

ReactDOM.render(<Layout/>, mountNode);