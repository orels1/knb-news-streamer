/**
 * Created by antonorlov on 18/03/16.
 */
import alt from '../alt';
import TwSubActions from '../actions/TwSubActions';

class TwSubStore {
    constructor(){
        this.bindActions(TwSubActions);
        this.twSubs = [];
        this.twName = '';
    }

    onGetTwSubSuccess(data){
        this.twSubs = data;
    }

    onGetTwSubFail(jqXhr){
        toastr.error(jqXhr.responseText);
    }

    onUpdateTwName(event){
        this.twName = event.target.value;
    }

    onPostTwSubSuccess(data){
        this.twName = '';
        this.twSubs.push(data);
    }

    onPostTwSubFail(jqXhr){
        toastr.error(jqXhr.responseText);
    }

    onDelTwSubSuccess(index) {
        this.twSubs.splice(index, 1);
    }

    onDelTwSubFail(jqXhr){
        toastr.error(jqXhr.responseText);
    }
}

export default alt.createStore(TwSubStore);