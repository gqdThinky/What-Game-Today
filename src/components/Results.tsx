import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SteamGame {
    appid: number;
    name: string;
    header_image?: string;
    short_description?: string;
    price_overview?: {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
        initial_formatted: string;
        final_formatted: string;
    };
    genres?: Array<{ description: string }>;
    categories?: Array<{ description: string }>;
    screenshots?: Array<{ path_thumbnail: string; path_full: string }>;
    movies?: Array<{ webm: { 480: string }; highlight: boolean }>;
    release_date?: { date: string };
    metacritic?: { score: number };
    recommendations?: { total: number };
}

interface QuestionnaireAnswers {
    [key: string]: string | string[] | null;
}

const Results: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const answers = location.state?.answers as QuestionnaireAnswers || {};

    const [games, setGames] = useState<SteamGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null);

    // Mapping des genres pour l'API Steam
    const genreMapping: { [key: string]: string[] } = {
        action: ['Action', 'Adventure'],
        rpg: ['RPG', 'Role-Playing'],
        strategy: ['Strategy'],
        puzzle: ['Puzzle', 'Casual'],
        simulation: ['Simulation'],
        sports: ['Sports', 'Racing'],
        horror: ['Horror'],
        racing: ['Racing'],
        fighting: ['Fighting']
    };



    // Fonction pour chercher des jeux via une API proxy (car Steam API a des limitations CORS)
    const searchGames = async () => {
        try {
            setLoading(true);
            //const tags = getRecommendationTags();

            // Simuler une recherche de jeux populaires basée sur les tags
            // En production, vous devriez utiliser une API backend qui fait appel à Steam API
            const mockGames: SteamGame[] = [
                {
                    appid: 271590,
                    name: "Grand Theft Auto V",
                    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
                    short_description: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld...",
                    price_overview: {
                        currency: "EUR",
                        initial: 2999,
                        final: 1499,
                        discount_percent: 50,
                        initial_formatted: "29,99€",
                        final_formatted: "14,99€"
                    },
                    genres: [{ description: "Action" }, { description: "Adventure" }],
                    release_date: { date: "14 Apr, 2015" },
                    metacritic: { score: 96 },
                    recommendations: { total: 1234567 }
                },
                {
                    appid: 1174180,
                    name: "Red Dead Redemption 2",
                    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
                    short_description: "Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang...",
                    price_overview: {
                        currency: "EUR",
                        initial: 5999,
                        final: 2999,
                        discount_percent: 50,
                        initial_formatted: "59,99€",
                        final_formatted: "29,99€"
                    },
                    genres: [{ description: "Action" }, { description: "Adventure" }],
                    release_date: { date: "5 Dec, 2019" },
                    metacritic: { score: 93 },
                    recommendations: { total: 987654 }
                },
                {
                    appid: 1086940,
                    name: "Baldur's Gate 3",
                    header_image: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg",
                    short_description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
                    price_overview: {
                        currency: "EUR",
                        initial: 5999,
                        final: 5999,
                        discount_percent: 0,
                        initial_formatted: "",
                        final_formatted: "59,99€"
                    },
                    genres: [{ description: "RPG" }, { description: "Strategy" }],
                    release_date: { date: "3 Aug, 2023" },
                    metacritic: { score: 96 },
                    recommendations: { total: 654321 }
                }
            ];

            // Filtrer les jeux en fonction des réponses
            let filteredGames = mockGames;

            // Éviter les genres non désirés
            const avoidGenres = answers.avoid_genre as string[] || [];
            if (!avoidGenres.includes('none')) {
                filteredGames = filteredGames.filter(game => {
                    const gameGenres = game.genres?.map(g => g.description.toLowerCase()) || [];
                    return !avoidGenres.some(avoid => {
                        if (avoid === 'horror') return gameGenres.includes('horror');
                        if (avoid === 'racing') return gameGenres.includes('racing');
                        if (avoid === 'fighting') return gameGenres.includes('fighting');
                        return false;
                    });
                });
            }

            setGames(filteredGames);
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Erreur lors de la recherche de jeux. Veuillez réessayer.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Object.keys(answers).length === 0) {
            navigate('/');
            return;
        }
        searchGames();
    }, [answers, navigate]);

    const retakeQuiz = () => {
        navigate('/survey');
    };

    const goHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative min-h-screen flex items-center justify-center px-6 py-16"
            >
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Recherche en cours...</h2>
                    <p className="text-gray-400">Nous analysons vos préférences pour trouver les jeux parfaits</p>
                </div>
            </motion.section>
        );
    }

    if (error) {
        return (
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative min-h-screen flex items-center justify-center px-6 py-16"
            >
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
                    <button
                        onClick={searchGames}
                        className="px-6 py-3 bg-blue-600/70 backdrop-blur-sm text-white font-medium rounded-lg border border-blue-500/50 transition-all duration-300 hover:bg-blue-500/80 mr-4"
                    >
                        Réessayer
                    </button>
                    <button
                        onClick={goHome}
                        className="px-6 py-3 bg-gray-700/70 backdrop-blur-sm text-gray-300 font-medium rounded-lg border border-gray-600/50 transition-all duration-300 hover:bg-gray-600/80"
                    >
                        Accueil
                    </button>
                </div>
            </motion.section>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen px-6 md:px-8 py-16 overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-30 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-tl from-purple-500/20 to-pink-500/20 opacity-25 blur-3xl animate-pulse delay-1000"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 leading-tight tracking-tight drop-shadow-2xl mb-4">
                        Vos Recommandations
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Basé sur vos réponses, voici les jeux parfaits pour vous
                    </p>
                </motion.div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {games.map((game, index) => (
                        <motion.div
                            key={game.appid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="
                relative group cursor-pointer
                bg-white/[0.02] backdrop-blur-xl
                border border-white/[0.08]
                rounded-2xl overflow-hidden
                shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)]
                transition-all duration-500
                hover:scale-105 hover:border-blue-400/30
              "
                            onClick={() => setSelectedGame(game)}
                        >
                            {/* Game Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={game.header_image}
                                    alt={game.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                {/* Price Badge */}
                                {game.price_overview && (
                                    <div className="absolute top-4 right-4">
                                        {game.price_overview.discount_percent > 0 ? (
                                            <div className="bg-green-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold text-sm">
                                                -{game.price_overview.discount_percent}%
                                            </div>
                                        ) : (
                                            <div className="bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold text-sm">
                                                {game.price_overview.final_formatted}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Metacritic Score */}
                                {game.metacritic && (
                                    <div className="absolute top-4 left-4 bg-yellow-600/90 backdrop-blur-sm px-2 py-1 rounded text-white font-bold text-sm">
                                        {game.metacritic.score}
                                    </div>
                                )}
                            </div>

                            {/* Game Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                                    {game.name}
                                </h3>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                    {game.short_description}
                                </p>

                                {/* Genres */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {game.genres?.slice(0, 3).map((genre, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded-full border border-purple-500/30"
                                        >
                      {genre.description}
                    </span>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="flex justify-between items-center text-sm text-gray-400">
                                    <span>{game.release_date?.date}</span>
                                    {game.recommendations && (
                                        <span>👍 {(game.recommendations.total / 1000).toFixed(0)}k</span>
                                    )}
                                </div>

                                {/* Price */}
                                {game.price_overview && (
                                    <div className="mt-4 flex items-center justify-between">
                                        {game.price_overview.discount_percent > 0 ? (
                                            <div className="flex items-center space-x-2">
                        <span className="text-gray-400 line-through text-sm">
                          {game.price_overview.initial_formatted}
                        </span>
                                                <span className="text-green-400 font-bold">
                          {game.price_overview.final_formatted}
                        </span>
                                            </div>
                                        ) : (
                                            <span className="text-blue-400 font-bold">
                        {game.price_overview.final_formatted}
                      </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex justify-center space-x-4"
                >
                    <button
                        onClick={retakeQuiz}
                        className="
              px-8 py-4 bg-blue-600/70 backdrop-blur-sm text-white font-semibold rounded-xl
              border border-blue-500/50 transition-all duration-300
              hover:bg-blue-500/80 hover:border-blue-400/70 hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-blue-400/30
              shadow-lg hover:shadow-blue-500/25
            "
                    >
                        🔄 Refaire le Quiz
                    </button>
                    <button
                        onClick={goHome}
                        className="
              px-8 py-4 bg-gray-700/70 backdrop-blur-sm text-gray-300 font-semibold rounded-xl
              border border-gray-600/50 transition-all duration-300
              hover:bg-gray-600/80 hover:text-white hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-gray-400/30
            "
                    >
                        🏠 Accueil
                    </button>
                </motion.div>
            </div>

            {/* Game Detail Modal */}
            <AnimatePresence>
                {selectedGame && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedGame(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="
                bg-gray-900/90 backdrop-blur-xl border border-white/10
                rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto
                shadow-2xl
              "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <img
                                    src={selectedGame.header_image}
                                    alt={selectedGame.name}
                                    className="w-full h-64 object-cover"
                                />
                                <button
                                    onClick={() => setSelectedGame(null)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6">
                                <h2 className="text-3xl font-bold text-white mb-4">{selectedGame.name}</h2>
                                <p className="text-gray-300 mb-6">{selectedGame.short_description}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedGame.genres?.map((genre, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-blue-600/30 text-blue-200 text-sm rounded-full border border-blue-500/30"
                                        >
                      {genre.description}
                    </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Date de sortie:</span>
                                        <p className="text-white">{selectedGame.release_date?.date}</p>
                                    </div>
                                    {selectedGame.metacritic && (
                                        <div>
                                            <span className="text-gray-400">Score Metacritic:</span>
                                            <p className="text-white">{selectedGame.metacritic.score}/100</p>
                                        </div>
                                    )}
                                </div>

                                {selectedGame.price_overview && (
                                    <div className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-500/30">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-white">Prix:</span>
                                            {selectedGame.price_overview.discount_percent > 0 ? (
                                                <div className="text-right">
                                                    <div className="text-red-400 line-through text-sm">
                                                        {selectedGame.price_overview.initial_formatted}
                                                    </div>
                                                    <div className="text-green-400 font-bold text-lg">
                                                        {selectedGame.price_overview.final_formatted}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-blue-400 font-bold text-lg">
                          {selectedGame.price_overview.final_formatted}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Animation Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce delay-0 shadow-lg"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-70 animate-bounce delay-500 shadow-lg"></div>
                <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50 animate-bounce delay-1000 shadow-lg"></div>
            </div>
        </motion.section>
    );
};

export default Results;