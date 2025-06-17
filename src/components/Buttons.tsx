import React from 'react';
import { useNavigate } from 'react-router-dom';

const GlowingButton: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/questionnaire');
    };

    return (
        <div className="flex items-center justify-center mt-12">
            <button
                onClick={handleClick}
                className="
                    relative
                    px-8 py-4
                    bg-gray-700
                    text-white
                    font-bold
                    text-lg
                    rounded-lg
                    transition-all
                    duration-300
                    ease-in-out
                    hover:bg-gray-800
                    hover:scale-105
                    focus:outline-none
                    focus:ring-4
                    focus:ring-gray-300
                    shadow-[0_0_20px_rgba(128,128,128,0.6),0_0_40px_rgba(128,128,128,0.4),0_0_60px_rgba(128,128,128,0.2)]
                    hover:shadow-[0_0_30px_rgba(128,128,128,0.8),0_0_60px_rgba(128,128,128,0.6),0_0_90px_rgba(128,128,128,0.4)]
                    animate-pulse
                "
            >
                <span className="relative z-10">Get Started</span>
                <div className="
                    absolute
                    inset-0
                    bg-gray-500
                    rounded-lg
                    blur-lg
                    opacity-50
                    -z-10
                    animate-pulse
                "></div>
            </button>
        </div>
    );
};

export default GlowingButton;