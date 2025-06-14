import type React from 'react';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 md:px-8 py-16">

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold text-zinc-400 mb-6 leading-tight">
                    What Game Today?
                </h1>

                <p className="text-xl md:text-lg+15 text-gray-600 mb-8 max-w-3xl mx-auto">
                    Your go-to resource for Blender tutorials, tips, and guides. Master the art of 3D.
                </p>
            </div>
        </section>
    );
};
