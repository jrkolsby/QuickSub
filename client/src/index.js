import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import rootReducer from './reducers'

import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'

import registerServiceWorker from './registerServiceWorker';

let store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root')
);

registerServiceWorker();
