import { readFileSync } from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import template from 'lodash.template';
import routes from './config/routing.jsx';

const view = readFileSync(
    path.resolve('src/templates/index.html'),
    'utf8'
);
const server = express();

server.set('port', (process.env.PORT || 3000));
server.use(express.static('dist/client'));

server.get('*', (req, res) => {
    match(
        {
            routes,
            location: req.url
        },
        // Handle react component match
        (error, redirectLocation, renderProps) => {
            const data = {};
            const isNotFound = renderProps
                    .routes
                    .filter((route) => route.status === 404)
                    .length > 0;

            // Redirect page
            if (redirectLocation) {
                return res.redirect(
                    302,
                    redirectLocation.pathname + redirectLocation.search
                );
            }

            // Render proper component in basic template
            if (error) {
                data.body = error.message;
                res.status(500);
            } else if (renderProps) {
                data.body = ReactDOMServer.renderToString(
                    React.createFactory(RouterContext)(renderProps)
                );
                res.status(200);
            }

            // Page not found
            if (isNotFound) {
                res.status(400);
            }

            res.send(template(view)(data));
        }
    );
});

server.listen(server.get('port'), () => {
    console.log(
        `HTTP server is running at http://localhost:${server.get('port')}`
    );
});
