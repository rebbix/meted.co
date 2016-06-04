import Reflux from "reflux";
import Actions from "../actions/Photos";

var Store = Reflux.createStore({
  listenables: Actions,

  onSearchUpdate (query) {
    this.trigger("start-searching");
    this
      .searchImages(query)
      .then((data)=> this.trigger(data))
  },

  searchImages (query) {

    return fetch(`http://localhost:5000/api/search?q=${query}`, {
            mode: 'cors', headers: new Headers({'Content-Type': 'application/json'})
    })
        .then(response => response.json())
        .catch(err => console.log(err));
  }
});

export default Store;
