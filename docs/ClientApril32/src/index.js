import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import rootReducer from './reducers'

import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'

import registerServiceWorker from './registerServiceWorker';

import "./style/reset.css"
import "./style/index.css"

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root')
);

registerServiceWorker();
