import React from "react";

import Actions from "../actions/Photos";
import Store from "../storage/Photos";

class Search extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      searchString : "Iceland"
    }
  }

  search (ev) {
    this.setState({searchString: this.refs.searchField.value})
  }

  submitSearch (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    Actions.searchUpdate(this.state.searchString);
    this.setState({searching: true})
  }

  componentDidMount () {this.unsubscribe = Store.listen(this.onStatusChange.bind(this));}

  componentWillUnmount() {this.unsubscribe();}

  onStatusChange (images) {
    this.setState({searching: false})
  }

  render () {
    return (
      <form action="" className="search" onSubmit={this.submitSearch.bind(this)}>
        <input
            ref="searchField"
            value={this.state.searchString}
            onChange = {this.search.bind(this)}
            placeholder="Search images" type="text" className="search__input"
        />
        <button className="search__button">
          <svg  width="22" height="22" viewBox="39 13 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M60.37 31.823L55.36 26.73c.85-1.376 1.345-3.004 1.345-4.75 0-4.943-3.94-8.95-8.8-8.95-4.86 0-8.8 4.007-8.8 8.95 0 4.942 3.94 8.948 8.8 8.948 1.87 0 3.6-.595 5.026-1.605l4.947 5.032c.344.35.794.523 1.244.523.45 0 .9-.174 1.246-.523.686-.7.686-1.833 0-2.532zm-12.463-3.795c-3.285 0-5.948-2.708-5.948-6.048s2.662-6.05 5.947-6.05 5.948 2.71 5.948 6.05-2.663 6.048-5.948 6.048z" fill="#FFF" fill-rule="evenodd"/></svg>
        </button>
        {this.state.searching && "searching"}
      </form>
    );
  }
}

export default Search;

