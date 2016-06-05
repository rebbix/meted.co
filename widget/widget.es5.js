"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (typeof init === "undefined") {
  var init;

  (function () {
    var openDialog = function openDialog(el, data) {
      var imageId = el.dataset.metedImageId; //TODO: fix it;

      var shareDialog = document.createElement("div");
      shareDialog.className = "meted__share-dialog";
      shareDialog.innerHTML = "\n      <div class=\"meted__share-dialog-content\">\n        <h4 class=\"meted__share-title\">Use this photo on your site with meted.co</h4>\n        <p class=\"meted__share-description\">Reduce any possible legal issues by using this code</p>\n        " + (data.riskLevel.score !== 3 ? "<textarea class=\"meted__share-code\"><figure data-meted=\"true\" data-meted-image-id=\"" + imageId + "\"><script src=\"" + widgetURL + "\"></script></figure></textarea><br/><button class=\"meted__copy-button\">COPY CODE</button>" : "") + "\n\n        <ul class=\"meted__advantages\">\n          <li class=\"meted__advantage\">Network takedown tracking</li>\n          <li class=\"meted__advantage\">\n            Licence snaphot:&nbsp;\n            <a target=\"_blank\" href=\"" + data.license.url + "\">" + data.license.shortName + "</a>\n          </li>\n          <li class=\"meted__advantage\">\n            Usage risk tracking:&nbsp;\n            <a target=\"_blank\" href=\"#\"\n              style=\"color:" + (data.riskLevel.score === 0 ? "transparent" : data.riskLevel.score === 1 ? "#00FF9B" : data.riskLevel.score === 2 ? "#FFDA18" : data.riskLevel.score === 3 ? "#FF5359" : "transparent") + "\">" + data.riskLevel.text + "</a>\n          </li>\n        </ul>\n      </div>\n    ";
      var closeButton = document.createElement("div");
      closeButton.className = "meted__close";
      closeButton.innerHTML = "<svg width=\"22\" height=\"22\" viewBox=\"2508 95 22 22\" xmlns=\"http://www.w3.org/2000/svg\">        <path\n            fill=\"none\"\n            fill-rule=\"evenodd\"\n            stroke-linecap=\"square\"\n            stroke=\"#FFF\"\n            stroke-width=\"3\"\n            d=\"M2527.526 97.474l-16.747 16.747M2527.526 114.22l-16.747-16.746\"/>\n        </svg>";
      closeButton.onclick = function () {
        this.parentNode.parentNode.removeChild(this.parentNode);
      };
      shareDialog.appendChild(closeButton);
      el.appendChild(shareDialog);

      var text = el.querySelector(".meted__share-code");
      text.focus();
      text.select();
    };

    var widgetURL = "https://app.meted.co/w.js";

    ;

    init = true;


    var style = document.createElement("style");
    var css = "\n\n    .meted {}\n    .meted canvas {width: 100%;}\n    .meted__copyright {\n      font-family: sans-serif;\n      font-size: 13px;\n      color: #999999;\n      letter-spacing: -0.07px;\n      font-style: italic;\n    }\n    .meted__copyright a:hover {\n      text-decoration: underline;\n    }\n    .meted__copyright a {\n      text-decoration: none;\n      color: inherit;\n    }\n    .meted__share-buttons-block {\n      display: none;\n    }\n    .meted:hover .meted__share-buttons-block {\n      display: block;\n      position: absolute;\n\n      text-align: right;\n      right: 20px;\n      bottom: 31px;\n    }\n\n    .meted__share {\n      cursor: pointer;\n      background: rgba(0,0,0, .70);\n      color: white;\n      font-weight: bold;\n      padding: 9px 15px 27px;\n      border: none;\n      border-radius: 4px;\n      position: relative;\n      bottom: -1px;\n      margin-right: 6px;\n      outline: none;\n      display: inline-block;\n      vertical-align: middle;\n      height: 0px;\n    }\n\n    .meted__contact {\n      cursor: pointer;\n      line-height: 36px;\n      background: rgba(0,0,0, .70);\n      color: white;\n      font-weight: bold;\n      padding: 0 15px;\n      border: none;\n      border-radius: 4px;\n      margin: 0;\n      outline: none;\n    }\n\n    .meted__share-dialog {\n      position: absolute;\n      top: 0;\n      bottom: 18px;\n      left: 0;\n      right: 0;\n      background: rgba(0,0,0,.75);\n      color: white;\n      font-family: sans-serif;\n      text-align: center;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    .meted__share-title {\n      font-size: 24px;\n      color: #FFFFFF;\n      letter-spacing: -0.15px;\n      margin: 0 0 0 0;\n    }\n\n    .meted__share-description {\n      opacity: 0.8;\n      font-size: 15px;\n      letter-spacing: -0.1px;\n    }\n\n    .meted__share-code {\n      border-radius: 4px;\n      background: white;\n      height: 50px;\n      width: 360px;\n\n      font-size: 12px;\n      color: #666666;\n      line-height: 15px;\n      padding: 9px 14px;\n\n      border: none;\n      outline: none;\n    }\n\n    .meted__close {\n      position: absolute;\n      right: 20px;\n      top: 20px;\n      cursor: pointer;\n    }\n\n    .meted__copy-button {\n      line-height: 40px;\n      background: #00FF9B;\n      border-radius: 4px;\n      color: #000000;\n      text-align: center;\n      border: none;\n      margin-top: 5px;\n      font-weight: bold;\n      font-size: 15px;\n      width: 390px;\n    }\n\n    .meted__advantages {\n      width: 260px;\n      margin: auto;\n      text-align: left;\n      margin-top: 30px;\n      letter-spacing: -0.09px;\n      font-weight: bold;\n      font-size: 15px;\n    }\n\n    .meted__advantage  {margin: 7px 0;}\n\n    .meted__advantage a {\n      color: #00FF9B;\n      text-decoration: none;\n    }\n\n    .meted__share-dialog-content {\n      /*!  */\n      /*!  */\n      /*!  */\n      /*!  */\n    }\n  ";
    style.type = 'text/css';
    // style.styleSheet.cssText = css;
    style.appendChild(document.createTextNode(css));

    document.head.appendChild(style);
  })();
}

