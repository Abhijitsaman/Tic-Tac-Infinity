import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import { AchievementProvider } from './context/AchievementContext';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import HomeScreen from './screens/HomeScreen';
import GameModeScreen from './screens/GameModeScreen';
import ClassicMode from './modes/ClassicMode';
import AIMode from './modes/AIMode';
import TournamentMode from './modes/TournamentMode';
import TimeAttackMode from './modes/TimeAttackMode';
import GameScreen from './screens/GameScreen';
import ProfileScreen from './screens/ProfileScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import AchievementScreen from './screens/AchievementScreen';
import MatchHistoryScreen from './screens/MatchHistoryScreen';
import ReplayViewerScreen from './screens/ReplayViewerScreen';
import SettingsScreen from './screens/SettingsScreen';

function App() {
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <ThemeProvider>
      <AudioProvider>
        <AchievementProvider>
          <GameProvider>
            <Router>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/game-modes" element={<GameModeScreen />} />
                  <Route path="/classic" element={<ClassicMode />} />
                  <Route path="/ai" element={<AIMode />} />
                  <Route path="/tournament" element={<TournamentMode />} />
                  <Route path="/time-attack" element={<TimeAttackMode />} />
                  <Route path="/game/:mode" element={<GameScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/statistics" element={<StatisticsScreen />} />
                  <Route path="/achievements" element={<AchievementScreen />} />
                  <Route path="/history" element={<MatchHistoryScreen />} />
                  <Route path="/replay/:id" element={<ReplayViewerScreen />} />
                  <Route path="/settings" element={<SettingsScreen />} />
                </Routes>
              </AnimatePresence>
            </Router>
          </GameProvider>
        </AchievementProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;
