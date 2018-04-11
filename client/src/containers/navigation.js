import React, {Component} from 'react'

import Header from '../components/header'

import {connect} from 'react-redux';
import * as actionCreators from '../actions'

let CLASS_CONTAINER = "nav-container"
let CLASS_SELECTED = "nav-current"
let CLASS_LEFT = "nav-left"
let CLASS_RIGHT = "nav-right"

class NavigationPageContainer extends Component {
    render() {
        return (
            <div className={this.props.navClass}>
                {this.props.children}
            </div>
        )
    }
}

class NavigationContainer extends Component {
    componentWillMount() {
        React.Children.count(this.props.children)
    }

    renderChildren() {
        return React.Children.map(this.props.children, (child, index) => {

            var navClass = CLASS_SELECTED

            if (index < this.props.index) { navClass = CLASS_LEFT }
            if (index > this.props.index) { navClass = CLASS_RIGHT }

            return (
                <NavigationPageContainer navClass={navClass}>
                    {child}
                </NavigationPageContainer>
            )
        })
    }

    render() {
        return (
            <div id={CLASS_CONTAINER}>
                <Header
                    activeIndex={this.props.index}
                    handleClick={this.props.navigate}
                />
                <main>
                    {this.renderChildren()}
                </main>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state.nav;
}

export default connect(mapStateToProps, actionCreators)(NavigationContainer)
