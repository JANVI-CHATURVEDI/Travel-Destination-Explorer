import React from 'react';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <>
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        
        <div className="landing min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
            style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1719580077391-3869e72237d3?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                )`
            }}>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center drop-shadow-lg tracking-wide">
                🌍 Discover the World Like Never Before
            </h1>

            <p className="text-lg md:text-2xl mb-8 max-w-2xl text-center drop-shadow-md leading-relaxed text-white/90">
                Plan your perfect adventure — filter by vibe, budget, or bucket list. Your journey starts here.
            </p>

            <button
                className="bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 hover:from-green-600 hover:to-lime-400 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:scale-105  z-20"
                onClick={() => navigate('/explore')}
                >
                🚀 Start Exploring
            </button>
        </div>
                </>
    );
};

export default LandingPage;
