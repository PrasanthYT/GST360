"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, TrendingUp, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export function AchievementBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(0);

  const achievements = [
    {
      title: "Filing Streak Master!",
      description: "You've filed all returns on time for 6 consecutive months!",
      icon: Award,
      color:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      points: 250,
    },
    {
      title: "Tax Efficiency Pro!",
      description:
        "Your business saved 12% more in taxes compared to last quarter!",
      icon: TrendingUp,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      points: 150,
    },
    {
      title: "Compliance Champion!",
      description: "100% compliance score achieved this month!",
      icon: CheckCircle2,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      points: 200,
    },
  ];

  useEffect(() => {
    // Show the banner after a short delay
    const timer = setTimeout(() => {
      setShowBanner(true);

      // Trigger confetti when achievement is shown
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowBanner(false);
  };

  const handleNextAchievement = () => {
    setCurrentAchievement((prev) => (prev + 1) % achievements.length);

    // Trigger confetti for each new achievement
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const achievement = achievements[currentAchievement];

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          <div className="rounded-lg border bg-card shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <h4 className="font-semibold text-sm">
                    Achievement Unlocked!
                  </h4>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-6 w-6 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-4">
                <div
                  className={`rounded-full p-2.5 ${achievement.color} self-start`}
                >
                  <achievement.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-amber-500">
                      +{achievement.points} points
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextAchievement}
                >
                  View Next
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Claim Reward
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
