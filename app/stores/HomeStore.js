/**
 * Created by orel- on 08/Dec/15.
 */
import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
    constructor(){
        this.bindActions(HomeActions);
    }

    onRefreshNewsSuccess(data){
        toastr.success(data);
    };

    onRefreshNewsFail(jqXhr){
        toastr.error(jqXhr.responseText);
    }
}

export default alt.createStore(HomeStore);