if (typeof init === "undefined") {
  const widgetURL = "index.js";

  function openDialog(el, data) {
    let imageId = el.dataset.metedImageId; //TODO: fix it;

    let shareDialog =  document.createElement("div");
    shareDialog.className = "meted__share-dialog";
    shareDialog.innerHTML = `
      <div class="meted__share-dialog-content">
        <h4 class="meted__share-title">Use this photo on your site with meted.co</h4>
        <p class="meted__share-description">Reduce any possible legal issues by using this code</p>
        
        <textarea class="meted__share-code"><figure data-meted="true" data-meted-image-id="${imageId}"><script src="${widgetURL}"></script></figure></textarea>
        <br/>
        <button class="meted__copy-button">COPY CODE</button>
        
        <ul class="meted__advantages">
          <li class="meted__advantage">Network takedown tracking</li>      
          <li class="meted__advantage">
            Licence snaphot:&nbsp;
            <a target="_blank" href="${data.license.url}">${data.license.shortName}</a>
          </li>
          <li class="meted__advantage">
            Usage risk tracking:&nbsp;
            <a target="_blank" href="#">${data.riskLevel.text}</a>
          </li>
        </ul>
      </div>
    `;
    var closeButton = document.createElement("div");
    closeButton.className = "meted__close";
    closeButton.innerHTML = `<svg width="22" height="22" viewBox="2508 95 22 22" xmlns="http://www.w3.org/2000/svg">        <path 
            fill="none" 
            fill-rule="evenodd" 
            stroke-linecap="square" 
            stroke="#FFF" 
            stroke-width="3" 
            d="M2527.526 97.474l-16.747 16.747M2527.526 114.22l-16.747-16.746"/>
        </svg>`;
    closeButton.onclick = function () {this.parentNode.parentNode.removeChild(this.parentNode);};
    shareDialog.appendChild(closeButton);
    el.appendChild(shareDialog);

    let text = el.querySelector(".meted__share-code")
    text.focus();
    text.select();
  };

  var init = true;

  let style = document.createElement("style");
  let css = `
    .meted {}
    .meted canvas {width: 100%;}
    .meted__copyright {    
      font-family: sans-serif;
      font-size: 13px;
      color: #999999;
      letter-spacing: -0.07px;
      font-style: italic;
    }
    .meted__copyright a:hover {
      text-decoration: underline;
    }
    .meted__copyright a {
      text-decoration: none;
      color: inherit;
    }
    .meted__share-buttons-block {
      display: none;
    }    
    .meted:hover .meted__share-buttons-block {
      display: block;
      position: absolute;
      
      text-align: right;
      right: 20px;
      bottom: 31px;
    }
        
    .meted__share {
      cursor: pointer;
      background: rgba(0,0,0, .70);
      color: white;
      font-weight: bold;
      padding: 9px 15px 27px;
      border: none;
      border-radius: 4px;
      position: relative;
      bottom: -1px;
      margin-right: 6px;
      outline: none;
      display: inline-block;
      vertical-align: middle;
      height: 0px;
    }
    
    .meted__contact {
      cursor: pointer;
      line-height: 36px;
      background: rgba(0,0,0, .70);
      color: white;
      font-weight: bold;
      padding: 0 15px;
      border: none;
      border-radius: 4px;
      margin: 0;
      outline: none;
    }

    .meted__share-dialog {
      position: absolute;
      top: 0;
      bottom: 18px;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.75);
      color: white;
      font-family: sans-serif;
      text-align: center;
    }
    
    .meted__share-title {
      font-size: 30px;
      color: #FFFFFF;
      letter-spacing: -0.15px;
      margin: 0 0 0 0;
    }
    
    .meted__share-description {    
      opacity: 0.8;
      font-size: 20px;
      letter-spacing: -0.1px;
    }
    
    .meted__share-code {
      border-radius: 4px;
      background: white;
      height: 75px; 
      width: 352px;
     
      font-size: 12px;
      color: #666666;
      line-height: 15px;
      padding: 9px 14px;
      
      border: none;
      outline: none;
    }
    
    .meted__close {
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
    }
    
    .meted__copy-button {
      line-height: 48px;
      background: #00FF9B;
      border-radius: 4px;
      color: #000000;
      text-align: center;
      border: none;
      margin-top: 5px;
      font-weight: bold;
      font-size: 15px;
      width: 380px;
    }
    
    .meted__advantages {
      width: 260px;
      margin: auto;
      text-align: left;
      margin-top: 30px;
      letter-spacing: -0.09px;
      font-weight: bold;
      font-size: 18px;
    }
    
    .meted__advantage  {margin: 13px 0;}
    
    .meted__advantage a {
      color: #00FF9B;
      text-decoration: none;
    }
    
    .meted__share-dialog-content {
      position: absolute;
      right: 0;
      left: 0;
      top: 50%;
      margin-top: -184px;
    }
    
  `;
  style.type = 'text/css';
  // style.styleSheet.cssText = css;
  style.appendChild(document.createTextNode(css));

  document.head.appendChild(style);
}

