import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners'; // Import the spinner from the library
import { Button, Tabs, Tab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAllInfo } from './fcts/functions.js';
import { Navigate } from 'react-router-dom';
import SportResults from './results/SportResults.js';
import { AuthContext } from '../AuthContext';


class Results extends Component {
    static contextType = AuthContext;

    state = {
        loading: true,
        currentTab: 0,
        redirectToLanding: false,
        data: {},
    };

    handleLogout = () => {
        const { logout } = this.context;
        if (logout) {
            logout(); // Call the logout function from AuthContext
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
        position: 'sticky',  // Make the tabs sticky
        top: 0,              // Position them at the top
        zIndex: 10,          // Ensure they are above other content
        backgroundColor: '#020d2b', // Background color to match the rest of the page
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
            minWidth: { xs: 60, sm: 90 },
            padding: { xs: '6px 8px', sm: '6px 12px' },
            '&.Mui-selected': {
                color: '#fff',
            },
            '&.Mui-focusVisible': {
                backgroundColor: 'rgba(100, 95, 228, 0.32)',
            },
            [theme.breakpoints.down('sm')]: {
                fontSize: theme.typography.pxToRem(13),
            },
        }),
    );

    TabsContainer = styled('div')({
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#282c34',
        width: '100vw',  // Full viewport width
        left: 0,         // Align to the left of the viewport
        margin: 0,       // Remove any margin
        padding: 0,      // Remove any padding
    });


    async componentDidMount() {
        if (!localStorage.getItem('startDate')) {
            window.location.href = '/landing';
        }
        if (!localStorage.getItem('endDate')) {
            window.location.href = '/landing';
        }
        
        // refresh our access token
        try {
            const result = await getAllInfo();
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
        const runs = (data?.run?.stats?.Runs);
        const rides = (data?.ride?.stats?.Rides);
        const swims = (data?.swim?.stats?.Swims);
        const startDate = new Date(localStorage.getItem("startDate"));
        const endDate = new Date(localStorage.getItem("endDate"));
        return (
            <div className="results-page">
                {loading ? (
                    <div className="spinner-container">
                        <ClipLoader color="#3498db" loading={loading} size={60} />
                        <p style={{ color: '#FFFFFF' }}>Loading your activities. This may take a minute if you selected a large time range.</p>
                    </div>
                ) : (
                    <div className='content-container'>
                        <this.TabsContainer>
                            <this.StyledTabs value={currentTab} onChange={this.handleTabChange} textColor="secondary" centered>
                                <this.StyledTab label="All Sports" />
                                {runs && <this.StyledTab label="Run" />}
                                {rides && <this.StyledTab label="Bike" />}
                                {swims && <this.StyledTab label="Swim" />}
                            </this.StyledTabs>
                        </this.TabsContainer>
                        <Typography 
                            color='#c0c8d0' 
                            sx={{ 
                                mt: 2, 
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                px: { xs: 2, sm: 0 }
                            }}
                        >
                            From {startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} to {endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}:
                        </Typography>
                        {currentTab === 0 && (
                            <SportResults data={data['allSports']} sport='allSports' />
                        )}
                        {currentTab === 1 && (
                            <SportResults data={data['run']} sport='run' />
                        )}
                        {currentTab === 2  && (
                            <SportResults data={data['ride']} sport='ride' />
                        )}
                        {currentTab === 3  &&  (
                            <SportResults data={data['swim']} sport='swim' />
                        )}
                        <Typography 
                            sx={{ 
                                color: '#FFFFFF', 
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                px: { xs: 2, sm: 0 }
                            }}
                        >
                            Got questions? Check out the <a style={{ color: '#FC4C02' }} target='_blank' rel='noreferrer' href='/FAQ'>
                                FAQ
                            </a>
                        </Typography>
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