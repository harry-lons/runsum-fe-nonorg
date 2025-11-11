import React, { Component } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MdZoomOutMap, MdZoomInMap } from 'react-icons/md';

class Graphs extends Component {
    state = {
        expandedGraphs: {
            distance: false,
            frequency: false,
            pace: false
        }
    };

    toggleGraphExpansion = (graphType) => {
        this.setState(prevState => ({
            expandedGraphs: {
                ...prevState.expandedGraphs,
                [graphType]: !prevState.expandedGraphs[graphType]
            }
        }));
    };
    // Process activities for distance over time
    processDistanceOverTime = (activities) => {
        if (!activities || activities.length === 0) return [];
        
        // Sort activities by date
        const sortedActivities = [...activities].sort((a, b) => 
            new Date(a.start_date_local) - new Date(b.start_date_local)
        );

        // Group by week for cleaner visualization
        const weeklyData = {};
        sortedActivities.forEach(activity => {
            const date = new Date(activity.start_date_local);
            // Get the start of the week (Monday)
            // If Sunday (0), go back 6 days to Monday; otherwise go back (day - 1) days
            const dayOfWeek = date.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - daysToMonday);
            weekStart.setHours(0, 0, 0, 0); // Reset to start of day
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = {
                    date: weekKey,
                    distance: 0,
                    count: 0
                };
            }
            // Convert meters to miles
            weeklyData[weekKey].distance += activity.distance / 1609.34;
            weeklyData[weekKey].count += 1;
        });

        // Fill in missing weeks with zero values
        if (sortedActivities.length > 0) {
            const firstActivity = new Date(sortedActivities[0].start_date_local);
            const lastActivity = new Date(sortedActivities[sortedActivities.length - 1].start_date_local);
            
            // Get Monday of first week
            const dayOfWeek1 = firstActivity.getDay();
            const daysToMonday1 = dayOfWeek1 === 0 ? 6 : dayOfWeek1 - 1;
            const startWeek = new Date(firstActivity);
            startWeek.setDate(firstActivity.getDate() - daysToMonday1);
            startWeek.setHours(0, 0, 0, 0);
            
            // Get Monday of last week
            const dayOfWeek2 = lastActivity.getDay();
            const daysToMonday2 = dayOfWeek2 === 0 ? 6 : dayOfWeek2 - 1;
            const endWeek = new Date(lastActivity);
            endWeek.setDate(lastActivity.getDate() - daysToMonday2);
            endWeek.setHours(0, 0, 0, 0);
            
            // Generate all weeks between start and end
            const currentWeek = new Date(startWeek);
            while (currentWeek <= endWeek) {
                const weekKey = currentWeek.toISOString().split('T')[0];
                if (!weeklyData[weekKey]) {
                    weeklyData[weekKey] = {
                        date: weekKey,
                        distance: 0,
                        count: 0
                    };
                }
                currentWeek.setDate(currentWeek.getDate() + 7); // Move to next week
            }
        }

        // Check if data spans multiple years
        const sortedWeeks = Object.values(weeklyData).sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[0].date).getFullYear() : null;
        const lastYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[sortedWeeks.length - 1].date).getFullYear() : null;
        const spansMultipleYears = firstYear !== lastYear;

        return sortedWeeks.map(week => ({
            date: new Date(week.date).toLocaleDateString('en-US', 
                spansMultipleYears 
                    ? { month: 'short', day: 'numeric', year: 'numeric' }
                    : { month: 'short', day: 'numeric' }
            ),
            distance: parseFloat(week.distance.toFixed(2))
        }));
    };

    // Process activities for activity frequency
    processActivityFrequency = (activities) => {
        if (!activities || activities.length === 0) return [];

        // Sort activities by date
        const sortedActivities = [...activities].sort((a, b) => 
            new Date(a.start_date_local) - new Date(b.start_date_local)
        );

        // Group by week
        const weeklyData = {};
        sortedActivities.forEach(activity => {
            const date = new Date(activity.start_date_local);
            // Get the start of the week (Monday)
            // If Sunday (0), go back 6 days to Monday; otherwise go back (day - 1) days
            const dayOfWeek = date.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - daysToMonday);
            weekStart.setHours(0, 0, 0, 0); // Reset to start of day
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = {
                    date: weekKey,
                    count: 0
                };
            }
            weeklyData[weekKey].count += 1;
        });

        // Fill in missing weeks with zero values
        if (sortedActivities.length > 0) {
            const firstActivity = new Date(sortedActivities[0].start_date_local);
            const lastActivity = new Date(sortedActivities[sortedActivities.length - 1].start_date_local);
            
            // Get Monday of first week
            const dayOfWeek1 = firstActivity.getDay();
            const daysToMonday1 = dayOfWeek1 === 0 ? 6 : dayOfWeek1 - 1;
            const startWeek = new Date(firstActivity);
            startWeek.setDate(firstActivity.getDate() - daysToMonday1);
            startWeek.setHours(0, 0, 0, 0);
            
            // Get Monday of last week
            const dayOfWeek2 = lastActivity.getDay();
            const daysToMonday2 = dayOfWeek2 === 0 ? 6 : dayOfWeek2 - 1;
            const endWeek = new Date(lastActivity);
            endWeek.setDate(lastActivity.getDate() - daysToMonday2);
            endWeek.setHours(0, 0, 0, 0);
            
            // Generate all weeks between start and end
            const currentWeek = new Date(startWeek);
            while (currentWeek <= endWeek) {
                const weekKey = currentWeek.toISOString().split('T')[0];
                if (!weeklyData[weekKey]) {
                    weeklyData[weekKey] = {
                        date: weekKey,
                        count: 0
                    };
                }
                currentWeek.setDate(currentWeek.getDate() + 7); // Move to next week
            }
        }

        // Check if data spans multiple years
        const sortedWeeks = Object.values(weeklyData).sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[0].date).getFullYear() : null;
        const lastYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[sortedWeeks.length - 1].date).getFullYear() : null;
        const spansMultipleYears = firstYear !== lastYear;

        return sortedWeeks.map(week => ({
            week: new Date(week.date).toLocaleDateString('en-US', 
                spansMultipleYears 
                    ? { month: 'short', day: 'numeric', year: 'numeric' }
                    : { month: 'short', day: 'numeric' }
            ),
            activities: week.count
        }));
    };

    // Helper function to fill missing weeks
    fillMissingWeeks = (weeklyData, sortedActivities) => {
        if (sortedActivities.length > 0) {
            const firstActivity = new Date(sortedActivities[0].start_date_local);
            const lastActivity = new Date(sortedActivities[sortedActivities.length - 1].start_date_local);
            
            // Get Monday of first week
            const dayOfWeek1 = firstActivity.getDay();
            const daysToMonday1 = dayOfWeek1 === 0 ? 6 : dayOfWeek1 - 1;
            const startWeek = new Date(firstActivity);
            startWeek.setDate(firstActivity.getDate() - daysToMonday1);
            startWeek.setHours(0, 0, 0, 0);
            
            // Get Monday of last week
            const dayOfWeek2 = lastActivity.getDay();
            const daysToMonday2 = dayOfWeek2 === 0 ? 6 : dayOfWeek2 - 1;
            const endWeek = new Date(lastActivity);
            endWeek.setDate(lastActivity.getDate() - daysToMonday2);
            endWeek.setHours(0, 0, 0, 0);
            
            // Generate all weeks between start and end
            const currentWeek = new Date(startWeek);
            while (currentWeek <= endWeek) {
                const weekKey = currentWeek.toISOString().split('T')[0];
                if (!weeklyData[weekKey]) {
                    weeklyData[weekKey] = {
                        date: weekKey,
                        hasData: false
                    };
                }
                currentWeek.setDate(currentWeek.getDate() + 7);
            }
        }
    };

    // Process activities for pace/speed progression
    processPaceProgression = (activities, sport) => {
        if (!activities || activities.length === 0) return [];

        // Filter activities with valid distance
        const validActivities = activities.filter(activity => activity.distance > 0);
        
        // Sort activities by date
        const sortedActivities = [...validActivities].sort((a, b) => 
            new Date(a.start_date_local) - new Date(b.start_date_local)
        );

        if (sortedActivities.length === 0) return [];

        // For swimming, calculate differently
        if (sport === 'swim') {
            // Group by week and calculate average pace per 100 yards
            const weeklyData = {};
            sortedActivities.forEach(activity => {
                const date = new Date(activity.start_date_local);
                // Get the start of the week (Monday)
                const dayOfWeek = date.getDay();
                const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - daysToMonday);
                weekStart.setHours(0, 0, 0, 0);
                const weekKey = weekStart.toISOString().split('T')[0];

                const distanceYards = activity.distance * 1.0936132983; // meters to yards
                const paceMinPer100 = (activity.moving_time / 60 / distanceYards) * 100;

                if (!weeklyData[weekKey]) {
                    weeklyData[weekKey] = {
                        date: weekKey,
                        totalPace: 0,
                        count: 0,
                        hasData: true
                    };
                }
                weeklyData[weekKey].totalPace += paceMinPer100;
                weeklyData[weekKey].count += 1;
            });

            // Fill missing weeks
            this.fillMissingWeeks(weeklyData, sortedActivities);

            // Check if data spans multiple years
            const sortedWeeks = Object.values(weeklyData).sort((a, b) => new Date(a.date) - new Date(b.date));
            const firstYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[0].date).getFullYear() : null;
            const lastYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[sortedWeeks.length - 1].date).getFullYear() : null;
            const spansMultipleYears = firstYear !== lastYear;

            return sortedWeeks.map(week => ({
                date: new Date(week.date).toLocaleDateString('en-US', 
                    spansMultipleYears 
                        ? { month: 'short', day: 'numeric', year: 'numeric' }
                        : { month: 'short', day: 'numeric' }
                ),
                value: week.hasData ? parseFloat((week.totalPace / week.count).toFixed(2)) : null
            }));
        } else if (sport === 'ride') {
            // For cycling, show speed in mph
            const weeklyData = {};
            sortedActivities.forEach(activity => {
                const date = new Date(activity.start_date_local);
                // Get the start of the week (Monday)
                const dayOfWeek = date.getDay();
                const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - daysToMonday);
                weekStart.setHours(0, 0, 0, 0);
                const weekKey = weekStart.toISOString().split('T')[0];

                const distanceMiles = activity.distance / 1609.34;
                const timeHours = activity.moving_time / 3600;
                const speed = distanceMiles / timeHours;

                if (!weeklyData[weekKey]) {
                    weeklyData[weekKey] = {
                        date: weekKey,
                        totalSpeed: 0,
                        count: 0,
                        hasData: true
                    };
                }
                weeklyData[weekKey].totalSpeed += speed;
                weeklyData[weekKey].count += 1;
            });

            // Fill missing weeks
            this.fillMissingWeeks(weeklyData, sortedActivities);

            // Check if data spans multiple years
            const sortedWeeks = Object.values(weeklyData).sort((a, b) => new Date(a.date) - new Date(b.date));
            const firstYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[0].date).getFullYear() : null;
            const lastYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[sortedWeeks.length - 1].date).getFullYear() : null;
            const spansMultipleYears = firstYear !== lastYear;

            return sortedWeeks.map(week => ({
                date: new Date(week.date).toLocaleDateString('en-US', 
                    spansMultipleYears 
                        ? { month: 'short', day: 'numeric', year: 'numeric' }
                        : { month: 'short', day: 'numeric' }
                ),
                value: week.hasData ? parseFloat((week.totalSpeed / week.count).toFixed(2)) : null
            }));
        } else {
            // For running and other sports, show pace in min/mile (as decimal)
            const weeklyData = {};
            sortedActivities.forEach(activity => {
                const date = new Date(activity.start_date_local);
                // Get the start of the week (Monday)
                const dayOfWeek = date.getDay();
                const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - daysToMonday);
                weekStart.setHours(0, 0, 0, 0);
                const weekKey = weekStart.toISOString().split('T')[0];

                const distanceMiles = activity.distance / 1609.34;
                const timeMinutes = activity.moving_time / 60;
                const pace = timeMinutes / distanceMiles;

                if (!weeklyData[weekKey]) {
                    weeklyData[weekKey] = {
                        date: weekKey,
                        totalPace: 0,
                        count: 0,
                        hasData: true
                    };
                }
                weeklyData[weekKey].totalPace += pace;
                weeklyData[weekKey].count += 1;
            });

            // Fill missing weeks
            this.fillMissingWeeks(weeklyData, sortedActivities);

            // Check if data spans multiple years
            const sortedWeeks = Object.values(weeklyData).sort((a, b) => new Date(a.date) - new Date(b.date));
            const firstYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[0].date).getFullYear() : null;
            const lastYear = sortedWeeks.length > 0 ? new Date(sortedWeeks[sortedWeeks.length - 1].date).getFullYear() : null;
            const spansMultipleYears = firstYear !== lastYear;

            return sortedWeeks.map(week => ({
                date: new Date(week.date).toLocaleDateString('en-US', 
                    spansMultipleYears 
                        ? { month: 'short', day: 'numeric', year: 'numeric' }
                        : { month: 'short', day: 'numeric' }
                ),
                value: week.hasData ? parseFloat((week.totalPace / week.count).toFixed(2)) : null
            }));
        }
    };

    // Custom tooltip for pace/speed
    CustomPaceTooltip = ({ active, payload, label, sport }) => {
        if (active && payload && payload.length) {
            const value = payload[0].value;
            
            // Handle null values (weeks with no data)
            if (value === null || value === undefined) {
                return (
                    <div style={{ backgroundColor: '#1e2a3a', padding: '10px', border: '1px solid #635ee7', borderRadius: '4px' }}>
                        <p style={{ color: '#c0c8d0', margin: 0 }}>{`Week of ${label}`}</p>
                        <p style={{ color: '#635ee7', margin: '5px 0 0 0', fontWeight: 'bold' }}>No activities</p>
                    </div>
                );
            }
            
            let displayValue;

            if (sport === 'swim') {
                const mins = Math.floor(value);
                const secs = Math.round((value - mins) * 60);
                displayValue = `${mins}:${secs.toString().padStart(2, '0')} /100y`;
            } else if (sport === 'ride') {
                displayValue = `${value.toFixed(2)} mph`;
            } else {
                const mins = Math.floor(value);
                const secs = Math.round((value - mins) * 60);
                displayValue = `${mins}:${secs.toString().padStart(2, '0')} /mile`;
            }

            return (
                <div style={{ backgroundColor: '#1e2a3a', padding: '10px', border: '1px solid #635ee7', borderRadius: '4px' }}>
                    <p style={{ color: '#c0c8d0', margin: 0 }}>{`Week of ${label}`}</p>
                    <p style={{ color: '#635ee7', margin: '5px 0 0 0', fontWeight: 'bold' }}>{displayValue}</p>
                </div>
            );
        }
        return null;
    };

    render() {
        const { activities, sport } = this.props;

        if (!activities || activities.length === 0) {
            return (
                <div style={{ color: '#c0c8d0', textAlign: 'center', padding: '20px' }}>
                    No activity data available for visualization
                </div>
            );
        }

        const distanceData = this.processDistanceOverTime(activities);
        const frequencyData = this.processActivityFrequency(activities);
        const paceData = this.processPaceProgression(activities, sport);

        // Determine labels based on sport
        let performanceLabel = 'Average Pace (min/mi)';
        if (sport === 'swim') {
            performanceLabel = 'Average Pace (/100y)';
        } else if (sport === 'ride') {
            performanceLabel = 'Average Speed (mph)';
        }

        return (
            <div className='graphs-container' style={{ marginTop: '20px', width: '100%', maxWidth: '1400px' }}>
                {sport === 'allSports' && (
                    <div style={{ 
                        backgroundColor: 'rgba(252, 76, 2, 0.1)', 
                        border: '1px solid #FC4C02', 
                        borderRadius: '8px', 
                        padding: '15px', 
                        marginBottom: '20px',
                        color: '#c0c8d0',
                        marginLeft: '10px',
                        marginRight: '10px'
                    }}>
                        <strong style={{ color: '#FC4C02' }}>Note:</strong> Pace results for "All Sports" combine different activity types (running, cycling, swimming, etc.) and may show unusual patterns since each sport has different pace/speed metrics.
                    </div>
                )}
                
                <div style={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    marginBottom: '20px',
                    justifyContent: 'space-between',
                    padding: '0 10px'
                }}>
                    {/* Distance Over Time */}
                    {distanceData.length > 0 && (
                        <div className='graph-card' style={{ 
                            backgroundColor: 'rgba(30, 42, 58, 0.5)', 
                            padding: '20px', 
                            borderRadius: '8px',
                            border: '1px solid #2a3f5f',
                            flex: this.state.expandedGraphs.distance ? '1 1 100%' : '1 1 calc(33.333% - 14px)',
                            minWidth: window.innerWidth < 768 ? '100%' : '350px',
                            position: 'relative'
                        }}>
                            <button
                                onClick={() => this.toggleGraphExpansion('distance')}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(99, 94, 231, 0.2)',
                                    border: '1px solid #635ee7',
                                    borderRadius: '4px',
                                    color: '#635ee7',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(99, 94, 231, 0.4)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(99, 94, 231, 0.2)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                                title={this.state.expandedGraphs.distance ? 'Shrink graph' : 'Expand graph'}
                            >
                                {this.state.expandedGraphs.distance ? <MdZoomInMap size={20} /> : <MdZoomOutMap size={20} />}
                            </button>
                            <h3 style={{ color: '#c0c8d0', textAlign: 'center', marginBottom: '15px', paddingRight: '40px', fontSize: window.innerWidth < 768 ? '1.2rem' : '1.5rem' }}>
                                Distance Over Time
                            </h3>
                            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                                <LineChart data={distanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#c0c8d0" 
                                        tick={{ fill: '#c0c8d0', fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis 
                                        stroke="#c0c8d0" 
                                        tick={{ fill: '#c0c8d0', fontSize: 12 }}
                                        label={{ value: sport === 'swim' ? 'Yards' : 'Miles', angle: -90, position: 'insideLeft', fill: '#c0c8d0' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e2a3a', border: '1px solid #635ee7' }}
                                        labelStyle={{ color: '#c0c8d0' }}
                                        itemStyle={{ color: '#635ee7' }}
                                    />
                                    <Legend wrapperStyle={{ color: '#c0c8d0' }} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="distance" 
                                        stroke="#635ee7" 
                                        strokeWidth={2}
                                        dot={{ fill: '#635ee7', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name={sport === 'swim' ? 'Weekly Yards' : 'Weekly Miles'}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Activity Frequency */}
                    {frequencyData.length > 0 && (
                        <div className='graph-card' style={{ 
                            backgroundColor: 'rgba(30, 42, 58, 0.5)', 
                            padding: '20px', 
                            borderRadius: '8px',
                            border: '1px solid #2a3f5f',
                            flex: this.state.expandedGraphs.frequency ? '1 1 100%' : '1 1 calc(33.333% - 14px)',
                            minWidth: window.innerWidth < 768 ? '100%' : '350px',
                            position: 'relative'
                        }}>
                            <button
                                onClick={() => this.toggleGraphExpansion('frequency')}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(252, 76, 2, 0.2)',
                                    border: '1px solid #FC4C02',
                                    borderRadius: '4px',
                                    color: '#FC4C02',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(252, 76, 2, 0.4)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(252, 76, 2, 0.2)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                                title={this.state.expandedGraphs.frequency ? 'Shrink graph' : 'Expand graph'}
                            >
                                {this.state.expandedGraphs.frequency ? <MdZoomInMap size={20} /> : <MdZoomOutMap size={20} />}
                            </button>
                            <h3 style={{ color: '#c0c8d0', textAlign: 'center', marginBottom: '15px', paddingRight: '40px', fontSize: window.innerWidth < 768 ? '1.2rem' : '1.5rem' }}>
                                Activity Frequency
                            </h3>
                            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                                <BarChart data={frequencyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                                    <XAxis 
                                        dataKey="week" 
                                        stroke="#c0c8d0" 
                                        tick={{ fill: '#c0c8d0', fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis 
                                        stroke="#c0c8d0" 
                                        tick={{ fill: '#c0c8d0', fontSize: 12 }}
                                        label={{ value: 'Activities', angle: -90, position: 'insideLeft', fill: '#c0c8d0' }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e2a3a', border: '1px solid #635ee7' }}
                                        labelStyle={{ color: '#c0c8d0' }}
                                        itemStyle={{ color: '#FC4C02' }}
                                    />
                                    <Legend wrapperStyle={{ color: '#c0c8d0' }} />
                                    <Bar 
                                        dataKey="activities" 
                                        fill="#FC4C02" 
                                        name="Weekly Activities"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Pace/Speed Progression */}
                    {paceData.length > 0 && (
                        <div className='graph-card' style={{ 
                            backgroundColor: 'rgba(30, 42, 58, 0.5)', 
                            padding: '20px', 
                            borderRadius: '8px',
                            border: '1px solid #2a3f5f',
                            flex: this.state.expandedGraphs.pace ? '1 1 100%' : '1 1 calc(33.333% - 14px)',
                            minWidth: window.innerWidth < 768 ? '100%' : '350px',
                            position: 'relative'
                        }}>
                            <button
                                onClick={() => this.toggleGraphExpansion('pace')}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(0, 212, 170, 0.2)',
                                    border: '1px solid #00d4aa',
                                    borderRadius: '4px',
                                    color: '#00d4aa',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 212, 170, 0.4)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 212, 170, 0.2)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                                title={this.state.expandedGraphs.pace ? 'Shrink graph' : 'Expand graph'}
                            >
                                {this.state.expandedGraphs.pace ? <MdZoomInMap size={20} /> : <MdZoomOutMap size={20} />}
                            </button>
                            <h3 style={{ color: '#c0c8d0', textAlign: 'center', marginBottom: '15px', paddingRight: '40px', fontSize: window.innerWidth < 768 ? '1.2rem' : '1.5rem' }}>
                                {performanceLabel} Over Time
                            </h3>
                            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                                <LineChart data={paceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#c0c8d0" 
                                        tick={{ fill: '#c0c8d0', fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis 
                                        stroke="#c0c8d0" 
                                        tick={{ fill: '#c0c8d0', fontSize: 12 }}
                                        label={{ 
                                            value: sport === 'ride' ? 'Speed (mph)' : 'Pace (min)', 
                                            angle: -90, 
                                            position: 'insideLeft', 
                                            fill: '#c0c8d0' 
                                        }}
                                    />
                                    <Tooltip 
                                        content={<this.CustomPaceTooltip sport={sport} />}
                                    />
                                    <Legend wrapperStyle={{ color: '#c0c8d0' }} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#00d4aa" 
                                        strokeWidth={2}
                                        dot={{ fill: '#00d4aa', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name={performanceLabel}
                                        connectNulls={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Graphs;

