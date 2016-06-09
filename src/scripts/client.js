import ReactDOM from 'react-dom';
import routes from './config/routing.jsx';

ReactDOM.render(
    routes,
    document.querySelector('[data-mount="app"]')
);
