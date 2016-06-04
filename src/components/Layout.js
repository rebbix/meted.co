import React from "react";
import Search from "./Search"
import Payload from "./Payload"

class Layout extends React.Component {
  constructor (props) {
    super(props);
    this.state = {}
  }
  render () {
    return (
      <div className="layout">
        <div className="layout__search">
          <Search/>
        </div>
        <div className="layout__payload"><Payload/></div>
      </div>
    )
  }
}

export default Layout;