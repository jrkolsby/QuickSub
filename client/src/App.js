import React, { Component } from 'react';

import './style/reset.css'
import './style/index.css'

import NavigationContainer from './containers/navigation.js'

import EditorContainer from './containers/editor.js'
import ImporterContainer from './containers/importer.js'
import ExporterContainer from './containers/exporter.js'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <EditorContainer />
        );
    }
}

export default App;
