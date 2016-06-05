import React from "react";

class ShareImg extends React.Component {
  constructor (props) {
    super(props);
    this.state = {}
  }
  
  componentDidMount () {
    this.refs.shareCode.select();
    this.refs.shareCode.focus();
  }
  
  render () {
    let {img} = this.props;

    let shareCod = `<figure data-meted="true" data-meted-image-id="${img.id}"><script src="https://app.meted.co/w.js"></script></figure>`;

    let icon = <svg style={{marginRight: 10}} width="15" height="12" viewBox="0 3 15 12" xmlns="http://www.w3.org/2000/svg"><path d="M12.925 3.242l-6.82 7.88L1.91 6.27.337 8.093l5.77 6.666 8.39-9.697" fill="#00FF9B" fillRule="evenodd"/></svg>;

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

            {img.viewCount && <div>
              <div className="share-img__label">Views from your site</div>
              <div className="share-img__value">{img.viewCount} views</div>
            </div>}


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
              <div className="share-img__advantage">
                {icon}
                Network takedown tracking</div>
              <div className="share-img__advantage">
                {icon}
                Licence snaphot
                {img.screenshot &&
                    <span>
                      :&nbsp;
                      <a href={img.screenshot.url} target="__blank">View</a>
                    </span>
                }
              </div>
              <div className="share-img__advantage">
                {icon}
                Usage risk tracking
                {img.riskLevel &&
                  <span>{console.log(img.riskLevel )}
                    :&nbsp;
                    <a href="#"
                       title={img.riskLevel.explanation}
                       style={{
                          color:   img.riskLevel.score === 0 ? "transparent"
                                 : img.riskLevel.score === 1 ? "#00FF9B"
                                 : img.riskLevel.score === 2 ? "#FFDA18"
                                 : img.riskLevel.score === 3 ? "#FF5359"
                                 : "transparent"
                       }}
                    >
                      {img.riskLevel.text}
                      </a> 
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default ShareImg;