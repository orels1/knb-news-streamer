/**
 * Created by orel- on 15/Mar/16.
 */
import alt from '../alt';
import {extend} from 'underscore';

class NewsListActions {
    constructor() {
        this.generateActions(
            'pushTweet',
            'clearNews',
            'getLatestSuccess',
            'getLatestFail',
            'getTopSuccess',
            'getTopFail'
        );
    }

    getLatestNews(){
        $.ajax({
            type: 'GET',
            url: '/api/news/latest'
        })
            .done((data) =>{
                this.actions.getLatestSuccess(data);
            })
            .fail((jqXhr) => {
                this.actions.getLatestFail(jqXhr);
            });

    };

    getTop(payload){
        $.ajax({
            type: 'GET',
            url: '/api/news/top',
            data: {time: payload.time}
        })
            .done((data) =>{
                payload.data = data;
                this.actions.getTopSuccess(payload);
            })
            .fail((jqXhr) =>{
                this.actions.getTopFail(jqXhr);
            });
    }
}

export default alt.createActions(NewsListActions);