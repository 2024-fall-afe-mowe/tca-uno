// src/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const nav = useNavigate();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-3">Home</h1>
            <button
                className="btn btn-primary mb-3"
                onClick={() => nav('/setup')}
            >
                Play
            </button>
            <button
                className="btn btn-secondary mb-3"
                onClick={() => nav('/results')}
            >
                View Game Results
            </button>
        </div>
    );
};
