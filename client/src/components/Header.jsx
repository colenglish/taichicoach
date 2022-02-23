import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import UserContext from '../contexts/user-context';

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
                <UserContext.Consumer >
                    {user => (
                        <div className="loggedIn">
                            <div>Hi {user ? user.firstName : ''}</div>                    
                            <div>
                                <form method="POST" action="/users/logout?_method=DELETE">
                                    <Button variant="outline-secondary" size="sm" type="submit" >Sign Out</Button>
                                </form>
                            </div>
                        </div>
                    )}                    
                </UserContext.Consumer>
            </header> 
        );
    }
}

export default Header;