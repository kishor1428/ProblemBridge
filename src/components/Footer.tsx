import React from 'react';

interface FooterProps {
  onOpenPostProblem: () => void;
  onExploreProblems: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPostProblem,
  onExploreProblems,
}) => {
  return (
    <footer className="bg-white border-t border-[#E8E7F3] pt-12 pb-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E8E7F3]">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <svg
                className="w-7 h-7"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="7" cy="16" r="5" fill="#5B4FE9" />
                <circle cx="25" cy="16" r="5" fill="#1FAE7C" />
                <rect x="11" y="14.5" width="10" height="3" rx="1.5" fill="#8B7FF5" />
              </svg>
              <span className="font-display text-xl font-semibold text-[#14162B]">
                ProblemBridge
              </span>
            </div>
            <p className="text-xs text-[#4A4C63] leading-relaxed">
              Connecting verified problem owners with student engineers, builders, and developers to craft meaningful, functional solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#4A4C63]">
              <li>
                <button
                  onClick={onExploreProblems}
                  className="hover:text-[#5B4FE9] transition-colors"
                >
                  IoT & Embedded Systems
                </button>
              </li>
              <li>
                <button
                  onClick={onExploreProblems}
                  className="hover:text-[#5B4FE9] transition-colors"
                >
                  Healthcare & Polyclinic Tech
                </button>
              </li>
              <li>
                <button
                  onClick={onExploreProblems}
                  className="hover:text-[#5B4FE9] transition-colors"
                >
                  Agritech & Cold Chain
                </button>
              </li>
              <li>
                <button
                  onClick={onExploreProblems}
                  className="hover:text-[#5B4FE9] transition-colors"
                >
                  MSME & Textile Automation
                </button>
              </li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-3">
              For Organizations
            </h4>
            <ul className="space-y-2 text-xs text-[#4A4C63]">
              <li>
                <button
                  onClick={onOpenPostProblem}
                  className="hover:text-[#5B4FE9] transition-colors"
                >
                  Post an Operational Challenge
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#5B4FE9] transition-colors">
                  How Collaboration Works
                </a>
              </li>
              <li>
                <span className="text-[#8B8DA3]">IP & Hardware Ownership Guide</span>
              </li>
              <li>
                <span className="text-[#8B8DA3]">Milestone-Based Escrow</span>
              </li>
            </ul>
          </div>

          {/* Regional Innovation Hubs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-3">
              Regional Hubs
            </h4>
            <p className="text-xs text-[#4A4C63] leading-relaxed mb-2">
              Coimbatore · Erode · Salem · Tiruppur · Madurai · Chennai
            </p>
            <p className="text-[11px] text-[#8B8DA3]">
              Partnered with technical colleges, MSME associations, and agricultural producer collectives.
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8B8DA3]">
          <div>
            © {new Date().getFullYear()} ProblemBridge. Real Problems. Real Builders. Real Solutions.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#14162B]">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-[#14162B]">Builder Code of Conduct</span>
            <span>·</span>
            <span className="hover:text-[#14162B]">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
