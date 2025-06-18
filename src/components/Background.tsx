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
    backgroundImage?: string;
    dotColor?: string; // Couleur des dots
}

export const BackgroundDots: React.FC<BackgroundDotsProps> = ({
                                                                  numberOfDots = 60,
                                                                  backgroundImage,
                                                                  dotColor = 'rgb(251, 191, 36)', // amber-400 par défaut
                                                              }) => {
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
    }, [numberOfDots]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none animated-dots-container">
            {/* Background image (dots) */}
            {backgroundImage && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            )}

            {/* Animated dots */}
            {dots.map((dot) => (
                <div
                    key={dot.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${dot.x}%`,
                        top: `${dot.y}%`,
                        width: `${dot.size}px`,
                        height: `${dot.size}px`,
                        backgroundColor: dotColor,
                        opacity: dot.opacity,
                        transform: "translate(-50%, -50%)",
                        transition: "all 0.08s ease-out",
                        filter: "blur(0.5px)",
                    }}
                />
            ))}
        </div>
    );
};