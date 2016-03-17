/**
 * Created by orel- on 06/Dec/15.
 */
import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';


export default (
    <Route component={App}>
        <Route path='/' component={Home} />
        <Route path='*' component={Home} />
    </Route>
);