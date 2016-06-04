import React from "react";

class Layout extends React.Component {
  constructor (props) {
    super(props);
    this.state = {}
  }

  render () {
    return (
      <form action="">
        <input type="text"/>
        <button>Submit</button>
      </form>
    );
  }
}

export default Layout;