import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AnswerOption {
    value: string;
    label: string;
    weight: number;
}

interface Question {
    questionId: string;
    questionText: string;
    questionType: string;
    answerOptions: AnswerOption[];
    importance: string;
    category: string;
    branchingLogic: string | null;
}

interface QuestionnaireAnswers {
    [key: string]: string | string[];
}

const Questionnaire: React.FC = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
    const [questionHistory, setQuestionHistory] = useState<number[]>([0]);
    const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);

    const allQuestions: Question[] = [
        {
            "questionId": "gaming_experience",
            "questionText": "How would you describe your gaming experience?",
            "questionType": "single_choice",
            "answerOptions": [
                {"value": "beginner", "label": "🌱 New to gaming", "weight": 1},
                {"value": "casual", "label": "🎮 Casual player", "weight": 2},
                {"value": "experienced", "label": "🏆 Experienced gamer", "weight": 3},
                {"value": "expert", "label": "🎯 Gaming enthusiast", "weight": 4}
            ],
            "importance": "high",
            "category": "experience_level",
            "branchingLogic": "if beginner -> show simplified genre questions"
        },
        {
            "questionId": "session_length",
            "questionText": "How much time do you usually have for a gaming session?",
            "questionType": "single_choice",
            "answerOptions": [
                {"value": "short", "label": "⏰ 15-30 minutes", "weight": 1},
                {"value": "medium", "label": "🕒 1-2 hours", "weight": 2},
                {"value": "long", "label": "🕔 3+ hours", "weight": 3},
                {"value": "unlimited", "label": "♾️ No time limit", "weight": 4}
            ],
            "importance": "high",
            "category": "time_availability",
            "branchingLogic": "if short -> prioritize short games"
        },
        {
            "questionId": "gaming_frequency",
            "questionText": "How often do you play games?",
            "questionType": "single_choice",
            "answerOptions": [
                {"value": "rare", "label": "🌙 Once in a while", "weight": 1},
                {"value": "weekly", "label": "📅 A few times a week", "weight": 2},
                {"value": "daily", "label": "☀️ Daily", "weight": 3}
            ],
            "importance": "medium",
            "category": "time_availability",
            "branchingLogic": null
        },
        {
            "questionId": "platform_preference",
            "questionText": "Which platform do you prefer to play games on?",
            "questionType": "multiple_choice",
            "answerOptions": [
                {"value": "pc", "label": "💻 PC", "weight": 1},
                {"value": "console", "label": "🎮 Console (PlayStation, Xbox, Nintendo)", "weight": 1},
                {"value": "mobile", "label": "📱 Mobile", "weight": 1},
                {"value": "browser", "label": "🌐 Browser-based", "weight": 1}
            ],
            "importance": "high",
            "category": "platform_preferences",
            "branchingLogic": "if console -> ask console_type"
        },
        {
            "questionId": "console_type",
            "questionText": "Which console do you use?",
            "questionType": "multiple_choice",
            "answerOptions": [
                {"value": "playstation", "label": "🎮 PlayStation", "weight": 1},
                {"value": "xbox", "label": "🎮 Xbox", "weight": 1},
                {"value": "nintendo", "label": "🎮 Nintendo Switch", "weight": 1}
            ],
            "importance": "medium",
            "category": "platform_preferences",
            "branchingLogic": null
        },
        {
            "questionId": "favorite_genre",
            "questionText": "What type of game do you enjoy most?",
            "questionType": "multiple_choice",
            "answerOptions": [
                {"value": "action", "label": "⚡ Action/Adventure", "weight": 1},
                {"value": "rpg", "label": "🗡️ Role-Playing (RPG)", "weight": 1},
                {"value": "strategy", "label": "♟️ Strategy", "weight": 1},
                {"value": "puzzle", "label": "🧩 Puzzle", "weight": 1},
                {"value": "simulation", "label": "🏡 Simulation", "weight": 1},
                {"value": "sports", "label": "⚽ Sports", "weight": 1}
            ],
            "importance": "high",
            "category": "genre_preferences",
            "branchingLogic": null
        },
        {
            "questionId": "avoid_genre",
            "questionText": "Are there any game types you'd prefer to avoid?",
            "questionType": "multiple_choice",
            "answerOptions": [
                {"value": "horror", "label": "😱 Horror", "weight": 1},
                {"value": "racing", "label": "🏎️ Racing", "weight": 1},
                {"value": "fighting", "label": "🥊 Fighting", "weight": 1},
                {"value": "none", "label": "✅ None, I'm open to all", "weight": 0}
            ],
            "importance": "high",
            "category": "genre_preferences",
            "branchingLogic": null
        },
        {
            "questionId": "gameplay_style",
            "questionText": "Do you prefer playing alone or with others?",
            "questionType": "single_choice",
            "answerOptions": [
                {"value": "solo", "label": "🧑 Solo", "weight": 1},
                {"value": "coop", "label": "🤝 Cooperative with friends", "weight": 2},
                {"value": "competitive", "label": "🏅 Competitive multiplayer", "weight": 3}
            ],
            "importance": "high",
            "category": "gameplay_style",
            "branchingLogic": "if coop or competitive -> ask social_aspects"
        },
        {
            "questionId": "current_mood",
            "questionText": "How are you feeling right now?",
            "questionType": "single_choice",
            "answerOptions": [
                {"value": "relaxed", "label": "😌 Relaxed", "weight": 1},
                {"value": "energetic", "label": "⚡ Energetic", "weight": 2},
                {"value": "stressed", "label": "😓 Stressed", "weight": 3},
                {"value": "bored", "label": "😴 Bored", "weight": 4}
            ],
            "importance": "medium",
            "category": "mood_context",
            "branchingLogic": "if stressed or bored -> prioritize relaxing games"
        },
        {
            "questionId": "difficulty_preference",
            "questionText": "What level of challenge do you enjoy in games?",
            "questionType": "single_choice",
            "answerOptions": [
                {"value": "easy", "label": "😊 Easy and relaxing", "weight": 1},
                {"value": "moderate", "label": "🤔 Moderate challenge", "weight": 2},
                {"value": "hard", "label": "🔥 Tough but fair", "weight": 3},
                {"value": "extreme", "label": "💪 Very difficult", "weight": 4}
            ],
            "importance": "high",
            "category": "difficulty_challenge",
            "branchingLogic": null
        },
        {
            "questionId": "art_style",
            "questionText": "What visual style do you prefer in games?",
            "questionType": "multiple_choice",
            "answerOptions": [
                {"value": "realistic", "label": "🌍 Realistic", "weight": 1},
                {"value": "cartoon", "label": "🎨 Cartoon/Animated", "weight": 1},
                {"value": "pixel", "label": "🖼️ Pixel art", "weight": 1},
                {"value": "minimalist", "label": "🔲 Minimalist", "weight": 1}
            ],
            "importance": "medium",
            "category": "visual_audio",
            "branchingLogic": null
        },
        {
            "questionId": "setting_preference",
            "questionText": "What game world setting excites you most?",
            "questionType": "multiple_choice",
            "answerOptions": [
                {"value": "fantasy", "label": "🧙‍♂️ Fantasy", "weight": 1},
                {"value": "scifi", "label": "🚀 Sci-Fi", "weight": 1},
                {"value": "modern", "label": "🏙️ Modern", "weight": 1},
                {"value": "historical", "label": "🏰 Historical", "weight": 1}
            ],
            "importance": "medium",
            "category": "visual_audio",
            "branchingLogic": null
        },
        {
            "questionId": "game_length",
            "questionText": "How long do you prefer your games to be?",
            "questionType": "single_choice",
            "answerOptions": [
                {"value": "short", "label": "⏱️ Short (1-5 hours)", "weight": 1},
                {"value": "medium", "label": "🕒 Medium (5-20 hours)", "weight": 2},
                {"value": "long", "label": "🕰️ Long (20+ hours)", "weight": 3}
            ],
            "importance": "high",
            "category": "game_length",
            "branchingLogic": null
        },
    ];

    useEffect(() => {
        const initialQuestions = allQuestions.filter(q => q.importance === 'high');
        const mediumQuestions = allQuestions.filter(q => q.importance === 'medium');

        const combinedQuestions = Array.from(new Set([...initialQuestions, ...mediumQuestions]));
        setAvailableQuestions(combinedQuestions);
    }, []);

    const shouldShowQuestion = (questionId: string): boolean => {
        const platformAnswer = answers.platform_preference;

        // Show console_type only if console is selected
        if (questionId === 'console_type') {
            return Array.isArray(platformAnswer) ? platformAnswer.includes('console') : platformAnswer === 'console';
        }

        return true;
    };

    const getNextQuestionIndex = (): number => {
        let nextIndex = currentQuestionIndex + 1;

        // Skip questions based on branching logic
        while (nextIndex < availableQuestions.length) {
            const nextQuestion = availableQuestions[nextIndex];
            if (shouldShowQuestion(nextQuestion.questionId)) {
                return nextIndex;
            }
            nextIndex++;
        }

        return nextIndex;
    };

    const handleAnswer = (value: string | string[]) => {
        const currentQuestion = availableQuestions[currentQuestionIndex];

        setAnswers(prev => ({
            ...prev,
            [currentQuestion.questionId]: value
        }));

        const nextIndex = getNextQuestionIndex();

        if (nextIndex >= availableQuestions.length) {
            navigate('/results', { state: { answers: { ...answers, [currentQuestion.questionId]: value } } });
        } else {
            setCurrentQuestionIndex(nextIndex);
            setQuestionHistory(prev => [...prev, nextIndex]);
        }
    };

    const handleMultipleChoice = (value: string, isSelected: boolean) => {
        const currentQuestion = availableQuestions[currentQuestionIndex];
        const currentAnswers = answers[currentQuestion.questionId] as string[] || [];

        let newAnswers: string[];
        if (isSelected) {
            newAnswers = currentAnswers.filter(answer => answer !== value);
        } else {
            newAnswers = [...currentAnswers, value];
        }

        setAnswers(prev => ({
            ...prev,
            [currentQuestion.questionId]: newAnswers
        }));
    };

    const proceedWithMultipleChoice = () => {
        const currentQuestion = availableQuestions[currentQuestionIndex];
        const currentAnswers = answers[currentQuestion.questionId] as string[];

        if (currentAnswers && currentAnswers.length > 0) {
            handleAnswer(currentAnswers);
        }
    };

    const goBack = () => {
        if (questionHistory.length > 1) {
            const newHistory = [...questionHistory];
            newHistory.pop();
            const previousIndex = newHistory[newHistory.length - 1];
            setCurrentQuestionIndex(previousIndex);
            setQuestionHistory(newHistory);
        } else {
            navigate('/');
        }
    };

    if (availableQuestions.length === 0) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    const currentQuestion = availableQuestions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / availableQuestions.length) * 100;
    const currentMultipleAnswers = answers[currentQuestion.questionId] as string[] || [];

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 py-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-30 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-tl from-purple-500/20 to-pink-500/20 opacity-25 blur-3xl animate-pulse delay-1000"></div>

            {/* Enhanced Glassmorphism Progress Bar */}
            <div className="fixed top-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-20 px-6">
                {/* Main Progress Container */}
                <div className="relative">
                    {/* Glassmorphism Container */}
                    <div className="
                        relative p-6 rounded-2xl
                        bg-white/[0.02]
                        backdrop-blur-xl
                        border border-white/[0.08]
                        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                        hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)]
                        transition-all duration-500
                        before:absolute before:inset-0 before:rounded-2xl
                        before:bg-gradient-to-r before:from-blue-500/5 before:to-purple-500/5
                        before:opacity-0 hover:before:opacity-100
                        before:transition-opacity before:duration-300
                    ">
                        {/* Progress Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
                                <span className="text-white/90 font-semibold text-lg tracking-wide">
                                    Question {currentQuestionIndex + 1}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-white/60 text-sm font-medium">
                                    {Math.round(progressPercentage)}%
                                </span>
                                <div className="text-white/40 text-sm">
                                    of {availableQuestions.length}
                                </div>
                            </div>
                        </div>

                        {/* Progress Track */}
                        <div className="relative">
                            {/* Background Track */}
                            <div className="
                                relative h-3 rounded-full overflow-hidden
                                bg-white/[0.03]
                                backdrop-blur-sm
                                border border-white/[0.05]
                                shadow-inner
                            ">
                                {/* Animated Progress Fill */}
                                <div
                                    className="
                                        h-full rounded-full transition-all duration-700 ease-out
                                        bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500
                                        shadow-[0_0_20px_rgba(59,130,246,0.6)]
                                        relative overflow-hidden
                                    "
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    {/* Shimmer Effect */}
                                    <div className="
                                        absolute inset-0
                                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                                        transform -skew-x-12
                                        animate-[shimmer_2s_infinite]
                                    "></div>
                                </div>

                                {/* Progress Dots */}
                                <div className="absolute inset-0 flex items-center justify-between px-1">
                                    {Array.from({ length: availableQuestions.length }, (_, i) => (
                                        <div
                                            key={i}
                                            className={`
                                                w-1.5 h-1.5 rounded-full transition-all duration-300
                                                ${i <= currentQuestionIndex
                                                ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                                                : 'bg-white/20'
                                            }
                                            `}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Glow Effect */}
                            <div
                                className="
                                    absolute inset-0 rounded-full
                                    bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20
                                    blur-sm opacity-60
                                    transition-all duration-700
                                "
                                style={{
                                    width: `${progressPercentage}%`,
                                    filter: 'blur(8px)',
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute -inset-4 pointer-events-none">
                        <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
                        <div className="absolute bottom-2 right-6 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-70 animate-ping delay-1000"></div>
                        <div className="absolute top-1/2 right-2 w-0.5 h-0.5 bg-pink-400 rounded-full opacity-50 animate-ping delay-500"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center animate-in fade-in-0 slide-in-from-bottom-8 duration-700 mt-32">
                {/* Question */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 leading-tight tracking-tight drop-shadow-2xl mb-6">
                        {currentQuestion.questionText}
                    </h1>
                    {currentQuestion.questionType === 'multiple_choice' && (
                        <p className="text-gray-400 text-lg mb-4">Select all that apply</p>
                    )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
                    {currentQuestion.answerOptions.map((option, index) => {
                        const isSelected = currentQuestion.questionType === 'multiple_choice'
                            ? currentMultipleAnswers.includes(option.value)
                            : false;

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    if (currentQuestion.questionType === 'multiple_choice') {
                                        handleMultipleChoice(option.value, isSelected);
                                    } else {
                                        handleAnswer(option.value);
                                    }
                                }}
                                className={`
                                    relative
                                    p-6
                                    backdrop-blur-sm
                                    font-semibold
                                    text-lg
                                    rounded-xl
                                    border
                                    transition-all
                                    duration-300
                                    ease-in-out
                                    hover:scale-105
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-blue-300/30
                                    group
                                    animate-in
                                    fade-in-0
                                    slide-in-from-bottom-4
                                    duration-500
                                    ${isSelected
                                    ? 'bg-blue-600/80 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                                    : 'bg-gray-800/70 border-gray-600/50 text-white hover:bg-gray-700/80 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                }
                                `}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <span className="relative z-10 block text-left">
                                    {option.label}
                                </span>
                                <div className={`
                                    absolute
                                    inset-0
                                    bg-gradient-to-r
                                    from-blue-500/20
                                    to-purple-500/20
                                    rounded-xl
                                    transition-opacity
                                    duration-300
                                    -z-10
                                    ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                                `}></div>
                            </button>
                        );
                    })}
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
                        {questionHistory.length <= 1 ? '← Back to Home' : '← Previous'}
                    </button>

                    {currentQuestion.questionType === 'multiple_choice' && (
                        <button
                            onClick={proceedWithMultipleChoice}
                            disabled={currentMultipleAnswers.length === 0}
                            className="
                                px-6 py-3
                                bg-blue-600/70
                                backdrop-blur-sm
                                text-white
                                font-medium
                                rounded-lg
                                border
                                border-blue-500/50
                                transition-all
                                duration-300
                                hover:bg-blue-500/80
                                focus:outline-none
                                focus:ring-4
                                focus:ring-blue-400/30
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            Continue →
                        </button>
                    )}
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

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }
            `}</style>
        </section>
    );
};

export default Questionnaire;