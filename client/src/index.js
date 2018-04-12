import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import rootReducer from './reducers'

import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'

import registerServiceWorker from './registerServiceWorker';

import "./style/reset.css"
import "./style/index.css"

let store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root')
);

registerServiceWorker();
