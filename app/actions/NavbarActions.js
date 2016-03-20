/**
 * Created by orel- on 06/Dec/15.
 */
import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
    constructor(){
        this.generateActions(
            'updateSearchQuery',
            'updateAjaxAnimation',
            'findNewsSuccess',
            'findNewsFail',
            'getStreamStatusSuccess',
            'getStreamStatusFail',
            'updateStreamStatus',
            'controlStreamSuccess',
            'controlStreamFail'
        );
    }

    findNews(payload){
        $.ajax({
            type: 'GET',
            url: '/api/news/search',
            data: { name: payload.searchQuery }
        })
            .done((data) => {
                assign(payload, data);
                this.actions.findNewsSuccess(payload);
            })
            .fail(() => {
                this.actions.findNewsFail(payload);
            });
    }

    getStreamStatus(){
        $.ajax({
            type: 'GET',
            url: '/api/news/controls'
        })
            .done((data) => {
                this.actions.getStreamStatusSuccess(data);
            })
            .fail((jqXhr) => {
                this.actions.getStreamStatusFail(jqXhr);
            })
    }

    controlStream(state){
        $.ajax({
                type: state ? 'DELETE' : 'POST',
                url: '/api/news/controls'
            })
            .done((data) => {
                this.actions.controlStreamSuccess(data);
            })
            .fail((jqXhr) => {
                this.actions.controlStreamFail(jqXhr);
            });
    }

}

export default alt.createActions(NavbarActions);