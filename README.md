# Webpack, React, CSS Modules, SSR

A basic project with Webpack, React, CSS Modules and Server Side Rendering.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Prerequisites

* Unix like System (e.g. Mac, Ubuntu)
* Node.js `>= 6.0.0`
* NPM `>= 3.0.0`

## Execute

Install the application:

```sh
npm install && npm run build
```

Then first start the express server:

```sh
npm start
```

This creates [localhost:3000](http://localhost:3000) and you can access
the site.

You can also start in another terminal (after `npm start`) browser sync
and file watch in another terminal **without autoreload** (I'm working
on it to reduce it to one task):

```sh
npm run watch
```

This creates the [localhost:3001](http://localhost:3001) and a network url.

# Folder structure

Folder                           | Description
---------------------------------|----------------------------------------
`build/`                         | Contains the webpack client and server configuration
`src/root/`                      | All files used at the root folder for static file serving
`src/scripts/components/`        | The React components
`src/scripts/config/routing.jsx` | The application routing configuration
`src/scripts/client.js`          | The frontend Javascript
`src/scripts/server.js`          | The Node.js Express server
`src/styles/`                    | CSS Modules
`src/templates/`                 | The base HTML template to serve with Express
