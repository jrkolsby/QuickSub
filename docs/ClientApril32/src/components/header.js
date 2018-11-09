import React, {Component} from 'react'

//import mainLogo from '../assets/logo.png'

class Logo extends Component {
    render() {
        return (
            <div id="logo">
                <img src={""} alt="logo"/> */
                Columbia Paper Infinity
            </div>
        )
    }
}
    

class Navigation extends Component {
    constructor(props)  {
        super(props)

        this.linkTitles = ["Home", "Log Sales", "Party Planning"]
    }

    renderLinks() {
        return this.linkTitles.map((link, index) => {
            var className = ""

            if (index === this.props.activeIndex) {
                className = "active"
            }

            return (
                <li
                    key = {index}
                    className = {className}
                    onClick = {() => this.props.handleClick(index)}
                >{this.linkTitles[index]}</li>
            )
        })
    }

    render() {
        return (
            <ul>{this.renderLinks()}</ul>
        ) 
    }
}

class Header extends Component {
    render() {
        return (
            <header>
                <div id="header-container">
                    <Logo />
                    <Navigation 
                        activeIndex = {this.props.activeIndex}
                        handleClick = {this.props.handleClick}
                    />
                </div>
            </header>
        )
    }
}

export default Header
