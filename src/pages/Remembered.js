import Button from '@mui/material/Button';
import React, { useContext } from 'react';
import {AuthContext} from '../AuthContext';

const Remembered = ( ) => {

    const authContext = useContext(AuthContext);

    const handleContinueClick = () => {
        window.location.href = '/landing';
    }

    const handleLogoutClick = () => {
        authContext['logout']();
    }

    const name = authContext['firstName']

    return (
        <div className='about-page' style={{ justifyContent: 'center' }}>
            <div className='about-header'>
                Welcome back {name}!
            </div>
            <div className='about-break' />
            <div className='about-description'>
                <p>We remember you from last time. Unless you'd like to change accounts?</p> 
            </div>
            <div style={{display: 'flex', flexDirection: 'row', gap: '15px', flexWrap: 'wrap', justifyContent: 'center'}}>
                <Button className='logout' onClick={handleContinueClick} sx={{ minWidth: { xs: '250px', sm: 'auto' } }}>Continue as {name}</Button>
                <Button className='logout' onClick={handleLogoutClick} sx={{ minWidth: { xs: '250px', sm: 'auto' } }}>Log out</Button>
            </div>

        </div>
    );
}

export default Remembered;