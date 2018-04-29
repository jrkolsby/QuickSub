import React, { Component } from 'react';

import './style/reset.css'
import './style/index.css'
import './style/icons.css'

import HeaderContainer from './containers/header-container.js'
import PlayerContainer from './containers/player-container.js'
import EditorContainer from './containers/editor-container.js'

class App extends Component {
    render() {
        return (
            <div className="captchup">
                <HeaderContainer />
                <PlayerContainer />
                <EditorContainer />
            </div>
        );
    }
}

export default App;
