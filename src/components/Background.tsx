import React from 'react';

interface Dot {
    id: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
}

interface BackgroundDotsProps {
    numberOfDots?: number;
}

export const BackgroundDots: React.FC<BackgroundDotsProps> = ({ numberOfDots = 60 }) => {
    const [dots, setDots] = React.useState<Dot[]>([]);

    React.useEffect(() => {
        const generateDots = () => {
            const newDots: Dot[] = [];

            for (let i = 0; i < numberOfDots; i++) {
                newDots.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.4 + 0.1,
                });
            }
            setDots(newDots);
        };

        generateDots();

        const animateDots = () => {
            setDots((prevDots) =>
                prevDots.map((dot) => ({
                    ...dot,
                    x: (dot.x + dot.speedX + 100) % 100,
                    y: (dot.y + dot.speedY + 100) % 100,
                }))
            );
        };

        const intervalId = setInterval(animateDots, 80);
        return () => clearInterval(intervalId);
    }, [numberOfDots]); // Ajout de numberOfDots comme dépendance

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none animated-dots-container">
            {dots.map((dot) => (
                <div
                    key={dot.id}
                    className="absolute rounded-full bg-amber-200"
                    style={{
                        left: `${dot.x}%`,
                        top: `${dot.y}%`,
                        width: `${dot.size}px`,
                        height: `${dot.size}px`,
                        opacity: dot.opacity,
                        transform: "translate(-50%, -50%)",
                        transition: "all 0.08s ease-out",
                        filter: "blur(0.5px)",
                        boxShadow: "0 0 2px rgba(201, 194, 170, 0.3)",
                    }}
                />
            ))}
        </div>
    );
};