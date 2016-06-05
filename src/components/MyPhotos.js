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

      {images
          .sort((a, b) => b.riskLevel.score - a.riskLevel.score)
          .map (img => (
         <div
             className={`payload__image-wrapper ${activeImg === img && "payload__image-wrapper_active"}`}
             key={img.id}
             onClick={this.showImage.bind(this, img)}
             style={{
              borderColor : activeImg === img && img.riskLevel.score === 0 ? "transparent"
                          : activeImg === img && img.riskLevel.score === 1 ? "#00FF9B"
                          : activeImg === img && img.riskLevel.score === 2 ? "#FFB818"
                          : activeImg === img && img.riskLevel.score === 3 ? "#FF5359"
                          : "transparent"
             }}>
           <div
               style = {{
                  background: img.riskLevel.score === 0 ? "transparent"
                            : img.riskLevel.score === 1 ? "#00E086"
                            : img.riskLevel.score === 2 ? "#FFB818"
                            : img.riskLevel.score === 3 ? "#FF5359"
                            : "transparent"
               }}
             className="payload__risk-marker"
           >{img.riskLevel.explanation}</div>

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