import React, { useState } from 'react';
import {
  ArrowRight,
  PlusCircle,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  Building,
  Target
} from 'lucide-react';

interface HeroSectionProps {
  onExploreProblems: () => void;
  onPostProblem: () => void;
  onSelectStep?: (stepIndex: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProblems,
  onPostProblem,
}) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      num: '01',
      title: 'Post Operational Challenge',
      desc: 'Hospitals, MSME factories, and farmer groups publish genuine bottlenecks with verified honorariums.',
      detail: 'Specify technical constraints, deliverables, target timeline, and budget escrow in under 3 minutes.'
    },
    {
      num: '02',
      title: 'Top Builders Discover & Propose',
      desc: 'Talented student innovators and engineers analyze specs and submit hardware/software architecture.',
      detail: 'Review tailored solution proposals, bills of materials, and previous project repositories directly.'
    },
    {
      num: '03',
      title: 'Direct Collaborative Sprint',
      desc: 'Problem owner and builder connect directly for discovery sessions, telemetry access, or plant visits.',
      detail: 'Align on milestones, review iterative bench demos, and validate firmware/software in live operating conditions.'
    },
    {
      num: '04',
      title: 'Deployed Solution & Honorarium',
      desc: 'Working prototypes get commissioned on-site with verified institutional credentials and completion payout.',
      detail: 'Direct deployment, documentation transfer, and credential verification for builders and organizations.'
    }
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-[#E8E7F3] bg-gradient-to-b from-[#FAFAFD] via-white to-white">
      {/* Subtle architectural background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #D6D4EA 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
          
          {/* Left Column: Authoritative Editorial Header & Central CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFEDFC] border border-[#D6D4EA]/80 text-[#5B4FE9] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#5B4FE9]" />
              <span>Verified Challenge Network · MSMEs, Civic Bodies & Builders</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[#14162B] leading-[1.12] tracking-tight">
              Where Real-World Problems Meet Ambitious Builders.
            </h1>

            {/* Subtitle */}
            <p className="font-body text-base sm:text-lg text-[#4A4C63] max-w-xl leading-relaxed">
              ProblemBridge connects verified industrial facilities, civic corporations, and rural enterprises with top engineering student innovators to design, fabricate, and deploy working solutions.
            </p>

            {/* Central Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* PRIMARY CENTRAL BUTTON: Post a Problem */}
              <button
                onClick={onPostProblem}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#5B4FE9] text-white font-bold text-sm hover:bg-[#4C40DC] active:scale-98 transition-all duration-150 shadow-md hover:shadow-lg shadow-[#5B4FE9]/20 cursor-pointer"
                title="Post an operational challenge and receive technical proposals"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post a Problem</span>
              </button>

              {/* Secondary CTA: Explore Open Problems */}
              <button
                onClick={onExploreProblems}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#D6D4EA] text-[#14162B] font-semibold text-sm hover:border-[#5B4FE9] hover:text-[#5B4FE9] hover:bg-[#EFEDFC]/60 transition-all duration-150 cursor-pointer"
              >
                <span>Explore Open Problems</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Trust Metadata */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6B6D82]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1FAE7C]" />
                100% Free to post for MSMEs & non-profits
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5B4FE9]" />
                Milestone-protected honorarium escrow
              </span>
            </div>
          </div>

          {/* Right Column: Interactive 4-Stage Problem-to-Solution Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E8E7F3] rounded-2xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(20,22,43,0.04),0_12px_32px_-12px_rgba(20,22,43,0.09)]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F0EFF8]">
                <div>
                  <h3 className="font-display text-sm font-bold text-[#14162B]">
                    Problem-to-Deployment Pipeline
                  </h3>
                  <p className="text-[11px] text-[#8B8DA3]">
                    How challenges move from post to verified prototype
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#5B4FE9] bg-[#EFEDFC] px-2.5 py-1 rounded-lg">
                  4 Steps
                </span>
              </div>

              <div className="space-y-3.5">
                {steps.map((step, idx) => {
                  const isHovered = activeStep === idx;
                  return (
                    <div
                      key={step.num}
                      onMouseEnter={() => setActiveStep(idx)}
                      onMouseLeave={() => setActiveStep(null)}
                      onClick={() => setActiveStep(isHovered ? null : idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isHovered
                          ? 'border-[#5B4FE9] bg-[#EFEDFC]/40 shadow-2xs'
                          : 'border-transparent hover:border-[#E8E7F3] hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg font-display text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                            isHovered
                              ? 'bg-[#5B4FE9] text-white'
                              : 'bg-[#EFEDFC] text-[#5B4FE9]'
                          }`}
                        >
                          {step.num}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#14162B] leading-tight mb-1">
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-[#6B6D82] leading-snug">
                            {step.desc}
                          </p>
                          {isHovered && (
                            <div className="mt-2 text-[11px] text-[#4A4C63] bg-white p-2.5 rounded-lg border border-[#D6D4EA] animate-in fade-in duration-150">
                              {step.detail}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* CENTERPIECE CALLOUT: Dedicated Center Webpage Button & Form Trigger */}
        {/* ======================================================== */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#14162B] via-[#1E2140] to-[#2E2863] text-white p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden mb-12">
          {/* Subtle glow accent */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#5B4FE9]/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="max-w-2xl text-center lg:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-emerald-300 border border-white/10 mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>Need a Solution for Your Facility or Business?</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display tracking-tight text-white">
                Submit Your Problem Details & Get Working Prototypes
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Publish your operational bottlenecks in IoT, Agritech, Healthcare, or Automation. Over 1,200+ verified engineering innovators are ready to collaborate and build.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1FAE7C]" />
                  Average 3 proposals in 48h
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1FAE7C]" />
                  Honorariums from ₹5,000+
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1FAE7C]" />
                  Dedicated technical mentors
                </span>
              </div>
            </div>

            {/* THE PROMINENT CENTER BUTTON */}
            <div className="flex flex-col items-center sm:items-end shrink-0">
              <button
                onClick={onPostProblem}
                className="px-7 py-4 rounded-xl bg-[#5B4FE9] hover:bg-[#4C40DC] active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-[#5B4FE9]/40 hover:shadow-[#5B4FE9]/60 transition-all flex items-center gap-2.5 group cursor-pointer"
                title="Click to open the form and post your challenge details"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                <span>Post Problem Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-[10px] text-slate-400 mt-2">
                Takes 2–3 minutes · All details can be edited anytime
              </span>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Statistics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E8E7F3] text-center shadow-2xs">
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#14162B] tabular-nums mb-1">
              ₹18.5L+
            </div>
            <div className="text-xs text-[#6B6D82] font-medium">
              Committed Honorarium Pool
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E8E7F3] text-center shadow-2xs">
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#5B4FE9] tabular-nums mb-1">
              180+
            </div>
            <div className="text-xs text-[#6B6D82] font-medium">
              Live Verified Challenges
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E8E7F3] text-center shadow-2xs">
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#1FAE7C] tabular-nums mb-1">
              94.2%
            </div>
            <div className="text-xs text-[#6B6D82] font-medium">
              Prototype Delivery Rate
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E8E7F3] text-center shadow-2xs">
            <div className="font-display text-2xl sm:text-3xl font-bold text-[#14162B] tabular-nums mb-1">
              48h
            </div>
            <div className="text-xs text-[#6B6D82] font-medium">
              Avg. Proposal Turnaround
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
