/**
 * Created by antonorlov on 18/03/16.
 */
import alt from '../alt';

class TwSubActions {
    constructor(){
        this.generateActions(
            'getTwSubSuccess',
            'getTwSubFail',
            'postTwSubSuccess',
            'postTwSubFail',
            'delTwSubSuccess',
            'delTwSubFail',
            'updateTwName'
        );
    }
    
    getTwSub(){
        $.ajax({
            type: 'GET',
            url: '/api/subs/twitter'
        })
            .done((data) => {
                this.actions.getTwSubSuccess(data);
            })
            .fail((jqXhr) =>{
                this.actions.getTwSubFail(jqXhr);
            });
    };

    postTwSub(twName){
        $.ajax({
            type: 'POST',
            url: '/api/subs/twitter',
            data: {name: twName}
        })
            .done((data) =>{
               this.actions.postTwSubSuccess(data);
            })
            .fail((jqXhr) =>{
                this.actions.postTwSubFail(jqXhr);
            });
    }

    delTwSub(twSubId, index){
        $.ajax({
            type: 'DELETE',
            url: '/api/subs/twitter',
            data: {id: twSubId}
        })
            .done((data) =>{
                this.actions.delTwSubSuccess(index);
            })
            .fail((jqXhr) =>{
                this.actions.getTwSubFail(jqXhr);
            })
    }
    
}

export default alt.createActions(TwSubActions);