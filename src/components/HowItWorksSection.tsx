import React, { useState } from 'react';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<'builders' | 'owners'>('builders');

  const nodes = [
    {
      id: 0,
      icon: '📝',
      label: 'Post a Problem',
      builderNote: 'Organizations submit unaddressed operational bottlenecks with real field requirements.',
      ownerNote: 'Specify your challenge, location, constraints, and proposed honorarium in under 5 minutes.'
    },
    {
      id: 1,
      icon: '🔍',
      label: 'Discover Problems',
      builderNote: 'Filter by IoT, AI, Web, Agritech, or your home district to find challenges you have skills to solve.',
      ownerNote: 'Your challenge is published to vetted engineering students, maker labs, and software developers.'
    },
    {
      id: 2,
      icon: '🤝',
      label: 'Connect & Collaborate',
      builderNote: 'Submit your solution architecture, discuss hardware constraints directly, and align on scope.',
      ownerNote: 'Review builder proposals, schedule discovery calls, and select the most capable engineering team.'
    },
    {
      id: 3,
      icon: '🛠️',
      label: 'Build the Solution',
      builderNote: 'Fabricate hardware, write firmware or software, deploy on-site, and receive compensation.',
      ownerNote: 'Test working prototypes in your facility, witness immediate operational gains, and award honorarium.'
    }
  ];

  return (
    <section id="how-it-works" className="bg-white border-y border-[#E8E7F3] py-12 sm:py-16">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase font-semibold text-[#5B4FE9] tracking-wider mb-2">
              How It Works
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-[#14162B]">
              From a real problem to a working solution
            </h2>
          </div>

          {/* Perspective Switcher */}
          <div className="inline-flex items-center p-1 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveRole('builders')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeRole === 'builders'
                  ? 'bg-white text-[#5B4FE9] shadow-xs'
                  : 'text-[#4A4C63] hover:text-[#14162B]'
              }`}
            >
              For Builders
            </button>
            <button
              onClick={() => setActiveRole('owners')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeRole === 'owners'
                  ? 'bg-white text-[#5B4FE9] shadow-xs'
                  : 'text-[#4A4C63] hover:text-[#14162B]'
              }`}
            >
              For Organizations
            </button>
          </div>
        </div>

        {/* Bridge Flow Stepper matching screenshot */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap lg:flex-nowrap">
          {nodes.map((node, index) => {
            const isSelected = activeStep === index;
            return (
              <React.Fragment key={node.label}>
                <div
                  onClick={() => setActiveStep(isSelected ? null : index)}
                  className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
                >
                  <div
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#5B4FE9] text-white ring-4 ring-[#EFEDFC] scale-110'
                        : 'bg-[#EFEDFC] text-[#14162B] group-hover:bg-[#E0DCFC] group-hover:scale-105 shadow-[0_4px_12px_rgba(91,79,233,0.12)]'
                    }`}
                  >
                    <span>{node.icon}</span>
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-semibold transition-colors text-center ${
                      isSelected ? 'text-[#5B4FE9]' : 'text-[#4A4C63] group-hover:text-[#14162B]'
                    }`}
                  >
                    {node.label}
                  </span>
                </div>

                {/* Dashed connector line with green center dot */}
                {index < nodes.length - 1 && (
                  <div className="hidden sm:flex flex-1 items-center min-w-[32px] mx-2">
                    <div className="w-full h-[2px] bg-[repeating-linear-gradient(90deg,#D6D4EA_0_6px,transparent_6px_12px)] relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#1FAE7C]"></div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Detail Card depending on selection */}
        <div className="mt-8 bg-[#FAFAF9] border border-[#E8E7F3] rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#4A4C63]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#14162B]">
                {activeStep !== null ? nodes[activeStep].label : 'Step Highlights'}:
              </span>
              <span>
                {activeStep !== null
                  ? activeRole === 'builders'
                    ? nodes[activeStep].builderNote
                    : nodes[activeStep].ownerNote
                  : activeRole === 'builders'
                  ? 'Select any step above to explore how builders match, pitch, and execute verified real-world engineering solutions.'
                  : 'Select any step above to discover how organizations post challenges, vet proposals, and get customized working prototypes.'}
              </span>
            </div>
            {activeStep !== null && (
              <button
                onClick={() => setActiveStep(null)}
                className="text-xs text-[#5B4FE9] hover:underline self-end sm:self-auto"
              >
                Show overview
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
