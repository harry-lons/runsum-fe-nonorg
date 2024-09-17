import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners'; // Import the spinner from the library
import { Button, Tabs, Tab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAllInfo } from './fcts/functions.js';
import { Navigate } from 'react-router-dom';
import AllSportsResults from './results/allSports.js';
import RunResults from './results/run.js';
import BikeResults from './results/bike.js';
import SwimResults from './results/swim.js';


class Results extends Component {
    state = {
        loading: true,
        currentTab: 0,
        redirectToLanding: false,
        data: {},
    };

    handleLogout = () => {
        const { logout } = this.props;
        if (logout) {
            logout(); // Call the passed logout function
        }
    };

    handleTabChange = (event, newValue) => {
        this.setState({ currentTab: newValue });
    };

    handleNewTimeRange = () => {
        localStorage.removeItem('startDate');
        localStorage.removeItem('endDate');
        this.setState({ redirectToLanding: true });
    };
    StyledTabs = styled((props) => (
        <Tabs
            {...props}
            TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        />
    ))({
        '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
        },
        '& .MuiTabs-indicatorSpan': {
            maxWidth: 40,
            width: '100%',
            backgroundColor: '#635ee7',
        },
    });

    StyledTab = styled((props) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
            textTransform: 'none',
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: theme.typography.pxToRem(15),
            marginRight: theme.spacing(0),
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-selected': {
                color: '#fff',
            },
            '&.Mui-focusVisible': {
                backgroundColor: 'rgba(100, 95, 228, 0.32)',
            },
        }),
    );

    async componentDidMount() {
        if (!localStorage.getItem('startDate')) {
            window.location.href = '/landing';
        }
        if (!localStorage.getItem('endDate')) {
            window.location.href = '/landing';
        }
        const accessToken = await this.props.getAccessToken();
        if (!accessToken) {
            console.log("no access token :(");
            this.setState({ redirectToLanding: true })
        }
        // refresh our access token
        try {
            const result = await getAllInfo(accessToken);
            if (result && result['allSports']) {
                console.log("setting result state with function data");
                this.setState({ data: result });
            }
            else {
                this.setState({ redirectToNeedLogin: true });
            }
        }
        catch (e) {
            console.log("error getting data: ", e);
            this.setState({ redirectToLanding: true });
        }
        finally {
            this.setState({ loading: false });
        }
    }
    render() {
        const { loading, currentTab, data } = this.state;
        if (this.state.redirectToLanding) {
            return <Navigate to="/landing" />;
        }
        const startDate = new Date(localStorage.getItem("startDate"));
        const endDate = new Date(localStorage.getItem("endDate"));
        return (
            <div className="results-page">
                {loading ? (
                    <div className="spinner-container">
                        <ClipLoader color="#3498db" loading={loading} size={60} />
                        <p color='#ffffff'>Loading your activities. This may take a minute if you selected a large time range.</p>
                    </div>
                ) : (
                    <div className='content-container'>
                        <this.StyledTabs value={currentTab} onChange={this.handleTabChange} textColor="secondary" centered>
                            <this.StyledTab label="All Sports" />
                            <this.StyledTab label="Run" />
                            <this.StyledTab label="Bike" />
                            <this.StyledTab label="Swim" />
                        </this.StyledTabs>
                        <Typography color='#c0c8d0' sx={{ margin: 2 }}>From {startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} to {endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}:</Typography>
                        {currentTab === 0 && (
                            <p style={{ color: '#FFFFFF' }}><AllSportsResults data={data['allSports']} /></p>
                        )}
                        {currentTab === 1 && (
                            <p style={{ color: '#FFFFFF' }}><RunResults /></p>
                        )}
                        {currentTab === 2 && (
                            <p style={{ color: '#FFFFFF' }}><BikeResults /></p>
                        )}
                        {currentTab === 3 && (
                            <p style={{ color: '#FFFFFF' }}><SwimResults /></p>
                        )}
                        <div className='buttons-container'>
                            <Button className='actionButtons' onClick={this.handleNewTimeRange}>New Time Range</Button>
                            <Button className='actionButtons' onClick={this.handleLogout}>Log out</Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Results;