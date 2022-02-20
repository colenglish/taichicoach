import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

class Header extends Component {
    render() {
        return (
            <header className='title-wrapper'>
                <div className="sidebar-button-wrapper">
                    <Button variant="outline-secondary" size="sm" onClick={this.props.onShowFormSelector}>Forms</Button>
                </div>
                <div className="title">
                    <h1>Tai Chi Coach</h1>
                </div>
                <div className="loggedIn">
                    <div>Hi {this.props.name}</div>                    
                    <div>
                        <form method="POST" action="/users/logout?_method=DELETE">
                            <Button variant="outline-secondary" size="sm" type="submit" >Sign Out</Button>
                        </form>
                    </div>
                </div>
            </header> 
        );
    }
}

export default Header;