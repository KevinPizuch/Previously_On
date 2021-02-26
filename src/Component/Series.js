import React, { Component } from 'react';
import axios from 'axios'
class Series extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            series_title : null,
            series_description : null,
            series_seasons : null,
            series_episodes : null,
            series_length : null,
            series_background : null,
            series_poster : null,
            series_notes : null,
            series_creation : null,
            series_genres : null,
            series_array_season : [],
            series_array_episodes : [],
            series_array_news : [],
            series_array_comments : [],
            series_array_similars : []
         }
    }
    async componentDidMount(){
        await axios.get(`https://api.betaseries.com/shows/display?id=${this.props.id}&client_id=ec52d61223e0`)
            .then((response=>{
                console.log(response.data.show.genres)
                const a = response.data.show.genres
                const x = Object.keys(a).map((keyName, i) => (
                    <span className="travelcompany-input" key={i}>
                        {a[keyName]}&nbsp;
                    </span>
                ))
                
                this.setState({
                    series_title : response.data.show.title,
                    series_description : response.data.show.description,
                    series_seasons : response.data.show.seasons,
                    series_episodes : response.data.show.episodes,
                    series_length : response.data.show.length,
                    series_background : response.data.show.images.poster,
                    series_poster : response.data.show.images.poster,
                    series_notes : response.data.show.notes.mean,
                    series_creation : response.data.show.creation,
                    series_status : response.data.show.status,
                    series_genres : x
                })
            }))
        await axios.get(`https://api.betaseries.com/shows/seasons?id=${this.props.id}&client_id=ec52d61223e0`)
            .then((response =>{
                
                const a = response.data.seasons
                const x = a.map((item) => (
                    <div>
                        <img src={item.image}/>
                        <p>Saison {item.number}</p>
                        <p>{item.episodes} épisodes</p>
                    </div>
                ))
                this.setState({series_array_season : x})
            }))
        await axios.get(`https://api.betaseries.com/shows/episodes?id=${this.props.id}&client_id=ec52d61223e0`)
            .then((response =>{
                const episodes = response.data.episodes.map((todo) =>
                axios.get(`https://api.betaseries.com/pictures/shows?client_id=ec52d61223e0&id=${todo.show.id}&width=170&height=250`, {responseType: 'blob'})
                    .then((picture =>{
                        this.setState({
                            series_array_episodes: this.state.series_array_episodes.concat({title:todo.code, picture:picture.data})
                        })
                    }))
                    );
                console.log(this.state.series_episodes)
                
            }))
        await axios.get(`https://api.betaseries.com/news/last?client_id=ec52d61223e0`)
            .then((response =>{
                this.setState({series_array_news : response.data.news})
            }))
        await axios.get(`https://api.betaseries.com/comments/comments?client_id=ec52d61223e0&type=show&id=${this.props.id}&nbpp=10`)
            .then((response =>{
                console.log(response)
                const a = response.data.comments
                const x = a.map((item) => (
                    <div>
                        <p>{item.text}</p>
                        <img src={item.avatar}/>
                        <p>{item.login}</p>
                        <p>{item.date}</p>
                    </div>
                ))
                this.setState({series_array_comments : x})
            }))
        await axios.get(`https://api.betaseries.com/shows/similars?id=${this.props.id}&client_id=ec52d61223e0`)
            .then((response =>{
                this.setState({series_array_similars : response.data.similars})
            }))
    }
    render() {
        const series = this.state.series_array_episodes.map((todo) =>
        <div>
            <img src={URL.createObjectURL(todo.picture)}/>
            <p>{todo.title}</p>
        </div>
)
        return (
            <div className="series-wrap" >
                {console.log(this.state.series)}
                <div className="series-body">
                    <div className="series-left">
                        GENRES<br/>
                        {this.state.series_genres}<br/><br/>
                        DURÉE D’UN ÉPISODE<br/>
                        {this.state.series_length} minutes<br/><br/>
                        STATUT<br />
                        {this.state.series_status}<br/><br/>

                    </div>
                    <div className="series-mid">
                        <h2>{this.state.series_title}</h2>
                        <p>{this.state.series_notes} sur 5&nbsp;&nbsp;&nbsp;{this.state.series_creation}&nbsp;&nbsp;&nbsp;{this.state.series_seasons} saisons &nbsp;&nbsp;&nbsp;{this.state.series_episodes} épisodes</p>
                        <p>{this.state.series_description}</p>
                    </div>
                    <div className="series-right">
                        <img src={this.state.series_poster} />
                    </div>
                </div>
                <div className="series-info-bar">
                    <ul>
                        <li>SAISONS</li>
                        <li>EPISODES</li>
                        <li>COMMENTAIRES</li>
                    </ul>
                </div>
                <div className="series-info-wrap">
                    <h3>Saisons</h3>
                    <div className="series-info-seasons">
                        
                        {this.state.series_array_season}
                    </div>
                    <h3>Épisodes</h3>
                    <div className="series-info-episodes">
                        {series}
                    </div>
                    <h3>Commentaires</h3>
                    <div>
                        {this.state.series_array_comments}
                    </div>
                </div>
                {/* {console.log(this.state.series_array_season,
        this.state.series_array_episodes,
        this.state.series_array_news,
        this.state.series_array_comments,
        this.state.series_array_similars)} */}
            </div>

        );
    }
}
 
export default Series;