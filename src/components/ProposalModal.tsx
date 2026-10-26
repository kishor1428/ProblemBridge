import React, { useState } from 'react';
import { Problem, Proposal } from '../types';
import { X, Send, Sparkles, Check, AlertCircle } from 'lucide-react';

interface ProposalModalProps {
  problem: Problem | null;
  onClose: () => void;
  onSubmitProposal: (proposal: Proposal) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  problem,
  onClose,
  onSubmitProposal,
}) => {
  const [solutionSummary, setSolutionSummary] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(
    problem?.skills ? [...problem.skills] : ['ESP32', 'Sensors']
  );
  const [estimatedWeeks, setEstimatedWeeks] = useState<number>(3);
  const [teamType, setTeamType] = useState<'Solo' | 'Team of 2' | 'Team of 3-4'>('Team of 2');
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/sanjay-verma-tech/embedded-iot-prototypes');
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  if (!problem) return null;

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techStackInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(techStackInput.trim())) {
        setTechStack([...techStack, techStackInput.trim()]);
      }
      setTechStackInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTechStack(techStack.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionSummary.trim() || solutionSummary.length < 20) {
      setError('Please provide at least 2-3 sentences explaining your technical solution architecture.');
      return;
    }

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      problemId: problem.id,
      problemTitle: problem.title,
      builderName: 'Sanjay Verma',
      builderRole: 'Final Year ECE & Embedded Systems Builder',
      builderInstitution: 'PSG College of Technology, Coimbatore',
      solutionSummary: solutionSummary.trim(),
      techStack,
      estimatedWeeks,
      teamType,
      portfolioUrl: portfolioUrl.trim(),
      submittedAt: 'Just now',
      status: 'Submitted',
    };

    onSubmitProposal(newProposal);
    onClose();
  };

  const handleGenerateAIProposal = async () => {
    if (!problem) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/structure-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: problem.description,
          solverSkills: techStack,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.solutionSummary) {
          setSolutionSummary(data.solutionSummary);
        }
        if (Array.isArray(data.suggestedTechStack) && data.suggestedTechStack.length > 0) {
          setTechStack(Array.from(new Set([...techStack, ...data.suggestedTechStack])));
        }
        if (data.estimatedWeeks) {
          setEstimatedWeeks(data.estimatedWeeks);
        }
      }
    } catch (err) {
      console.warn('AI structure proposal failed:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E7F3] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8E7F3] bg-[#FAFAF9]/90 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#5B4FE9]">
              Submit Proposal to Problem Owner
            </div>
            <h3 className="font-display text-lg font-semibold text-[#14162B] line-clamp-1">
              {problem.title}
            </h3>
            <p className="text-xs text-[#8B8DA3]">
              {problem.organization} · Honorarium ₹{problem.budget.toLocaleString('en-IN')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#FBE9EC] border border-[#D6455A]/30 text-[#D6455A] rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Builder Identity Tag */}
          <div className="bg-[#EFEDFC]/70 p-3.5 rounded-xl border border-[#D6D4EA] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#5B4FE9] text-white font-bold text-xs flex items-center justify-center">
                SV
              </div>
              <div>
                <p className="text-xs font-semibold text-[#14162B]">
                  Sanjay Verma
                </p>
                <p className="text-[11px] text-[#4A4C63]">
                  PSG College of Technology · Final Year ECE
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-white text-[#5B4FE9] font-bold px-2 py-0.5 rounded-md border border-[#D6D4EA]">
              Verified Builder
            </span>
          </div>

          {/* Architecture & Approach */}
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
              <label className="block text-xs font-semibold text-[#14162B] uppercase tracking-wider">
                Proposed Architecture & Implementation Strategy *
              </label>
              <button
                type="button"
                onClick={handleGenerateAIProposal}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EFEDFC] hover:bg-[#E3E0FA] text-[#5B4FE9] text-xs font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiLoading ? 'Structuring...' : 'AI Proposal Assistant'}
              </button>
            </div>
            <textarea
              rows={4}
              value={solutionSummary}
              onChange={(e) => {
                setSolutionSummary(e.target.value);
                if (error) setError('');
              }}
              placeholder={`Describe how you plan to solve "${problem.title}". Mention sensors, components, firmware loops, circuit fail-safes, or software architecture you will use...`}
              className="w-full text-xs sm:text-sm p-3 bg-[#FAFAF9] border border-[#E8E7F3] rounded-xl outline-none focus:bg-white focus:border-[#5B4FE9] focus:ring-2 focus:ring-[#5B4FE9]/10 transition-all text-[#14162B]"
            />
            <p className="text-[11px] text-[#8B8DA3] mt-1">
              Be specific about technical components, fail-safes, and milestone delivery.
            </p>
          </div>

          {/* Tech Stack Chips */}
          <div>
            <label className="block text-xs font-semibold text-[#14162B] uppercase tracking-wider mb-1.5">
              Tools, Hardware & Stack
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-[#EFEDFC] text-[#5B4FE9] px-2.5 py-1 rounded-full"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(tech)}
                    className="hover:text-[#4C40DC]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type technology (e.g., FreeRTOS, MQTT, Flutter) and press Enter..."
              className="w-full text-xs p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
            />
          </div>

          {/* Timeline and Team Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#14162B] uppercase tracking-wider mb-1.5">
                Estimated Delivery (Weeks)
              </label>
              <input
                type="number"
                min={1}
                max={16}
                value={estimatedWeeks}
                onChange={(e) => setEstimatedWeeks(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14162B] uppercase tracking-wider mb-1.5">
                Team Setup
              </label>
              <select
                value={teamType}
                onChange={(e) => setTeamType(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              >
                <option value="Solo">Solo Engineer</option>
                <option value="Team of 2">Team of 2 (Recommended)</option>
                <option value="Team of 3-4">Team of 3-4 Builders</option>
              </select>
            </div>
          </div>

          {/* Relevant Link */}
          <div>
            <label className="block text-xs font-semibold text-[#14162B] uppercase tracking-wider mb-1.5">
              Portfolio / GitHub / Prototype Video Link
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full text-xs p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#E8E7F3] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#4A4C63] hover:text-[#14162B] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#5B4FE9] text-white text-xs font-semibold hover:bg-[#4C40DC] shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
