import React, { Component, Fragment } from 'react';
import axios from 'axios'
import { Button, Modal } from 'react-bootstrap';
import Home from './Home'
import cookie from 'react-cookies'
import swal from 'sweetalert';

class MyVerticallyCenteredModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info:null,
            follow : null
        }
    }

    handleFollow = (id) =>{
      if(!cookie.load(id)){
        cookie.save(id, id, { path: '/' })
        let token = cookie.load('userT')
        axios.post(`https://api.betaseries.com/shows/favorite?client_id=ec52d61223e0&id=${id}&token=${token}`)
          .then((response =>{

            console.log(response)
            swal(`Serie ajouté au favoris !`, {
              icon: "success",
              buttons: false,
              timer: 2000,
          })
          }))
      }else{
        //cookie.load('userN')
        let token = cookie.load('userT')
        cookie.remove(id, { path: '/' })
        axios.delete(`https://api.betaseries.com/shows/favorite?client_id=ec52d61223e0&id=${id}&token=${token}`)
        .then((response =>{
          console.log(response)
          swal(`Serie archivé !`, {
            icon: "success",
            buttons: false,
            timer: 2000,
        })
        }))
        
      }
      
    }
    
    render(){
        return (
            <Modal
              show={this.props.show} 
              onHide={this.props.onHide}
              size="xl"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <div className="modal-wrap-series">
                  <div className="modal-header-series" style={{backgroundImage : `url(${this.props.id.show.images.banner})`}}>
                       
                  </div>
                  <div className="modal-body-series">
                      {this.props.id ? 
                        <div>
                        <h2>{this.props.id.show.title}</h2>
                        <p>{this.props.id.show.description}</p>
                        <p>{this.props.id.show.seasons} saison, {this.props.id.show.episodes} épisodes -- Année : {this.props.id.show.creation} -- Durée : {this.props.id.show.length} minutes </p>
                        <p>Note : {this.props.id.show.notes.mean} sur 5</p>
                        <br />
                        <p onClick={() => this.props.x('Series', this.props.id.show.id)}>Voir la fiche produit -></p>
                        {cookie.load(this.props.id.show.id) ? <button onClick={() => this.handleFollow(this.props.id.show.id)}>Unfollow</button> : <button onClick={() => this.handleFollow(this.props.id.show.id)}>Suivre cette serie</button>}

                        </div>
                      : null}
                    
                  </div>
              </div>
            </Modal>
          );
    }
  }

export default MyVerticallyCenteredModal;