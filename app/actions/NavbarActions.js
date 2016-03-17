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
            'findNewsFail'
        );
    }

    findNews(payload){
        $.ajax({
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

}

export default alt.createActions(NavbarActions);