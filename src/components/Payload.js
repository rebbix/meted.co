import React from "react";
import ShareImg from "./ShareImg";
import Store from "../storage/Photos";

class Payload extends React.Component {
  constructor (props) {
    super(props);
    this.state = {images: []};
  }

  componentDidMount () {this.unsubscribe = Store.listen(this.onStatusChange.bind(this)); }
  componentWillUnmount() { this.unsubscribe(); }
  onStatusChange (data) {
    if (data === "start-searching") {
      this.setState({ searching: true })
    } else {
      this.setState({ searching: false,  images: data});
    }

  }

  showImage (img, ev) {
    this.setState({
      activeImg: this.state.activeImg === img ? null : img,
      activePosition: ev.currentTarget.getBoundingClientRect()
    })
  }

  render () {
    let {activeImg, activePosition, images} = this.state;

    return (
      <div className={`payload ${images.length === 0 && "payload_empty"} ${this.state.searching && "payload_searching"}`}>
        {images.map (img => (
            <div
              className={`payload__image-wrapper ${activeImg === img && "payload__image-wrapper_active"}`}
              key={img.id}
              onClick={this.showImage.bind(this, img)}>
                <img src={img.thumbnail.url} alt=""/>
              
                {activeImg === img &&
                  <ShareImg deltaLeft={-activePosition.left} img={img}/>
                }
            </div>
        ))}
      </div>
    );
  }
}

export default Payload;