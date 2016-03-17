/**
 * Created by orel- on 15/Mar/16.
 */
import alt from '../alt';

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

    getTop(time){
        $.ajax({
            type: 'GET',
            url: '/api/news/top',
            data: {time: time}
        })
            .done((data) =>{
                this.actions.getTopSuccess(data);
            })
            .fail((jqXhr) =>{
                this.actions.getTopFail(jqXhr);
            });
    }
}

export default alt.createActions(NewsListActions);