import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import questionsData from '../data/questions.json';

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
    [key: string]: string | string[] | null;
}

interface QuestionsData {
    questions: Question[];
}

const Survey: React.FC = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
    const [questionHistory, setQuestionHistory] = useState<number[]>([0]);
    const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadQuestions = () => {
            try {
                // Cast explicite du JSON importé
                const data = questionsData as QuestionsData;
                const allQuestions = data.questions;

                // Filtrer et organiser les questions comme avant
                const initialQuestions = allQuestions.filter(q => q.importance === 'high');
                const mediumQuestions = allQuestions.filter(q => q.importance === 'medium');

                const combinedQuestions = Array.from(new Set([...initialQuestions, ...mediumQuestions]));
                setAvailableQuestions(combinedQuestions);
                setIsLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des questions:', error);
                setIsLoading(false);
            }
        };

        loadQuestions();
    }, []);

    const shouldShowQuestion = (questionId: string): boolean => {
        const platformAnswer = answers.platform_preference;

        if (questionId === 'console_type') {
            return Array.isArray(platformAnswer) ? platformAnswer.includes('console') : platformAnswer === 'console';
        }

        return true;
    };

    const getNextQuestionIndex = (): number => {
        let nextIndex = currentQuestionIndex + 1;

        while (nextIndex < availableQuestions.length) {
            const nextQuestion = availableQuestions[nextIndex];
            if (shouldShowQuestion(nextQuestion.questionId)) {
                return nextIndex;
            }
            nextIndex++;
        }

        return nextIndex;
    };

    const handleAnswer = (value: string | string[] | null) => {
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

    const handleSkip = () => {
        handleAnswer(null);
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

    // Affichage de chargement
    if (isLoading || availableQuestions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading questions...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = availableQuestions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / availableQuestions.length) * 100;
    const currentMultipleAnswers = answers[currentQuestion.questionId] as string[] || [];
    const isFirstQuestion = currentQuestionIndex === 0;

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 py-16 overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-30 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-tl from-purple-500/20 to-pink-500/20 opacity-25 blur-3xl animate-pulse delay-1000"></div>

            {/* Enhanced Glassmorphism Progress Bar */}
            <div className="fixed top-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-20 px-6">
                <div className="relative">
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
                        <div className="relative">
                            <div className="
                                relative h-3 rounded-full overflow-hidden
                                bg-white/[0.03]
                                backdrop-blur-sm
                                border border-white/[0.05]
                                shadow-inner
                            ">
                                <div
                                    className="
                                        h-full rounded-full transition-all duration-700 ease-out
                                        bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500
                                        shadow-[0_0_20px_rgba(59,130,246,0.6)]
                                        relative overflow-hidden
                                    "
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    <div className="
                                        absolute inset-0
                                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                                        transform -skew-x-12
                                        animate-[shimmer_2s_infinite]
                                    "></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-between px-1">
                                    {Array.from({ length: availableQuestions.length }, (_, i) => (
                                        <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300
                                                ${i <= currentQuestionIndex ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-white/20'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 blur-sm opacity-60 transition-all duration-700"
                                style={{ width: `${progressPercentage}%`, filter: 'blur(8px)' }}
                            ></div>
                        </div>
                    </div>
                    <div className="absolute -inset-4 pointer-events-none">
                        <div className="absolute top-2 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
                        <div className="absolute bottom-2 right-6 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-70 animate-ping delay-1000"></div>
                        <div className="absolute top-1/2 right-2 w-0.5 h-0.5 bg-pink-400 rounded-full opacity-50 animate-ping delay-500"></div>
                    </div>
                </div>
            </div>

            {/* Main Content with Animation */}
            <div className="relative z-10 max-w-4xl mx-auto text-center mt-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.questionId}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
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
                                            relative p-6 backdrop-blur-sm font-semibold text-lg rounded-xl border
                                            transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none
                                            focus:ring-4 focus:ring-blue-300/30 group animate-in fade-in-0 slide-in-from-bottom-4 duration-500
                                            ${isSelected ? 'bg-blue-600/80 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-gray-800/70 border-gray-600/50 text-white hover:bg-gray-700/80 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'}
                                        `}
                                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                                    >
                                        <span className="relative z-10 block text-left">{option.label}</span>
                                        <div className={`
                                            absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl
                                            transition-opacity duration-300 -z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                                        `}></div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={goBack}
                                className="px-6 py-3 bg-gray-700/70 backdrop-blur-sm text-gray-300 font-medium rounded-lg border border-gray-600/50 transition-all duration-300 hover:bg-gray-600/80 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-400/30"
                            >
                                {questionHistory.length <= 1 ? '← Back to Home' : '← Previous'}
                            </button>
                            {!isFirstQuestion && (
                                <button
                                    onClick={handleSkip}
                                    className="px-6 py-3 bg-yellow-600/70 backdrop-blur-sm text-white font-medium rounded-lg border border-yellow-500/50 transition-all duration-300 hover:bg-yellow-500/80 hover:border-yellow-400/70 focus:outline-none focus:ring-4 focus:ring-yellow-400/30"
                                >
                                    Skip ⏭️
                                </button>
                            )}
                            {currentQuestion.questionType === 'multiple_choice' && (
                                <button
                                    onClick={proceedWithMultipleChoice}
                                    disabled={currentMultipleAnswers.length === 0}
                                    className="px-6 py-3 bg-blue-600/70 backdrop-blur-sm text-white font-medium rounded-lg border border-blue-500/50 transition-all duration-300 hover:bg-blue-500/80 focus:outline-none focus:ring-4 focus:ring-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue →
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
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
        </motion.section>
    );
};

export default Survey;