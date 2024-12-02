import React from "react";
import { useNavigate } from "react-router-dom";

export const Play: React.FC = () => {
    const nav = useNavigate();

    return (
        <div>
            <h1 className="text-xl font-bold mb-3">Play</h1>
            <button
                className="btn btn-success mb-3"
                onClick={() => nav(-2)}
            >
                Game Over
            </button>
        </div>
    );
};
