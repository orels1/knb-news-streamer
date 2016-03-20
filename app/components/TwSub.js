/**
 * Created by antonorlov on 18/03/16.
 */
import React from 'react';
import TwSubStore from '../stores/TwSubStore';
import TwSubActions from '../actions/TwSubActions';

class TwSub extends React.Component{
    constructor(props){
        super(props);
        this.state = TwSubStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        TwSubStore.listen(this.onChange);
        TwSubActions.getTwSub();
    }

    componentWillUnmount(){
        TwSubStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    handleSubmit(event){
        event.preventDefault();

        if(this.state.twName){
            TwSubActions.postTwSub(this.state.twName);
        }else{
            return toastr.error('Введите имя в twitter');
        }
    }

    handleTwSubDelete(twSubId, index){
        TwSubActions.delTwSub(twSubId, index);
    }

    render() {
        let subsList = this.state.twSubs.map((twSub, index) =>{
            return(
                <li key={twSub._id} className="list-group-item">
                    <div className="pull-left">
                        @{twSub.screen_name}
                    </div>
                    <div className="pull-right">
                        <button className="btn btn-danger btn-xs" onClick={this.handleTwSubDelete.bind(null, twSub._id, index)}>
                            <span className="glyphicon glyphicon-trash"></span>
                        </button>
                    </div>
                    <div className="clearfix"></div>
                </li>
            );
        });

        return(
            <div className="col-md-6 col-md-offset-3">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="form-group" style={{marginBottom: 0}}>
                                <label className="control-label">Twitter имя</label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    ref="twitterSubName"
                                    placeholder="kanobu_ru"
                                    value = {this.state.twName}
                                    onChange = {TwSubActions.updateTwName} autoFocus
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <ul className="list-group">
                    {subsList}
                </ul>
            </div>
        );
    }
}

export default TwSub;