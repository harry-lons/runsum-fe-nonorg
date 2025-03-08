import Button from '@mui/material/Button';
import React, { Component } from 'react';

class Remembered extends Component {

    handleContinueClick = () => {
        window.location.href = '/landing';
    }

    handleLogoutClick = () => {
        this.props.logout();
    }
    
    render() {
        const name = this.props.getFirstName();
        return (
            <div className='about-page' style={{ justifyContent: 'center' }}>
                <div className='about-header'>
                    Welcome back {name}!
                </div>
                <div className='about-break' />
                <div className='about-description'>
                    <p>We remember you from last time. Unless you'd like to change accounts?</p> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                    <Button className='logout' onClick={this.handleContinueClick}>Continue as {name}</Button>
                    <Button className='logout' onClick={this.handleLogoutClick}>Log out</Button>
                </div>

            </div>
        );
    }
}

export default Remembered;