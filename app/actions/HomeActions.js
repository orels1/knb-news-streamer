/**
 * Created by orel- on 08/Dec/15.
 */
import alt from '../alt';

class HomeActions {
    constructor() {
        this.generateActions(
            'refreshNewsSuccess',
            'refreshNewsFail'
        );
    }

    refreshNews(){
        $.ajax({
            type: 'GET',
            url: '/api/news/refresh'
            }
        )
            .done((data) => {
                this.actions.refreshNewsSuccess(data);
            })
            .fail((jqXhr) => {
                this.actions.refreshNewsFail(jqXhr);
            });
    }
}

export default alt.createActions(HomeActions);