import React from "react";

class ShareImg extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  
  componentDidMount () {
    this.refs.shareCode.select();
    this.refs.shareCode.focus();
  }
  
  render () {
    let {img} = this.props;

    let shareCod = `<figure data-meted="true" data-meted-image-id="${img.id}"><script src="https://app.meted.co/w.js"></script></figure>`;

    return (
        <div
          className="share-img"
          onClick={ev => ev.stopPropagation()}
          style = {{
            left: this.props.deltaLeft
          }}
        >
          <img className="share-img__img" src={img.largeThumbnail.url} alt=""/>
          <div className="share-img__wrapper">
            <div className="share-img__label">Author</div>
            <div className="share-img__value">
              <a target="__blank" href={img.url}>{img.owner.realName}</a>
            </div>

            <div className="share-img__label">Licence</div>
            <div className="share-img__value">{img.license.shortName}</div>

            <div className="share-img__label">Tags</div>
            <div className="share-img__tags">
              {img.tags.map(tag => (
                  <span className="share-img__tag">{tag}</span>
              ))}
            </div>

            <h4 className="share-img__title">Use this photo on your site</h4>

            <span className="share-img__description">
              Reduce any possible legal issues by using this code
            </span>

            <textarea ref="shareCode" className="share-img__code" defaultValue={shareCod}/>

            <button className="share-img__share-btn">COPY CODE</button>

            <div className="share-img__advantages">
              <div className="share-img__advantage">Network takedown tracking</div>
              <div className="share-img__advantage">Licence snaphot</div>
              <div className="share-img__advantage">Usage risk tracking</div>
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