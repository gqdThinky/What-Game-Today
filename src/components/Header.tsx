import type React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="w-full py-6 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <a href="/" className="flex items-center space-x-2">
                        <h2 className="text-xl font-bold text-zinc-400">What Game Today</h2>
                    </a>
                </div>

                <nav className="hidden md:flex">
                    <ul className="flex space-x-8">
                        <li>
                            <a
                                href="/"
                                className="text-zinc-400 hover:text-gray-600 transition-colors duration-200 border-b border-blender-beige"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="/tutorials"
                                className="text-zinc-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                Placeholder1
                            </a>
                        </li>
                        <li>
                            <a
                                href="/tips"
                                className="text-zinc-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                Placeholder2
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};
