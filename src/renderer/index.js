import React from "react";
import ReactDOM from "react-dom";

import pjson from '../../package.json'
import "../___assets/styles/app.css";

import { CHANNELS, SHORTCUTS } from 'common/constants'
import ImgIcon from '../___assets/icons/png/icon_512x512.png'
import ImgTitle from '../___assets/images/app-title.png'

function App() {
  const linkClickHandler = (e, href) => {
    e.preventDefault()
    require('electron').shell.openExternal(href)
  }
  return (
    <div class="app">
      <div>
        <img src={ImgIcon} alt="App icon" width="100" />
      </div>
      <div>
        <h1>
          <img src={ImgTitle} alt="Mono Switch App" width="200" />
        </h1>
      </div>
      <div>
        <p>Version {pjson.version}</p>
      </div>
      <div>
        <a 
          href="#"
          onClick={(e) => linkClickHandler(e, "https://github.com/jamland/mono-switch/blob/master/POLICY")}
        >
          Privacy Policy
        </a>
        <br />
        © [2019-Now] Andy Burkovetsky
        <br />
        <a 
          href="#"
          onClick={(e) => linkClickHandler(e, "https://github.com/jamland/mono-switch")}
        >
          https://github.com/jamland
        </a>
        <br />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("app");
ReactDOM.render(<App />, rootElement);