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
}

export default alt.createStore(NavbarStore);