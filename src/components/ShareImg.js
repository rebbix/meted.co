import React from "react";

class ShareImg extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
        <div className="share-img"
          style = {{
            left: this.props.deltaLeft
          }}
        >
          <img className="share-img__img" src={`/images/${this.props.img}`} alt=""/>
          <div className="share-img__wrapper">
            <div className="share-img__label">Author</div>
            <div className="share-img__value">James Blake</div>

            <div className="share-img__label">Licence</div>
            <div className="share-img__value">CC0</div>

            <div className="share-img__label">Tags</div>
            <div className="share-img__tags">
              <span className="share-img__tag">Desert</span>
              <span className="share-img__tag">Australia</span>
              <span className="share-img__tag">Hot</span>
            </div>

            <h4 className="share-img__title">Use this photo on your site</h4>

            <span className="share-img__description">
              Reduce any possible legal issues by using this code
            </span>

            <textarea className="share-img__code" defaultValue={`<figure class="meted.co" data-meted-image-id="1"><script src="index.js" data-user-id="1"></script></figure>`}/>

            <button className="share-img__share-btn">COPY CODE</button>

            <div className="share-img__advantages">
              <div className="share-img__advantage">Network takedown tracking</div>
              <div className="share-img__advantage">Licence snaphot: <a href="#">CC 2.0</a></div>
              <div className="share-img__advantage">Usage risk tracking: <a href="#">Low</a></div>
            </div>

            <p className="share-img__notice">
              Low risk is: explaing the low risk <br/>
              Middle risk: explaining the middle risk <br/>
              High Risk: explaing what is the high risk <br/>
            </p>
          </div>
        </div>
    )
  }
}

export default ShareImg;