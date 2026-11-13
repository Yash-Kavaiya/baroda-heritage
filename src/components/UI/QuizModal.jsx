import React, { useState } from "react";
import confetti from "canvas-confetti";
import { X, Award, CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";
import { VADODARA_QUIZ } from "../../data/places";

export default function QuizModal({ isOpen, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = VADODARA_QUIZ[currentIdx];

  const handleSelectOption = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);

    if (idx === currentQ.answerIndex) {
      setScore((prev) => prev + 1);
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#f59e0b", "#e11d48", "#10b981", "#3b82f6"]
      });
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < VADODARA_QUIZ.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsFinished(false);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Sanskarinagari Heritage Challenge
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isFinished ? (
          <div className="mt-4 space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Question {currentIdx + 1} of {VADODARA_QUIZ.length}</span>
              <span className="text-amber-400 font-bold">Score: {score}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / VADODARA_QUIZ.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
              {currentQ.question}
            </p>

            {/* Multiple Choice Options */}
            <div className="space-y-2 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.answerIndex;

                let btnStyle = "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-600";
                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                  } else {
                    btnStyle = "bg-slate-800/40 border-slate-800 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedAnswer !== null && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                    {selectedAnswer !== null && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {showExplanation && (
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/20 text-xs text-slate-300 leading-relaxed animate-fade-in">
                <span className="font-bold text-amber-400 block mb-1">Heritage Fact:</span>
                {currentQ.explanation}
              </div>
            )}

            {/* Next Question button */}
            {selectedAnswer !== null && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 text-xs transition-all shadow-md"
                >
                  {currentIdx + 1 < VADODARA_QUIZ.length ? "Next Question →" : "See Final Score 🏆"}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Completion Badge Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center shadow-xl shadow-amber-500/30">
              <Sparkles className="w-8 h-8 text-slate-950" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-white">Congratulations!</h4>
              <p className="text-xs text-slate-400">
                You scored <span className="text-amber-400 font-bold text-base">{score}</span> out of{" "}
                <span className="font-bold">{VADODARA_QUIZ.length}</span>!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 inline-block text-left max-w-sm">
              <div className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">
                HONORARY CERTIFICATE
              </div>
              <div className="text-base font-extrabold text-white mt-1">
                {score >= 4
                  ? "👑 Baroda Royal Historian"
                  : score >= 2
                  ? "🏛️ Sanskarinagari Explorer"
                  : "🌱 Heritage Enthusiast"}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Awarded at GDG DevFest Baroda 2026 for mastery of Vadodara's architectural monuments!
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
