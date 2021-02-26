import React, { Component, Fragment } from 'react';
import Index from './Component/Index'
import Header from './Component/Header'
import Home from './Component/Home'
import Series from './Component/Series'
import Friends from './Component/Friends'

import 'bootstrap/dist/css/bootstrap.min.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      position : 'Index',
      id : null
    }
  }
 
  x = (position, id) =>{
    this.setState({position: position, id :id})

  }
  render() {
    if(this.state.position === 'Index'){
      return (
          <Fragment>
            <Header 
              x = {this.x}
            />
            <Index />
          </Fragment>
        );
      }else if(this.state.position === 'Home'){
        return(
          <Fragment>
            <Header 
              x = {this.x}
            />
            <Home 
              x = {this.x}
            />
          </Fragment>
        );
      }else if(this.state.position === 'Series'){
        return(
          <Fragment>
            <Header 
              x = {this.x}
              />
            <Series 
              x = {this.x}
              id = {this.state.id}
            />
          </Fragment>
        );
      }else if(this.state.position === 'Friends'){
        return(
          <Fragment>
            <Header 
              x = {this.x}
              />
            <Friends />
          </Fragment>
        );
      }
    }
}
 
export default App;
