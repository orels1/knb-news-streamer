/**
 * Created by orel- on 15/Mar/16.
 */
import React from 'react';
import {Link} from 'react-router';
import NewsListStore from '../stores/NewsListStore';
import NewsListActions from '../actions/NewsListActions';

class NewsList extends React.Component{
    constructor(props) {
        super(props);
        this.state = NewsListStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        NewsListStore.listen(this.onChange);
        NewsListActions.getLatestNews();
    }

    componentWillUnmount(){
        NewsListStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        let newsList = this.state.news.map((newsItem, index) => {
            return (
                <div key={newsItem.id} className='list-group-item animated fadeIn' >
                    <div className='media'>
                        <div className='media-body'>
                            <div className="field">
                                <small>Автор</small>
                                <strong>{newsItem.user.name} (<a href={"http://twitter.com/"+newsItem.user.screen_name}>@{newsItem.user.screen_name}</a>)</strong>
                            </div>
                            <div className="field">
                                <small>Линк</small>
                                <strong><a href={"http://twitter.com/"+newsItem.user.screen_name+"/status/"+newsItem.id_str}>Прямая ссылка</a></strong>
                            </div>
                            <br />
                            <div className="field text">
                                <small>Текст</small>
                                <span>
                                    {newsItem.text}
                                </span>
                            </div>
                            {newsItem.entities.media &&
                                <div className="twitterImage" style={{backgroundImage: 'url('+newsItem.entities.media[0].media_url+')'}}>
                                </div>
                            }
                            <br />
                            <div className="field"><small>Репосты</small><strong>{newsItem.retweet_count}</strong></div>
                            <div className="field"><small>Лайки</small><strong>{newsItem.favorite_count}</strong></div>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className='list-group newsList'>
                {newsList}
            </div>
        );
    }
}

export default NewsList;