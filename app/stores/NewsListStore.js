/**
 * Created by orel- on 15/Mar/16.
 */
import alt from '../alt';
import {where} from 'underscore';
import NewsListActions from '../actions/NewsListActions';

class NewsListStore{
    constructor(){
        this.bindActions(NewsListActions);
        this.news = [];
    }

    onPushTweet(data){
        this.news.unshift(data);

        //Check if too much on screen
        if(this.news.length >= 10){
            //Remove last item
            this.news.splice(this.news.length-1,1);
        }
    }

    onClearNews() {
        this.news = [];
    }

    onGetLatestSuccess(data){
        this.news = data;
    }

    oneGetLatestFail(jqXhr){
        toastr.error(jqXhr.responseText);
    }

    onGetTopSuccess(payload){
        this.news = payload.data;
    }

    onGetTopFail(jqXhr){
        toastr.error(jqXhr.responseText);
    }
}

export default alt.createStore(NewsListStore);