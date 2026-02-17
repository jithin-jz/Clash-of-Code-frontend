import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GameRedirectPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/');
    }, [navigate]);
    return null;
};

export default GameRedirectPage;
