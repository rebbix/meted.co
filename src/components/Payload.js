import React from "react";
import ShareImg from "./ShareImg";

let images = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "7.jpg",
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "7.jpg",
]

class Payload extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  showImage (img, ev) {
    console.log(ev.currentTarget.getBoundingClientRect());
    this.setState({
      activeImg: this.state.activeImg === img ? null : img,
      activePosition: ev.currentTarget.getBoundingClientRect()
    })
  }

  render () {
    let {activeImg, activePosition} = this.state;
    return (
      <div className="payload ">{/*payload_empty*/}
        {images.map ((img, i) => (
            <div
              className={`payload__image-wrapper ${activeImg === img && "payload__image-wrapper_active"}`}
              key={img + i}
              onClick={this.showImage.bind(this, img)}>
                <img src={`/images/${img}`} alt=""/>
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