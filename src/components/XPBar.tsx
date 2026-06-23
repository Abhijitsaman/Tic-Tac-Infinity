import React from 'react';
import { motion } from 'framer-motion';

interface XPBarProps {
  currentXP: number;
  level: number;
}

const XPBar: React.FC<XPBarProps> = ({ currentXP, level }) => {
  const xpForNextLevel = level * 500;
  const xpInCurrentLevel = currentXP - ((level - 1) * 500);
  const percentage = (xpInCurrentLevel / xpForNextLevel) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Level {level}</span>
        <span className="text-gray-400">{xpInCurrentLevel} / {xpForNextLevel} XP</span>
      </div>
      <div className="h-3 bg-background-tertiary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default XPBar;
