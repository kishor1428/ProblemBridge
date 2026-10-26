import React, { useState, useMemo } from 'react';
import { Problem } from '../types';
import { ProblemCard } from './ProblemCard';
import { SlidersHorizontal, ArrowUpDown, Plus } from 'lucide-react';

interface ProblemsSectionProps {
  problems: Problem[];
  searchQuery: string;
  onClearSearch: () => void;
  onSelectProblem: (problem: Problem) => void;
  onQuickApply: (problem: Problem, e: React.MouseEvent) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onPostProblem?: () => void;
  onViewOwnerProfile?: (problem: Problem, e: React.MouseEvent) => void;
  connectionRequests?: import('../types').ConnectionRequest[];
}

export const ProblemsSection: React.FC<ProblemsSectionProps> = ({
  problems,
  searchQuery,
  onClearSearch,
  onSelectProblem,
  onQuickApply,
  selectedCategory: controlledCategory,
  onSelectCategory,
  onPostProblem,
  onViewOwnerProfile,
  connectionRequests = [],
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('All');
  const selectedCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;

  const handleSelectCategory = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const [sortBy, setSortBy] = useState<'recent' | 'budget-high' | 'interested'>('recent');
  const [showAllProblems, setShowAllProblems] = useState<boolean>(false);

  const categories = [
    'All',
    'IoT',
    'Healthcare Tech',
    'Agritech',
    'MSME Tech',
    'Smart City',
    'Clean Energy'
  ];

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) => {
        if (!p) return false;
        const pCategory = p.category || '';
        const pDomain = p.domain || '';
        const pTitle = p.title || '';
        const pLoc = p.location || '';
        const pOrg = p.organization || '';
        const pSkills = Array.isArray(p.skills) ? p.skills : [];

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' ||
          pCategory.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          pDomain.toLowerCase().includes(selectedCategory.toLowerCase());

        // Search query filter (title, skills, domain, location, organization)
        if (!searchQuery.trim()) return matchesCategory;

        const query = searchQuery.toLowerCase();
        const matchesQuery =
          pTitle.toLowerCase().includes(query) ||
          pDomain.toLowerCase().includes(query) ||
          pCategory.toLowerCase().includes(query) ||
          pLoc.toLowerCase().includes(query) ||
          pOrg.toLowerCase().includes(query) ||
          pSkills.some((s) => s && s.toLowerCase().includes(query));

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        const aBudget = typeof a.budget === 'number' ? a.budget : Number(a.budget) || 0;
        const bBudget = typeof b.budget === 'number' ? b.budget : Number(b.budget) || 0;
        if (sortBy === 'budget-high') return bBudget - aBudget;
        if (sortBy === 'interested') return (b.interestedCount || 0) - (a.interestedCount || 0);
        return 0; // Default order
      });
  }, [problems, selectedCategory, searchQuery, sortBy]);

  // If not showAllProblems and not searching, show featured (first 6 or 3 depending on state)
  const displayedProblems = showAllProblems || searchQuery.trim() !== ''
    ? filteredProblems
    : filteredProblems.slice(0, 6);

  return (
    <section id="problems-section" className="py-12 sm:py-16">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase font-semibold text-[#5B4FE9] tracking-wider mb-2">
              Featured Problems
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-[#14162B] mb-0">
              Problems looking for builders right now
            </h2>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={() => setShowAllProblems((prev) => !prev)}
              className="inline-flex items-center justify-center px-4 py-2 border border-[#D6D4EA] rounded-xl text-xs sm:text-sm font-semibold text-[#14162B] hover:border-[#5B4FE9] hover:text-[#5B4FE9] hover:bg-[#EFEDFC] transition-colors cursor-pointer"
            >
              {showAllProblems ? 'Show Featured' : `View all (${problems.length}+)`}
            </button>

            {onPostProblem && (
              <button
                onClick={onPostProblem}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B4FE9] text-white text-xs sm:text-sm font-semibold hover:bg-[#4C40DC] transition-colors shadow-xs cursor-pointer"
                title="Post problem challenge details"
              >
                <Plus className="w-4 h-4" />
                <span>Post Problem</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 mb-6 border-b border-[#E8E7F3]/80">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#5B4FE9] text-white shadow-xs'
                      : 'bg-white text-[#4A4C63] border border-[#E8E7F3] hover:border-[#8B7FF5] hover:text-[#14162B]'
                  }`}
                >
                  {cat === 'All' ? `All (${problems.length})` : cat}
                </button>
              );
            })}
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-[#8B8DA3] flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium text-[#14162B] bg-white border border-[#E8E7F3] rounded-md px-2.5 py-1.5 outline-none focus:border-[#5B4FE9]"
            >
              <option value="recent">Recently Added</option>
              <option value="budget-high">Highest Honorarium (₹)</option>
              <option value="interested">Most Interested</option>
            </select>
          </div>
        </div>

        {/* Active search filter notice */}
        {searchQuery && (
          <div className="mb-4 flex items-center justify-between bg-[#EFEDFC] px-4 py-2.5 rounded-lg text-xs text-[#5B4FE9]">
            <span>
              Filtering by search query: <strong>"{searchQuery}"</strong> ({filteredProblems.length} results)
            </span>
            <button
              onClick={onClearSearch}
              className="font-semibold underline hover:text-[#4C40DC]"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Problem Cards Grid */}
        {displayedProblems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProblems.map((problem) => {
              const req = connectionRequests.find((r) => r.problemId === problem.id);
              return (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onSelect={onSelectProblem}
                  onQuickApply={onQuickApply}
                  onViewOwnerProfile={onViewOwnerProfile}
                  connectionRequest={req}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#E8E7F3] rounded-2xl p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#EFEDFC] text-[#5B4FE9] flex items-center justify-center mx-auto mb-3 text-xl">
              🔍
            </div>
            <h3 className="font-display text-lg font-semibold text-[#14162B] mb-2">
              No matching problems found
            </h3>
            <p className="text-xs text-[#4A4C63] mb-4">
              We couldn't find any challenges matching your current search "{searchQuery}" in category "{selectedCategory}".
            </p>
            <button
              onClick={() => {
                onClearSearch();
                handleSelectCategory('All');
              }}
              className="px-4 py-2 rounded-lg bg-[#5B4FE9] text-white text-xs font-semibold hover:bg-[#4C40DC] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
