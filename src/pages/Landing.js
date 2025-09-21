import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { ClipLoader } from 'react-spinners';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Navigate, useNavigate } from 'react-router-dom';
import AuthProvider, { AuthContext } from '../AuthContext';

const Landing = ({ logout }) => {
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [enterBothWarning, setEnterBothWarning] = useState(false);
    const [dateOrderWarning, setDateOrderWarning] = useState(false);
    const [redirectToResults, setRedirectToResults] = useState(false);
    const [redirectToNeedLogin, setRedirectToNeedLogin] = useState(false);

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Auth context changed:", authContext);
        setLoading(false)
    }, [authContext]); // context changes

    const handleSetEndDate = (date) => {
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        setEndDate(endOfDay);
    };

    const handleSetFromPreset = (dates) => {
        setStartDate(dates[0]);
        handleSetEndDate(dates[1]);
    };

    const handleContinue = () => {
        if (!startDate || !endDate) {
            setEnterBothWarning(true);
            setDateOrderWarning(false);
            console.log('WARNING: enter both dates');
        } else if (startDate >= endDate) {
            setEnterBothWarning(false);
            setDateOrderWarning(true);
            console.log('WARNING: bad date order');
        } else {
            console.log('both entered');
            localStorage.setItem('startDate', startDate);
            localStorage.setItem('endDate', endDate);
            setRedirectToResults(true);
        }
    };

    if (redirectToResults) {
        // The original component had an `updateToken` call here. This might be a side effect
        // that's better handled elsewhere, but for a direct conversion, we can
        // call it before the return or within a useEffect with a dependency on redirectToResults
        // or simply remove it if it's no longer necessary.
        return <Navigate to="/results" />;
    }

    if (redirectToNeedLogin) {
        return <Navigate to="/needlogin" />;
    }

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
    const janFirst2000 = new Date(2000, 0, 1);

    const presets = {
        'Year-to-date': [startOfYear, now],
        '3 months': [new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()), now],
        '6 months': [new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()), now],
        '12 months': [new Date(now.getFullYear(), now.getMonth() - 12, now.getDate()), now],
        'Last year': [startOfLastYear, endOfLastYear],
        'All time': [janFirst2000, now]
    };

    return (
        <div className="landing-page">
            {loading ? (
                <div className="spinner-container">
                    <ClipLoader color="#3498db" loading={loading} size={60} />
                    <p style={{ color: '#ffffff' }}>Validating login...</p>
                </div>
            ) : (
                <div className='picker-container'>
                    <p>Choose dates to calculate summary statistics. </p>
                    <p>Either choose a preset, enter as MM/DD/YYYY or select from the pickers</p>
                    <p>Presets:</p>
                    <div className='presets-container'>
                        {Object.entries(presets).map(([key, value]) => (
                            <Button className='preset' onClick={() => handleSetFromPreset(value)} key={key}>
                                {key}
                            </Button>
                        ))}
                    </div>
                    <p style={{ marginBottom: 5 }}>Start Date:</p>
                    <DatePicker placeholderText='MM/DD/YYYY' selected={startDate} onChange={(date) => setStartDate(date)} value={startDate} selectsStart startDate={startDate} endDate={endDate} maxDate={new Date()} />
                    {startDate && (
                        <div>
                            <p style={{ marginBottom: 5 }}>End Date:</p>
                            <DatePicker placeholderText='MM/DD/YYYY' selected={endDate} onChange={handleSetEndDate} value={endDate} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} maxDate={new Date()} />
                        </div>
                    )}
                    {enterBothWarning && (
                        <div style={{ color: '#B3BAA0' }}><p>Enter both start and end dates</p></div>
                    )}
                    {dateOrderWarning && (
                        <div style={{ color: '#B3BAA0' }}><p>End date must be at least 1 day after start date</p></div>
                    )}
                    {(startDate && endDate) && (
                        <Button className='logout' onClick={handleContinue}>Continue</Button>
                    )}
                    <Button className='logout' onClick={logout}>Log out</Button>
                </div>
            )}
        </div>
    );
};

export default Landing;