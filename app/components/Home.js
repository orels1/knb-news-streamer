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

        socket.on('news refresh event', (data) => {
            if (data){
                NewsListActions.replaceTweets(data);
            }
        });
    }

    componentWillUnmount() {
        HomeStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render(){

        return(
            <div>
                <NewsList params={{time: "3600000"}} />
            </div>
        );
    }
}

export default Home;