{
  (function () {
    var meted = document.querySelectorAll("*[data-meted]");
    var i = meted.length;

    var _loop = function _loop() {
      i -= 1;
      var host = meted[i].dataset.metedDevEnv ? "http://localhost:5000" : "https://app.meted.co";

      var imageId = meted[i].dataset.metedImageId;

      if (window.getComputedStyle(meted[i], null).getPropertyValue("position") === "static") {
        meted[i].style.position = "relative";
      }

      meted[i].classList.add("meted");

      var canvas = document.createElement("canvas");
      canvas.addEventListener("click", function (ev) {
        ev.preventDefault();
      }, true);
      canvas.addEventListener("click", function (ev) {
        ev.preventDefault();
      }, false);
      canvas.addEventListener("contextmenu", function (ev) {
        ev.preventDefault();
      }, false);

      var ctx = canvas.getContext("2d");

      var img = new Image();
      Promise.all([fetch(host + "/w/1/" + imageId, { mode: 'cors', headers: new Headers({ 'Content-Type': 'application/json' }) }).then(function (response) {
        return response.json();
      }).catch(function (err) {
        return console.log(err);
      }), new Promise(function (res, rej) {
        img.onload = res;
      })]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1);

        var data = _ref2[0];


        var copyright = document.createElement("figcaption");
        copyright.className = "meted__copyright";
        copyright.innerHTML = "\n        <a target=\"_blank\" href=\"" + data.url + "\">Photo</a>\n        by " + data.author.name + " /&nbsp;\n        <a target=\"_blank\" href=\"" + data.license.url + "\">" + data.license.shortName + "</a>";

        meted[i].appendChild(copyright);

        var usebutton = document.createElement("button");
        usebutton.className = "meted__contact";
        usebutton.innerText = "USE PHOTO";
        usebutton.addEventListener("click", function (ev) {
          openDialog(meted[i], data);
        });

        var hover = document.createElement("div");
        hover.className = "meted__share-buttons-block";
        hover.innerHTML = "<a href=\"mailto:metedapp@gmail.com?subject=Takedown%20photo%20request%20ID3452453\" class=\"meted__share\"><svg width=\"14\" height=\"17\" viewBox=\"11 10 14 17\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"M24.383 11.318c-.374-.155-.804-.07-1.09.217-1.264 1.263-3.32 1.264-4.586 0-2.045-2.043-5.37-2.043-7.414 0-.188.187-.293.442-.293.707v13c0 .552.447 1 1 1 .553 0 1-.448 1-1V20.69c1.27-.998 3.12-.912 4.293.26 2.045 2.042 5.37 2.042 7.414 0 .188-.19.293-.443.293-.708v-8c0-.405-.244-.77-.617-.924z\" fill=\"#FFF\" fill-rule=\"evenodd\" fill-opacity=\".75\"/>\n</svg></a>";

        hover.appendChild(usebutton);

        meted[i].appendChild(hover);
      }).then(function () {
        var naturalHeight = img.naturalHeight;
        var naturalWidth = img.naturalWidth;

        canvas.height = naturalHeight;
        canvas.width = naturalWidth;
        ctx.drawImage(img, 0, 0);
      });

      img.src = host + "/w/1/i/" + imageId + "/800,600";

      meted[i].appendChild(canvas);
      meted[i].removeAttribute("data-meted");
    };

    while (i > 0) {
      _loop();
    }
  })();
}