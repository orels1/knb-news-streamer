/**
 * Created by orel- on 06/Dec/15.
 */
import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = NavbarStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        NavbarStore.listen(this.onChange);

        //Ajax load animations
        $(document).ajaxStart(() => {
            NavbarActions.updateAjaxAnimation('loading');
        });

        $(document).ajaxComplete(() => {
            setTimeout(() => {
                NavbarActions.updateAjaxAnimation('');
            }, 750);
        });

        //Get initial stream status
        NavbarActions.getStreamStatus();

        //Stream status updates
        let socket = io.connect();
        socket.on('news stream event', (data) => {
            NavbarActions.updateStreamStatus(data);
        });
    }

    componentWillUnmount(){
        NavbarStore.unlisten(this.onChange);
    }

    onChange(state){
        this.setState(state);
    }

    handleSubmit(event){
        event.preventDefault();

        let searchQuery = this.state.searchQuery.trim();

        if(searchQuery){
            /*
            * TODO: Implement search here
            * */
        }
    }

    handleStreamControl(event){
        event.preventDefault();
        NavbarActions.controlStream(this.state.streamState);
    }

    render(){
        return(
            <nav className='navbar navbar-default navbar-static-top'>
                <div className='container-fluid'>
                    <div className='navbar-header'>
                        <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                        <Link to='/' className='navbar-brand'>
                            <div className={ 'spinner '+this.state.ajaxAnimationClass}></div>
                            Новостной поток
                        </Link>
                    </div>
                    <div className='navbar-collapse collapse' id='navbar'>
                        {false && <form className="navbar-form navbar-left top-search" onsubmit={this.handleSubmit.bind(this)} role="search">
                            <div className="input-group">
                                <input type="text" ref="topSearch" placeholder="Search" value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery}  className="form-control" />
                                <span className='input-group-btn'>
                                    <button type="submit"  onClick={this.handleSubmit.bind(this)} className="btn btn-default">Submit</button>
                                </span>
                            </div>
                        </form>}
                        <ul className="nav navbar-nav navbar-left">
                            <li><Link to="/subs/twitter">Twitter Settings</Link></li>
                            <li className="dropdown">
                                <a href="#"
                                   className="dropdown-toggle"
                                   data-toggle="dropdown"
                                   role="button"
                                   aria-haspopup="true"
                                   aria-expanded="false"
                                >
                                    Twitter Top
                                    <span className="caret"></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link to="/news/twitter/top/3600000" >Top of the hour</Link></li>
                                    <li><Link to="/news/twitter/top/86400000">Top of the day</Link></li>
                                </ul>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <button
                                onClick={this.handleStreamControl.bind(this)}
                                className={"btn btn-sm navbar-btn " + (this.state.streamState ? 'btn-danger' : 'btn-success')}
                            >{this.state.streamState ? 'Stop Streaming' : 'Start Stream'}</button>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;