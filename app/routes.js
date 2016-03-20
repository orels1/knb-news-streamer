/**
 * Created by orel- on 06/Dec/15.
 */
import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import TwSub from './components/TwSub';
import NewsList from './components/NewsList';


export default (
    <Route component={App}>
        <Route path='/' component={Home} />
        <Route path='/news/twitter/top/:time' component={NewsList} />
        <Route path='/subs/twitter' component={TwSub} />
        <Route path='*' component={Home} />
    </Route>
);