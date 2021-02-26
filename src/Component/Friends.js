import React, { Component } from 'react'
import axios from 'axios';
import cookie from 'react-cookies'
import { Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';


class MyVerticallyCenteredModal extends Component {
    constructor(props) {
        super(props);
        this.friend = React.createRef();
        this.state = {
            error : false,
            modalShow : false,
            setModalShow : false,
            friends : []
        }
    }
    handleFriends = () =>{
        let token = cookie.load('userT')
        axios.get(`https://api.betaseries.com/friends/find?type=emails&token=${token}&client_id=ec52d61223e0&emails=${this.friend.current.value}`)
            .then((response => {
                console.log(response)
                this.setState({friends : response.data.users})
            }))
    }

    handleAddFriend = id =>{
        let token = cookie.load('userT')
        axios.post(`https://api.betaseries.com/friends/friend?token=${token}&client_id=ec52d61223e0&id=${id}`)
            .then((response => {
                console.log(response)
                if(response.status == 200){
                    swal(`Vous venez de demander à ${response.data.member.login} d'être votre ami !`, {
                        icon: "success",
                        buttons: false,
                        timer: 2000,
                    })
                    this.props.reload()
                }
            }))
    }
    render(){
        return (
            <Modal
              show={this.props.show} 
              onHide={this.props.onHide}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <label >chercher un ami</label>
                    <input type='text' ref={this.friend}></input>
                    <button onClick={this.handleFriends}>chercher !</button>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.state.friends.length > 0 ? 
                    this.state.friends.map((todo) => 
                    <div>
                       <p>Name : {todo.login} <button onClick={() => this.handleAddFriend(todo.id)}>ajouter !</button></p>
                    </div>
                    ) : null
                }  
              </Modal.Body>    
            </Modal>
          );
    }
  }

class Friends extends Component {
    constructor(props) {
        super(props);
        this.friend = React.createRef();
        this.state = { 
            friends_list : []
         }
    }

    componentDidMount(){
        let id = cookie.load('userT')
        axios.get(`https://api.betaseries.com/friends/list?client_id=ec52d61223e0&token=${id}`)
            .then((response => {
                console.log(response.data.users)
                this.setState({friends_list : response.data.users})
            }))
    }
    modalShow = () =>{
        const show = !this.state.modalShow
        this.setState({modalShow : show})
    }
    reload = () => {
        let id = cookie.load('userT')
        console.log("xd")
        axios.get(`https://api.betaseries.com/friends/list?client_id=ec52d61223e0&token=${id}`)
            .then((response => {
                this.setState({friends_list : response.data.users})
            }))
    }
    handleDeleteFriend = id =>{
        let userId = cookie.load('userT')
        axios.delete(`https://api.betaseries.com/friends/friend?client_id=ec52d61223e0&token=${userId}&id=${id}`)
            .then((response => {
                console.log(response)
                this.reload()
                swal(`Vous venez de supprimer ${response.data.member.login} de vos amis :'(`, {
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                })
            }))
    }
    render() { 
        return ( 
            <div className="friends-wrap">
                <div className="search-friend">
                    <button onClick={this.modalShow}>Chercher des amis !</button>
                </div>
                <div className="friends-list">
                    { this.state.friends_list.length > 0 ?
                         this.state.friends_list.map((todo) => 
                         <div>
                            <p>Name : {todo.login} <button onClick={ () => this.handleDeleteFriend(todo.id)}>supprimer</button></p>
                         </div>
                         )
                        : <p>pas d'amis :( </p> } 
                </div>
                <MyVerticallyCenteredModal
                    show={this.state.modalShow}
                    onHide={this.modalShow}
                    reload={this.reload}
                />
            </div>
         );
    }
}
 
export default Friends;