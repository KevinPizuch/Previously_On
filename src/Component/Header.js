import React, { Component, Fragment } from 'react'
import { Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import axios from 'axios'
import cookie from 'react-cookies'
import App from '../App'


class MyVerticallyCenteredModal extends Component {
    constructor(props) {
        super(props);
        this.login = React.createRef();
        this.password = React.createRef();
        this.state = {
            error : false
        }
    }
    handleLogin = () =>{
        console.log(this.login.current.value,this.password.current.value)
        if(this.login.current.value === '' || this.password.current.value === ''){
            return this.setState({error:true})
        }
        var md5 = require('md5');
        axios.post('https://api.betaseries.com/members/auth',{login:this.login.current.value, password:md5(this.password.current.value), client_id:'ec52d61223e0'})
        .then((response =>{
            if(response.status === 200){
                console.log(response)
                this.props.onHide()
                swal(`Bienvenue ${response.data.user.login} !`, {
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                })
                cookie.save('userT', response.data.token, { path: '/' })
                cookie.save('userN', response.data.user.login, { path: '/' })
                cookie.save('userI', response.data.user.id, { path: '/' })
                this.props.auth(response.data.user.login)
            }
        })).catch((error => {
            console.log(error)
            this.props.onHide()
            swal("Error", "Mauvais login ou mot de passe", "error");
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
                  Connexion
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.state.error === false ? null : <h2 className="modal-error">Vous devez remplir tout les champs</h2>}
                <h5>Login</h5>
                    <input type="text" id="login" name="login" required minLength="4" maxLength="20" size="10" ref={this.login}/>
                <h5>Mot de passe</h5>
                    <input type="password" id="password" name="password" required minLength="4" maxLength="20" size="10" ref={this.password}/>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleLogin}>Valider</Button>
              </Modal.Footer>
            </Modal>
          );
    }
  }

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalShow : false,
            setModalShow : false,
            auth : false
         }
    }
    componentDidMount(){
        if(cookie.load('userN') && cookie.load('userI') && cookie.load('userT')){
            this.setState({auth : true})
            this.props.x('Home')
        }
    }
    auth = xd =>{
        this.setState({auth : true})
        this.props.x('Home')
    }
    disconnect = () =>{
        cookie.remove('userI', { path: '/' })
        cookie.remove('userN', { path: '/' })
        cookie.remove('userT', { path: '/' })
        this.setState({auth : false})
        this.props.x('Index')
        swal(`Au revoir !`, {
            icon: "success",
            buttons: false,
            timer: 2000,
        })
    }
    modalShow = () =>{
        console.log('x')
        const show = !this.state.modalShow
        this.setState({modalShow : show})
    }
    handleFriends = () =>{
        this.props.x('Friends')
    }
    render() { 
        return (
            <Fragment>
                <div className='header'>
                    <br />
                    <h1 onClick={() => this.props.x('Home')}>ALPHA SERIES</h1>
                    <div className='header-wrap'>
                        {this.state.auth ? <p><img src={'https://www.betaseries.com/images/icons/icon-empty_avatar.svg'}/> {cookie.load('userN')} <br/><Button variant="outline-dark" onClick={this.disconnect}>Déconnexion</Button></p> : <Button variant="outline-dark" onClick={this.modalShow}>Connexion</Button>}
                    { this.state.auth ? <div className="friends-button"><button onClick={this.handleFriends}>Amis ^^</button></div> : null}
                    </div>
                </div>
                <MyVerticallyCenteredModal
                    show={this.state.modalShow}
                    onHide={this.modalShow}
                    auth={this.auth}
                />
                
            </Fragment>
        );
    }
}


export default Header;