import React, { Component } from 'react';

class Nav extends Component {
    constructor() {
        super();

        this.state = {
            version: require('./../../package.json').version,
        };
    }

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark">
                <a className="navbar-brand" href="/">
                    Tu veux une médaille !? <small>v{ this.state.version }</small>
                </a>
            </nav>
        );
    }
}

export default Nav;
