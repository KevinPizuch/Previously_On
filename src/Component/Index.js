import React, { Component } from 'react';
import axios from 'axios'
import swal from 'sweetalert';


class Index extends Component {
    constructor(props) {
    super(props);
        this.state = { 
            title_array : [],
            id_array : [],
            picture_array : []
        }
    }
    componentDidMount(){
        axios.get('https://api.betaseries.com/search/all?client_id=ec52d61223e0&query=all&limit=20')
        .then((response =>{
            const todoItems = response.data.shows.map((todo) =>
            axios.get(`https://api.betaseries.com/pictures/shows?client_id=ec52d61223e0&id=${todo.id}`, {responseType: 'blob'})
                .then((picture =>{
                    this.setState({
                    title_array: this.state.title_array.concat({title:todo.title, id:todo.id, picture:picture.data})
                    })
                }))
            );
        }))
    }

    handleLogIn = () =>{
        swal(`Vous devez vous connecter !`, {
            icon: "error",
            buttons: false,
            timer: 2000,
        })
    }
    render() {
    
        const todoItems = this.state.title_array.map((todo) =>
                <div>
                    <img onClick={this.handleLogIn} src={URL.createObjectURL(todo.picture)}/>
                    <p>{todo.title}</p>
                </div>
        )
        return ( 
        <div className="guest-wrap">{todoItems}</div>
        );
    }
}
 
export default Index;
