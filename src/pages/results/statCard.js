import React, { Component } from 'react';
import { Grid2, Typography } from '@mui/material';


class StatCard extends Component {

    render() {
        const cellSX = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #648c94', // Border between cells
            minWidth: { xs: 150, sm: 200, md: 250, lg: 300 },
            textAlign: 'center',
            flexDirection: 'column',
            padding: { xs: 1.5, sm: 2 },
        };
        const statName = this.props.statName;
        const statData = this.props.statData;
        return (
            <Grid2 size={{ xs: 6, sm: 4, md: 3, lg: 2 }} sx={cellSX}>
                <Typography 
                    variant="h3" 
                    fontFamily="'Poppins', sans-serif" 
                    color="#b0b8c0"
                    sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' } }}
                >
                    {statData}
                </Typography>
                <Typography 
                    variant="body2" 
                    color="#ffffff"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                    {statName}
                </Typography>
            </Grid2>
        )
    }
}

export default StatCard