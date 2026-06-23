import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGame } from '../context/GameContext';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import AnimatedBackground from '../components/AnimatedBackground';

const StatisticsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { stats, matches } = useGame();
  
  const winRate = stats.totalGames > 0 ? ((stats.wins / stats.totalGames) * 100).toFixed(1) : '0';
  
  const pieData = [
    { name: 'Wins', value: stats.wins, color: '#22C55E' },
    { name: 'Losses', value: stats.losses, color: '#EF4444' },
    { name: 'Draws', value: stats.draws, color: '#F59E0B' },
  ];
  
  const last10Matches = matches.slice(0, 10).reverse().map((match, index) => ({
    match: index + 1,
    result: match.winner === 'Draw' ? 0 : match.winner === 'Player 1' ? 1 : -1,
  }));
  
  const modeStats = matches.reduce((acc, match) => {
    acc[match.mode] = (acc[match.mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const modeData = Object.entries(modeStats).map(([mode, count]) => ({
    mode: mode.charAt(0).toUpperCase() + mode.slice(1),
    count,
  }));
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <NeonButton onClick={() => navigate(-1)} size="sm">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back
          </NeonButton>
        </motion.div>
        
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Game Statistics</span>
          </h1>
          <p className="text-gray-400 text-lg">Your performance analytics</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Total Games</p>
              <p className="text-4xl font-bold text-primary">{stats.totalGames}</p>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Win Rate</p>
              <p className="text-4xl font-bold text-success">{winRate}%</p>
            </div>
          </GlassCard>
          
          <GlassCard>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Longest Streak</p>
              <p className="text-4xl font-bold text-accent">{stats.longestWinStreak}</p>
            </div>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <PieChartIcon className="w-5 h-5 mr-2 text-primary" />
              Win/Loss Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-secondary" />
              Recent Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last10Matches}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="match" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="result" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-accent" />
              Game Modes Played
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="mode" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="count" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-xl font-bold mb-4">Detailed Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-background-tertiary/50">
                <span className="text-gray-400">Average Match Time</span>
                <span className="font-bold text-primary">
                  {Math.floor(stats.averageMatchTime / 60)}m {stats.averageMatchTime % 60}s
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background-tertiary/50">
                <span className="text-gray-400">Total Time Played</span>
                <span className="font-bold text-secondary">
                  {Math.floor(stats.totalTimePlayed / 3600)}h {Math.floor((stats.totalTimePlayed % 3600) / 60)}m
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background-tertiary/50">
                <span className="text-gray-400">AI Wins</span>
                <span className="font-bold text-warning">{stats.aiWins}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background-tertiary/50">
                <span className="text-gray-400">Human Wins</span>
                <span className="font-bold text-success">{stats.humanWins}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default StatisticsScreen;
