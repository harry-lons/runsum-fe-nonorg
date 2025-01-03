import React, { Component } from 'react';
import { Grid2, Typography } from '@mui/material';


class StatCard extends Component {

    render() {
        const cellSX = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #648c94', // Border between cells
            minWidth: 300,
            textAlign: 'center',
            flexDirection: 'column',
            padding: 2,
        };
        const statName = this.props.statName;
        const statData = this.props.statData;
        return (
            <Grid2 size={2} sx={cellSX}>
                <Typography variant="h3" fontFamily="'Poppins', sans-serif" color="#b0b8c0">{statData}</Typography>
                <Typography variant="body2" color="#ffffff">{statName}</Typography>
            </Grid2>
        )
    }
}

export default StatCard