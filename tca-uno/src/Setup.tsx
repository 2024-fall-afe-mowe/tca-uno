import React from "react";
import { useNavigate } from "react-router-dom";

export const Setup: React.FC = () => {
    const nav = useNavigate();

    return (
        <div>
            <h1 className="text-xl font-bold mb-3">Setup</h1>
            <button
                className="btn btn-success mb-3"
                onClick={() => nav("/play")}
            >
                Start Playing
            </button>
        </div>
    );
};
