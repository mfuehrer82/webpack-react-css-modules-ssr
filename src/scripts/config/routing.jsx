import React from 'react';

import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import browserHistory from 'react-router/lib/browserHistory';

import Application from '../components/container/Application.jsx';
import Dashboard from '../components/pages/Dashboard.jsx';
import Imprint from '../components/pages/Imprint.jsx';
import NotFound from '../components/pages/NotFound.jsx';

export default (
    <Router history={browserHistory}>
        <Route path="/" component={Application}>
            <IndexRoute component={Dashboard}/>
            <Route path="imprint" component={Imprint} />
            <Route status={404} path="*" component={NotFound}/>
        </Route>
    </Router>
);
