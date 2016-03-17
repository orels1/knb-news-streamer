/**
 * Created by orel- on 06/Dec/15.
 */
import React from 'react';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import {Link} from 'react-router';

import NewsList from './NewsList';
import NewsListActions from '../actions/NewsListActions';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = HomeStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        HomeStore.listen(this.onChange);

        let socket = io.connect();

        socket.on('news update event', (data) => {
            if (data){
                NewsListActions.pushTweet(data);
            }
        });

        socket.on('news update error', (err) => {
            toastr.error(err.responseText);
        });
    }

    componentWillUnmount() {
        HomeStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    handleNewsRefresh(event){
        event.preventDefault();
        NewsListActions.clearNews();
        HomeActions.refreshNews();
    }

    handleNewsTop(time){
        NewsListActions.clearNews();

        var payload = {
            time: time,
            history: this.props.history
        };
        NewsListActions.getTop(payload);
    }

    render(){

        return(
            <div>
                <div className="clearfix"></div>

                <div className="col-md-10 col-md-offset-1">
                    <h2 className="welcome"> Канобу | Новостной стрим </h2>
                    <button className="btn btn-primary" onClick={this.handleNewsRefresh.bind(this)}>Обновить новости</button>
                    <button className="btn btn-info" onClick={this.handleNewsTop.bind(this, 3600000)}>Топ за час</button>
                    <NewsList />
                </div>
            </div>
        );
    }
}

export default Home;