import React, { Component, Fragment } from 'react';
import axios from 'axios'
import { Button, Modal } from 'react-bootstrap';
import MyVerticallyCenteredModal from './ModalSeries'

 
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            randImg : null,
            options : null,
            series : null,
            series_array:[],
            modalShow : false,
            setModalShow : false,
            currentSerieModal:null
         }
    }
    async componentDidMount(){
       
        await axios.get('https://api.betaseries.com/shows/random?client_id=ec52d61223e0')
            .then((response =>{
                this.setState({randImg:response.data.shows[0].images.show})
                this.setState({randTitle:response.data.shows[0].title})
                this.setState({randSeason:response.data.shows[0].seasons})
                this.setState({randEp:response.data.shows[0].episodes})
            }))
        await axios.get(' https://api.betaseries.com/shows/genres?client_id=ec52d61223e0')
            .then((response=>{
                const options = response.data.genres.map((todo) => 
                   <div>
                       <button>{todo}</button>
                   </div>
                )
                this.setState({options : options})
            }))
        await axios.get('https://api.betaseries.com/shows/list?client_id=ec52d61223e0&limit=20')
            .then((response=>{
                console.log(response.data.shows)
                const series = response.data.shows.map((todo) =>
                <div key={todo.id}>
                    <img onClick={this.handleLogIn} src={todo.images.banner}/>
                </div>
                )
                this.setState({series:series})
            }))
        await axios.get('https://api.betaseries.com/shows/discover?client_id=ec52d61223e0&limit=20&recent=true')
            .then((response =>{
                const series = response.data.shows.map((todo) =>
                axios.get(`https://api.betaseries.com/pictures/shows?client_id=ec52d61223e0&id=${todo.id}&width=189&height=275`, {responseType: 'blob'})
                    .then((picture =>{
                        this.setState({
                        series_array: this.state.series_array.concat({title:todo.title, id:todo.id, picture:picture.data})
                        })
                    }))
                );
            }))
    }
    modalShow = (id=null) =>{
        if(id !== null){            
            axios.get(`https://api.betaseries.com/shows/display?id=${id}&client_id=ec52d61223e0`)
            .then((response=>{
                console.log(response)
                this.setState({currentSerieModal : response.data})
                const show = !this.state.modalShow
                this.setState({modalShow : show})
            }))
        }else{
            const show = !this.state.modalShow
            this.setState({modalShow : show})
        }
    }
    render() {
        const series = this.state.series_array.map((todo) =>
                <div>
                    <img onClick={()=>this.modalShow(todo.id)} src={URL.createObjectURL(todo.picture)}/>
                </div>
        )
        return (
            <Fragment>
            <div id="header" className="header headerResponsive" style={{backgroundImage: "linear-gradient(-180deg,rgba(0,0,0,0) 0,rgba(0,0,0,.2) 51%,rgba(0,0,0,.8) 100%),url("+this.state.randImg+")"}}>
                <div className="header-caption">
                    <div className="container">

                <div className="header-caption__content">
                        <span className="nd nd--100">{this.state.randTitle}</span>
                        <br className="d-none d-md-block" />
                        <div className="nd nd--100 dib">S{this.state.randSeason}E{this.state.randEp}</div>
                </div>

                    </div>
                </div>
            </div>
            <div className="home-wrap">
                <div className="home-search">
                        <div className="home-search-top">
                            <input type="text" placeholder="Nom de la série"></input>
                            <span>GENRE</span>
                            <div className="line"></div>
                        </div>
                        {this.state.options}
                   
                </div>
                <div className="home-shows">
                    
                   {series}
                </div>
            </div>
            {this.state.currentSerieModal ? <MyVerticallyCenteredModal
                        show={this.state.modalShow}
                        onHide={this.modalShow}
                        id={this.state.currentSerieModal}
                        x={this.props.x}
                    /> : null}
            </Fragment>
         );
    }
}
 
export default Home;

