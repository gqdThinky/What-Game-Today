import type React from 'react';
import GlowingButton from "./Buttons.tsx";
import { motion } from "framer-motion";

export const HeroSection: React.FC = () => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 py-16 overflow-hidden"
        >
            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto text-center">
                {/* Main Heading */}
                <div className="space-y-6 mb-8">
                    <h1 className="opacity-80 text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 leading-none tracking-tight animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 drop-shadow-2xl">
                        What Game
                        <span className="opacity-85 block text-5xl md:text-7xl lg:text-8xl mt-2 font-light italic text-blue-200 drop-shadow-lg">
                            Today?
                        </span>
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 delay-300">
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-400 opacity-75 font-medium max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                        Discover your next favorite game in seconds.
                    </p>
                </div>

                {/* Button */}
                <div className="mt-8">
                    <GlowingButton />
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-30 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-tl from-purple-500/20 to-pink-500/20 opacity-25 blur-3xl animate-pulse delay-1000"></div>

            {/* Floating Animation Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce delay-0 shadow-lg"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-70 animate-bounce delay-500 shadow-lg"></div>
                <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50 animate-bounce delay-1000 shadow-lg"></div>
            </div>

            {/* Text Glow Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            </div>
        </motion.section>
    );
};