{
  let meted = document.querySelectorAll("*[data-meted]");
  let i = meted.length ;
  
  while (i > 0) {
    i -=1;
    let host = meted[i].dataset.metedDevEnv ? "http://localhost:5000" : "http://app.meted.co"; // TODO: production!

    let imageId = meted[i].dataset.metedImageId;

    if (window
          .getComputedStyle(meted[i], null)
          .getPropertyValue("position") === "static") { meted[i].style.position = "relative";}

    meted[i].classList.add("meted");

    let canvas = document.createElement("canvas");
    canvas.addEventListener("click", (ev) => {ev.preventDefault();}, true);
    canvas.addEventListener("click", (ev) => {ev.preventDefault(); }, false);
    canvas.addEventListener("contextmenu", (ev) => {ev.preventDefault();}, false);

    let ctx = canvas.getContext("2d");

    let img = new Image();
    Promise.all([
      fetch(`${host}/w/1/${imageId}`, {mode: 'cors', headers: new Headers({'Content-Type': 'application/json'})})
          .then(response => response.json())
          .catch(err => console.log(err)),
      new Promise( (res, rej) => {img.onload = res;})
    ])
    .then(([data]) => {

      let copyright = document.createElement("figcaption");
      copyright.className = "meted__copyright";
      copyright.innerHTML = `
        <a target="_blank" href="${data.author.url}">Photo</a>
        by ${data.author.name} /&nbsp;
        <a target="_blank" href="${data.license.url}">${data.license.shortName}</a>`;

      meted[i].appendChild(copyright);

      let usebutton = document.createElement("button");
      usebutton.className = "meted__contact";
      usebutton.innerText = "USE PHOTO";
      usebutton.addEventListener("click", (ev) => {openDialog(meted[i], data);});

      let hover = document.createElement("div");
      hover.className = "meted__share-buttons-block";
      hover.innerHTML = `<a href="mailto:metedapp@gmail.com?subject=Takedown%20photo%20request%20ID3452453" class="meted__share"><svg width="14" height="17" viewBox="11 10 14 17" xmlns="http://www.w3.org/2000/svg">
  <path d="M24.383 11.318c-.374-.155-.804-.07-1.09.217-1.264 1.263-3.32 1.264-4.586 0-2.045-2.043-5.37-2.043-7.414 0-.188.187-.293.442-.293.707v13c0 .552.447 1 1 1 .553 0 1-.448 1-1V20.69c1.27-.998 3.12-.912 4.293.26 2.045 2.042 5.37 2.042 7.414 0 .188-.19.293-.443.293-.708v-8c0-.405-.244-.77-.617-.924z" fill="#FFF" fill-rule="evenodd" fill-opacity=".75"/>
</svg></a>`;

      hover.appendChild(usebutton);

      meted[i].appendChild(hover);
    })
    .then(() => {
      let {naturalHeight, naturalWidth} = img;
      canvas.height = naturalHeight;
      canvas.width = naturalWidth;
      ctx.drawImage(img, 0, 0);
    });

    img.src = `${host}/w/1/i/${imageId}/800,600`;

    meted[i].appendChild(canvas);
    meted[i].removeAttribute("data-meted");
  }
}