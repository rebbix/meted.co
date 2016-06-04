import React from "react";
import Search from "./Search"
import Payload from "./Payload"

class Layout extends React.Component {
  constructor (props) {
    super(props);
    this.state = {}
  }
  render () {
    return (
      <div className="layout">
        <div className="layout__search">
          <div className="layout__logo">
            <svg width="132" height="23" viewBox="71 16 132 23" xmlns="http://www.w3.org/2000/svg"><path d="M83.97 32.12c0-4.08 1.35-6.3 3.27-6.3 1.23 0 1.86.69 1.86 2.1V38h3.72V27.29c0-2.91-1.71-4.65-4.5-4.65-1.92 0-3.45 1.05-4.62 3.12-.63-2.07-2.28-3.12-4.23-3.12-1.71 0-3.18.9-4.35 2.67v-2.43H71.4V38h3.72v-5.55c0-4.32 1.35-6.63 3.27-6.63 1.23 0 1.86.69 1.86 2.1V38h3.72v-5.88zm26.37-2.01c0-1.71-.54-3.48-1.62-4.95-1.08-1.53-3.03-2.52-5.43-2.52-5.19 0-7.26 4.2-7.26 7.8 0 3.6 2.07 7.8 7.26 7.8 3.3 0 5.58-1.47 6.87-4.41l-3-1.11c-.9 1.56-2.13 2.34-3.66 2.34-2.16 0-3.48-1.59-3.57-3.42h10.41v-1.53zm-7.05-4.29c1.74 0 2.82.96 3.24 2.88h-6.51c.27-1.59 1.5-2.88 3.27-2.88zm18.42 8.88c-.45.24-.93.36-1.44.36-1.32 0-1.98-.66-1.98-2.46v-6.54h3.99v-3.18h-3.99v-6.12l-3.72 2.34v3.78h-2.34v3.18h2.34v6.6c0 3.69 2.07 5.58 5.55 5.58.87 0 1.68-.18 2.46-.54l-.87-3zm17.04-4.59c0-1.71-.54-3.48-1.62-4.95-1.08-1.53-3.03-2.52-5.43-2.52-5.19 0-7.26 4.2-7.26 7.8 0 3.6 2.07 7.8 7.26 7.8 3.3 0 5.58-1.47 6.87-4.41l-3-1.11c-.9 1.56-2.13 2.34-3.66 2.34-2.16 0-3.48-1.59-3.57-3.42h10.41v-1.53zm-7.05-4.29c1.74 0 2.82.96 3.24 2.88h-6.51c.27-1.59 1.5-2.88 3.27-2.88zm16.8-3.18c-4.44 0-6.9 3.03-6.9 7.8s2.46 7.8 6.9 7.8c1.71 0 3.18-.93 3.66-1.8V38h3.72V16.76h-3.72v7.5c-.69-.87-2.19-1.62-3.66-1.62zm-2.01 4.41c.66-.81 1.5-1.23 2.52-1.23s1.86.42 2.49 1.23c.66.81.99 1.92.99 3.39 0 1.47-.33 2.61-.99 3.42-.63.81-1.47 1.2-2.49 1.2-1.02 0-1.86-.42-2.52-1.23-.66-.81-.99-1.95-.99-3.39 0-1.44.33-2.58.99-3.39zm14.58 10.41c.96.96 2.64.96 3.6 0s.96-2.64 0-3.6-2.64-.96-3.6 0-.96 2.64 0 3.6zm18.78-4.89c-.81 1.65-2.01 2.49-3.54 2.49-2.28 0-3.48-1.86-3.48-4.62s1.2-4.62 3.48-4.62c1.53 0 2.73.84 3.54 2.49l3.33-1.35c-1.17-2.88-3.45-4.32-6.87-4.32-2.37 0-4.17.75-5.46 2.22-1.29 1.47-1.92 3.33-1.92 5.58s.63 4.11 1.92 5.58c1.29 1.47 3.09 2.22 5.46 2.22 3.42 0 5.7-1.44 6.87-4.32l-3.33-1.35zm7.77 3.48c1.38 1.47 3.24 2.19 5.61 2.19s4.23-.72 5.61-2.19 2.07-3.36 2.07-5.61c0-2.25-.69-4.11-2.07-5.58-1.38-1.47-3.24-2.22-5.61-2.22s-4.23.75-5.61 2.22c-1.38 1.47-2.07 3.33-2.07 5.58s.69 4.14 2.07 5.61zm2.85-8.88c.69-.9 1.59-1.35 2.76-1.35 1.17 0 2.07.45 2.76 1.35.69.87 1.02 1.98 1.02 3.27s-.33 2.4-1.02 3.3c-.69.87-1.59 1.32-2.76 1.32-1.17 0-2.07-.45-2.76-1.32-.69-.9-1.02-2.01-1.02-3.3s.33-2.4 1.02-3.27z" fillOpacity=".5" fill="#343434" fillRule="evenodd"/></svg>
          </div>
          <Search/>
        </div>
        <div className="layout__payload"><Payload/></div>
      </div>
    )
  }
}

export default Layout;