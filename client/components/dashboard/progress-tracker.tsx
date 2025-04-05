"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Trophy, Star, Gift, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProgressTracker() {
  const [level, setLevel] = useState(4);
  const [xp, setXp] = useState(750);
  const [showReward, setShowReward] = useState(false);

  const maxXp = 1000;
  const progress = (xp / maxXp) * 100;

  const handleClaimReward = () => {
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  return (
    <div className="relative rounded-lg border bg-card p-4">
      {showReward && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-primary/90 backdrop-blur-sm"
        >
          <div className="text-center text-primary-foreground">
            <Gift className="mx-auto h-12 w-12 mb-2" />
            <h3 className="text-xl font-bold">Reward Claimed!</h3>
            <p className="text-sm opacity-90">
              You've unlocked premium templates!
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medium">Compliance Master</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">Level {level}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Complete tasks to level up!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Progress to Level {level + 1}
          </span>
          <span className="font-medium">
            {xp}/{maxXp} XP
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          <span>250 XP needed for next level</span>
        </div>
        <Button size="sm" onClick={handleClaimReward}>
          Claim Reward
        </Button>
      </div>
    </div>
  );
}
