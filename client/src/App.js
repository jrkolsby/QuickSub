import React, { Component } from 'react';

import './style/reset.css'
import './style/index.css'

import EditorContainer from './containers/editor-container.js'
//import NavigationContainer from './containers/navigation-container.js'

class App extends Component {
    constructor(props) {
        super(props)
        console.log('CaptchUp!')
    }

    render() {
        return (
            <EditorContainer />
        );
    }
}

export default App;
