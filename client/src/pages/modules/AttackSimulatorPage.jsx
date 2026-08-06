import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Lock,
  Cpu
} from 'lucide-react';
import { simulatorService } from '../../services/simulatorService';
import { useToast } from '../../context/ToastContext';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

export const AttackSimulatorPage = () => {
  const { addToast } = useToast();
  const [scenarios, setScenarios] = useState([]);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({ awarenessScore: 50, totalCompleted: 0, accuracyPercentage: 0, badges: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scenariosRes, progressRes] = await Promise.all([
        simulatorService.getScenarios(),
        simulatorService.getUserProgress()
      ]);
      if (scenariosRes.data?.scenarios) setScenarios(scenariosRes.data.scenarios);
      if (progressRes.data) setProgress(progressRes.data);
    } catch (err) {
      addToast('DANGER', 'Failed to load cyber attack scenarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionId) => {
    if (evaluation) return;
    setSelectedOption(optionId);
  };

  const handleSubmitDecision = async () => {
    if (!selectedOption) return;
    const currentScenario = scenarios[activeScenarioIndex];

    try {
      setSubmitting(true);
      const res = await simulatorService.submitDecision({
        scenarioId: currentScenario.id,
        optionId: selectedOption
      });

      if (res.data) {
        setEvaluation(res.data);
        if (res.data.isCorrect) {
          addToast('SAFE', `Correct decision! +${res.data.scoreDelta} Security Awareness Score`, 'Threat Neutralized');
        } else {
          addToast('DANGER', `Security Vulnerability Triggered! Red flags explained below.`, 'Breach Occurred');
        }

        const progRes = await simulatorService.getUserProgress();
        if (progRes.data) setProgress(progRes.data);
      }
    } catch (err) {
      addToast('DANGER', 'Failed to submit simulation choice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextScenario = () => {
    setSelectedOption(null);
    setEvaluation(null);
    if (activeScenarioIndex < scenarios.length - 1) {
      setActiveScenarioIndex(prev => prev + 1);
    } else {
      setActiveScenarioIndex(0);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const currentScenario = scenarios[activeScenarioIndex] || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-level-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B35] uppercase tracking-widest mb-1.5 font-bold">
            <Zap className="w-4 h-4 text-[#FF6B35]" />
            <span>INTERACTIVE CYBER ATTACK SIMULATION CENTER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F2F1ED] font-heading">AI Cyber Attack Simulator</h1>
          <p className="text-xs text-[#9A9CA5] mt-1 max-w-2xl">
            Test your decision-making in 7 real-world attack scenarios (Phishing, Fake Banking, QR Scams, OTP Theft, UPI Fraud).
          </p>
        </div>

        {/* Analytics Summary Widget */}
        <div className="flex items-center gap-4 bg-[#0B0C10]/80 p-4 rounded-xl border border-[#FF6B35]/20">
          <div className="text-center px-3 border-r border-[#FF6B35]/20">
            <span className="text-xs text-[#9A9CA5] font-mono block uppercase">Awareness Score</span>
            <span className="text-2xl font-extrabold text-[#FF6B35] font-mono">{progress.awarenessScore}/100</span>
          </div>
          <div className="text-center px-3 border-r border-[#FF6B35]/20">
            <span className="text-xs text-[#9A9CA5] font-mono block uppercase">Completed</span>
            <span className="text-2xl font-extrabold text-[#F2F1ED] font-mono">{progress.totalCompleted}</span>
          </div>
          <div className="text-center px-3">
            <span className="text-xs text-[#9A9CA5] font-mono block uppercase">Badges</span>
            <span className="text-2xl font-extrabold text-[#FFB84D] font-mono">{progress.badges.length}</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Scenario Card (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-6 bg-[#14161B]/70">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30 shadow-glow-ember">
                  Scenario {activeScenarioIndex + 1} of {scenarios.length}
                </span>
                <span className="text-xs font-mono text-[#9A9CA5]">{currentScenario.category} • {currentScenario.difficulty}</span>
              </div>
              <button 
                onClick={handleNextScenario}
                className="text-xs text-[#9A9CA5] hover:text-[#F2F1ED] flex items-center gap-1 font-mono"
              >
                <span>Skip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#F2F1ED] font-heading">{currentScenario.title}</h2>
              <p className="text-xs text-[#9A9CA5] leading-relaxed">{currentScenario.description}</p>
            </div>

            {/* Simulated Envelope / Message Preview */}
            <div className="p-5 rounded-xl bg-[#0B0C10] border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[#9A9CA5] border-b border-slate-800 pb-2">
                <span>From: <strong className="text-[#FF6B35]">{currentScenario.sender}</strong></span>
                <span>Subject: <strong className="text-[#F2F1ED]">{currentScenario.subject}</strong></span>
              </div>
              <p className="text-[#9A9CA5] pt-1 leading-normal italic">
                "{currentScenario.bodySnippet}"
              </p>
            </div>

            {/* Decision Options */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-[#FF6B35] uppercase tracking-wider font-bold">
                Select Your Security Decision:
              </label>
              {currentScenario.options?.map((opt) => {
                const isSelected = selectedOption === opt.id;
                let optBorder = 'border-slate-800 bg-[#0B0C10]/60 hover:border-[#FF6B35]/50';
                if (isSelected) {
                  optBorder = 'border-[#FF6B35] bg-[#FF6B35]/15 shadow-glow-ember';
                }
                if (evaluation) {
                  if (opt.isSafe) optBorder = 'border-[#00E5A0] bg-[#00E5A0]/15 text-[#00E5A0]';
                  else if (isSelected && !opt.isSafe) optBorder = 'border-[#FF4D6D] bg-[#FF4D6D]/15 text-[#FF4D6D]';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id)}
                    disabled={!!evaluation}
                    className={`w-full text-left p-4 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${optBorder}`}
                  >
                    <span className="font-medium text-[#F2F1ED]">{opt.text}</span>
                    {isSelected && !evaluation && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-ping" />}
                  </button>
                );
              })}
            </div>

            {/* Action & Submit Button */}
            {!evaluation ? (
              <button
                onClick={handleSubmitDecision}
                disabled={!selectedOption || submitting}
                className="btn-ember-primary w-full py-3.5 rounded-xl text-[#F2F1ED] font-bold text-sm shadow-glow-ember flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {submitting ? 'Evaluating Decision...' : 'Execute Security Decision'}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextScenario}
                className="w-full py-3.5 rounded-xl bg-[#00E5A0] hover:bg-[#00E5A0]/90 text-[#0B0C10] font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Next Cyber Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* AI Red Flag Breakdown Card */}
          {evaluation && (
            <div className={`glass-panel p-6 rounded-2xl border ${evaluation.isCorrect ? 'border-[#00E5A0]/40 bg-[#00E5A0]/10' : 'border-[#FF4D6D]/40 bg-[#FF4D6D]/10'} space-y-4`}>
              <div className="flex items-center gap-3">
                {evaluation.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-[#00E5A0] shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-[#FF4D6D] shrink-0" />
                )}
                <div>
                  <h3 className="text-base font-bold text-[#F2F1ED] font-heading">{evaluation.aiFeedback.verdict}</h3>
                  <span className="text-xs text-[#9A9CA5] font-mono">Score Impact: {evaluation.scoreDelta > 0 ? `+${evaluation.scoreDelta}` : evaluation.scoreDelta} Points</span>
                </div>
              </div>

              <p className="text-xs text-[#9A9CA5] leading-relaxed">{evaluation.aiFeedback.explanation}</p>

              <div>
                <h4 className="text-xs font-mono uppercase text-[#FF6B35] font-bold mb-2">Identified Attack Red Flags:</h4>
                <ul className="space-y-1.5 text-xs text-[#9A9CA5]">
                  {evaluation.aiFeedback.redFlags?.map((flag, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FFB84D] shrink-0" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Drawer: Badges & Achievements */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-4 bg-[#14161B]/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#F2F1ED] font-bold text-base font-heading">
                <Award className="w-5 h-5 text-[#FFB84D]" />
                <span>Earned Badges</span>
              </div>
              <span className="text-xs font-mono text-[#FF6B35] font-bold">{progress.badges.length} Unlocked</span>
            </div>

            {progress.badges.length === 0 ? (
              <p className="text-xs text-[#9A9CA5] italic">Complete attack simulations correctly to unlock achievement badges.</p>
            ) : (
              <div className="space-y-2.5">
                {progress.badges.map((badge, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0B0C10] border border-[#FFB84D]/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFB84D]/10 border border-[#FFB84D]/40 flex items-center justify-center text-[#FFB84D]">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#F2F1ED] block">{badge}</span>
                      <span className="text-[10px] text-[#9A9CA5] font-mono">Verified Security Badge</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackSimulatorPage;
