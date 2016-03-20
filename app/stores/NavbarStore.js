/**
 * Created by orel- on 06/Dec/15.
 */
import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
    constructor(){
        this.bindActions(NavbarActions);
        this.searchQuery = '';
        this.ajaxAnimationClass = '';
        this.streamState = false;
    }

    //onFindNewsSuccess(payload) {
    //    payload.history.pushState(null, '/news/' + payload.type + '/' + payload.newsId);
    //}
    //
    //onFindNewsFail(payload) {
    //    payload.searchForm.classList.add('shake');
    //    setTimeout(() => {
    //        payload.searchForm.classList.remove('shake');
    //    }, 1000);
    //}

    onUpdateSearchQuery(event) {
        this.searchQuery = event.target.value;
    }

    onUpdateAjaxAnimation(className) {
        this.ajaxAnimationClass = className; //fadein or fadeout
    }

    onGetStreamStatusSuccess(data){
        this.streamState = data;
    }

    onGetStreamStatusFail(jqXhr){
        toastr.error(jqXhr.responseText);
    }

    onUpdateStreamStatus(data){
        this.streamState = data;
    }

    onControlStreamSuccess(data){
        toastr.success(data);
    };

    onControlStreamFail(jqXhr){
        toastr.error(jqXhr.responseText);
    }
}

export default alt.createStore(NavbarStore);