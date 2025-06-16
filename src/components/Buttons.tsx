import React from 'react';

const GlowingButton: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <button
                className="
          relative
          px-8 py-4
          bg-orange-500
          text-white
          font-bold
          text-lg
          rounded-lg
          transition-all
          duration-300
          ease-in-out
          hover:bg-orange-400
          hover:scale-105
          focus:outline-none
          focus:ring-4
          focus:ring-orange-300
          shadow-[0_0_20px_rgba(249,115,22,0.6),0_0_40px_rgba(249,115,22,0.4),0_0_60px_rgba(249,115,22,0.2)]
          hover:shadow-[0_0_30px_rgba(249,115,22,0.8),0_0_60px_rgba(249,115,22,0.6),0_0_90px_rgba(249,115,22,0.4)]
          animate-pulse
        "
            >
                <span className="relative z-10">Get Started</span>

                <div className="
          absolute
          inset-0
          bg-orange-500
          rounded-lg
          blur-xl
          opacity-50
          -z-10
          animate-pulse
        "></div>
            </button>
        </div>
    );
};

export default GlowingButton;