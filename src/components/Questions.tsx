import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuestionnaireAnswers {
    gameType: string;
    duration: string;
    platform: string;
    mood: string;
    multiplayer: boolean;
    genre: string;
    difficulty: string;
}

const Questions: React.FC = () => {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<QuestionnaireAnswers>({
        gameType: '',
        duration: '',
        platform: '',
        mood: '',
        multiplayer: false,
        genre: '',
        difficulty: ''
    });

    const questions = [
        {
            id: 'gameType',
            question: 'Quel type de jeu préférez-vous ?',
            options: [
                { value: 'action', label: '🎯 Action/Aventure' },
                { value: 'strategy', label: '🧠 Stratégie' },
                { value: 'puzzle', label: '🧩 Puzzle/Réflexion' },
                { value: 'rpg', label: '⚔️ RPG/Roleplay' },
                { value: 'simulation', label: '🏗️ Simulation' },
                { value: 'sports', label: '⚽ Sport' }
            ]
        },
        {
            id: 'duration',
            question: 'Combien de temps voulez-vous jouer ?',
            options: [
                { value: 'quick', label: '⚡ Session rapide (15-30 min)' },
                { value: 'medium', label: '⏰ Session moyenne (1-2h)' },
                { value: 'long', label: '🕰️ Session longue (2h+)' },
                { value: 'unlimited', label: '♾️ Pas de limite de temps' }
            ]
        },
        {
            id: 'platform',
            question: 'Sur quelle plateforme souhaitez-vous jouer ?',
            options: [
                { value: 'pc', label: '💻 PC' },
                { value: 'console', label: '🎮 Console' },
                { value: 'mobile', label: '📱 Mobile' },
                { value: 'browser', label: '🌐 Navigateur' }
            ]
        },
        {
            id: 'mood',
            question: "Quelle est votre humeur aujourd'hui ?",
            options: [
                { value: 'relaxed', label: '😌 Détendu et zen' },
                { value: 'competitive', label: '🔥 Compétitif' },
                { value: 'creative', label: '🎨 Créatif' },
                { value: 'adventure', label: '🗺️ Aventurier' },
                { value: 'social', label: '👥 Social' }
            ]
        },
        {
            id: 'multiplayer',
            question: 'Préférez-vous jouer seul ou avec d\'autres ?',
            options: [
                { value: true, label: '👫 Multijoueur' },
                { value: false, label: '🧑‍💼 Solo' }
            ]
        },
        {
            id: 'genre',
            question: 'Quel genre vous attire le plus ?',
            options: [
                { value: 'fantasy', label: '🐉 Fantastique' },
                { value: 'scifi', label: '🚀 Science-fiction' },
                { value: 'realistic', label: '🌍 Réaliste' },
                { value: 'cartoon', label: '🎭 Cartoon/Stylisé' },
                { value: 'horror', label: '👻 Horreur/Thriller' }
            ]
        },
        {
            id: 'difficulty',
            question: 'Quel niveau de difficulté recherchez-vous ?',
            options: [
                { value: 'easy', label: '🟢 Facile et relaxant' },
                { value: 'medium', label: '🟡 Modéré' },
                { value: 'hard', label: '🔴 Difficile et challengeant' },
                { value: 'variable', label: '⚙️ Difficulté ajustable' }
            ]
        }
    ];

    const handleAnswer = (value: string | boolean) => {
        const questionId = questions[currentQuestion].id as keyof QuestionnaireAnswers;
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            // Questionnaire terminé - redirection vers les résultats
            navigate('/results', { state: { answers } });
        }
    };

    const goBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        } else {
            navigate('/');
        }
    };

    const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 py-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-30 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-tl from-purple-500/20 to-pink-500/20 opacity-25 blur-3xl animate-pulse delay-1000"></div>

            {/* Progress Bar */}
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-full h-3 mx-6">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">
                    Question {currentQuestion + 1} sur {questions.length}
                </p>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center animate-in fade-in-0 slide-in-from-bottom-8 duration-700">
                {/* Question */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 leading-tight tracking-tight drop-shadow-2xl mb-6">
                        {questions[currentQuestion].question}
                    </h1>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
                    {questions[currentQuestion].options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option.value)}
                            className="
                                relative
                                p-6
                                bg-gray-800/70
                                backdrop-blur-sm
                                text-white
                                font-semibold
                                text-lg
                                rounded-xl
                                border
                                border-gray-600/50
                                transition-all
                                duration-300
                                ease-in-out
                                hover:bg-gray-700/80
                                hover:border-blue-400/50
                                hover:scale-105
                                hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]
                                focus:outline-none
                                focus:ring-4
                                focus:ring-blue-300/30
                                group
                                animate-in
                                fade-in-0
                                slide-in-from-bottom-4
                                duration-500
                            "
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animationFillMode: 'both'
                            }}
                        >
                            <span className="relative z-10 block text-left">
                                {option.label}
                            </span>
                            <div className="
                                absolute
                                inset-0
                                bg-gradient-to-r
                                from-blue-500/20
                                to-purple-500/20
                                rounded-xl
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity
                                duration-300
                                -z-10
                            "></div>
                        </button>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={goBack}
                        className="
                            px-6 py-3
                            bg-gray-700/70
                            backdrop-blur-sm
                            text-gray-300
                            font-medium
                            rounded-lg
                            border
                            border-gray-600/50
                            transition-all
                            duration-300
                            hover:bg-gray-600/80
                            hover:text-white
                            focus:outline-none
                            focus:ring-4
                            focus:ring-gray-400/30
                        "
                    >
                        {currentQuestion === 0 ? '← Retour' : '← Précédent'}
                    </button>
                </div>
            </div>

            {/* Floating Animation Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce delay-0 shadow-lg"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-70 animate-bounce delay-500 shadow-lg"></div>
                <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50 animate-bounce delay-1000 shadow-lg"></div>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            </div>
        </section>
    );
};

export default Questions;