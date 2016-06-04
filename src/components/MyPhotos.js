import React from "react";
import ShareImg from "./ShareImg";


class MyPhotos extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      images: []
    };
  }

  componentDidMount () {
    fetch("https://app.meted.co/api/me/stats",
          {mode: 'cors', headers: new Headers({'Content-Type': 'application/json'})})
    .then(response => response.json())
    .catch(err => console.log(err))
    .then(data => this.setState({images: data}))
  }

  showImage (img, ev) {
    this.setState({
      activeImg: this.state.activeImg === img ? null : img,
      activePosition: ev.currentTarget.getBoundingClientRect()
    })
  }

  render () {
    let {images, activeImg, activePosition} = this.state;

    return <div className="payload">
      <h3 className="payload__title">Photos that you use</h3>

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
  }
}

export default MyPhotos;