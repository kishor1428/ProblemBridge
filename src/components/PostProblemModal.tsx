import React, { useState, useEffect } from 'react';
import { Problem, UserProfile } from '../types';
import { X, Check, Plus, AlertCircle, Sparkles, Building, MapPin, UserCheck, ArrowRight } from 'lucide-react';

interface PostProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProblem: (newProblem: Problem) => void;
  userProfile?: UserProfile;
  onProblemCreatedAndRedirect?: (newProblem: Problem) => void;
  onOpenFullPagePost?: () => void;
}

export const PostProblemModal: React.FC<PostProblemModalProps> = ({
  isOpen,
  onClose,
  onAddProblem,
  userProfile,
  onProblemCreatedAndRedirect,
  onOpenFullPagePost,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IoT');
  const [domain, setDomain] = useState('IoT & Embedded Systems');
  const [location, setLocation] = useState('Coimbatore, Tamil Nadu');
  const [organization, setOrganization] = useState('');
  const [organizationType, setOrganizationType] = useState<Problem['organizationType']>('MSME & Industry');
  const [budget, setBudget] = useState(25000);
  const [timeline, setTimeline] = useState('3 - 4 weeks');
  const [urgency, setUrgency] = useState<Problem['urgency']>('High (Immediate)');
  const [description, setDescription] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [deliverableType, setDeliverableType] = useState<Problem['deliverableType']>('Hardware Prototype');
  const [mentorName, setMentorName] = useState('Er. R. Ramesh');
  const [mentorTitle, setMentorTitle] = useState('Operations & Technical Lead');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['ESP32', 'Sensors']);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    'Bench prototype test demo on-site',
    'Circuit schematic and firmware documentation',
    'Full bill of materials under agreed target budget'
  ]);
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Auto-fill from user registration details
  useEffect(() => {
    if (userProfile && isOpen) {
      if (userProfile.fullName) setMentorName(userProfile.fullName);
      if (userProfile.institution) setOrganization(userProfile.institution);
      if (userProfile.city && userProfile.state) setLocation(`${userProfile.city}, ${userProfile.state}`);
      if (userProfile.accountType === 'Student Builder / Innovator') {
        setMentorTitle(`${userProfile.department || 'Engineering'} Project Lead`);
      } else {
        setMentorTitle('Operations & Technical Lead');
      }
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim() || !description.trim()) {
      setError('Please fill in Problem Title, Organization, and Description.');
      return;
    }

    const newProblem: Problem = {
      id: `pb-${Date.now()}`,
      title: title.trim(),
      category: category || 'IoT',
      domain: domain || `${category} Systems`,
      location: location.trim() || 'Tamil Nadu',
      organization: organization.trim(),
      organizationType,
      postedTime: 'Just now',
      budget: Number(budget) || 15000,
      interestedCount: 0,
      skills: skills.length > 0 ? skills : ['Engineering', 'Prototyping'],
      description: description.trim(),
      painPoint: painPoint.trim() || description.slice(0, 100),
      deliverableType,
      deliverables: deliverables.length > 0 ? deliverables : ['Working functional solution'],
      timeline: timeline.trim() || '3 - 4 weeks',
      urgency,
      status: 'Open',
      mentorName: mentorName.trim() || userProfile?.fullName || 'Problem Host',
      mentorTitle: mentorTitle.trim() || 'Operations Lead',
      ownerEmail: userProfile?.email || 'host@problembridge.org',
      ownerId: userProfile?.id || 'usr-sv-2026',
      ownerName: mentorName.trim() || userProfile?.fullName || 'Problem Host',
      ownerTitle: mentorTitle.trim() || 'Operations Lead',
      ownerOrg: organization.trim(),
      ownerCity: location.split(',')[0]?.trim() || 'Coimbatore',
      ownerState: location.split(',')[1]?.trim() || 'Tamil Nadu',
      ownerVerificationStatus: 'Verified Official',
      ownerResponseTime: 'Usually responds in ~1 hour',
      ownerActiveProjects: 1,
    };

    onAddProblem(newProblem);
    onClose();
    if (onProblemCreatedAndRedirect) {
      onProblemCreatedAndRedirect(newProblem);
    }
  };

  const handleAIFormulateProblem = async () => {
    if (!description.trim() && !title.trim()) {
      setError('Please type a rough description or title first for the AI Assistant to refine.');
      return;
    }
    setAiLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/formulate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roughDescription: description || title,
          organizationType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.refinedTitle) setTitle(data.refinedTitle);
        if (data.painPoint) setPainPoint(data.painPoint);
        if (data.suggestedCategory) setCategory(data.suggestedCategory);
        if (Array.isArray(data.suggestedSkills) && data.suggestedSkills.length > 0) {
          setSkills(Array.from(new Set([...skills, ...data.suggestedSkills])));
        }
        if (Array.isArray(data.deliverables) && data.deliverables.length > 0) {
          setDeliverables(data.deliverables);
        }
        if (data.deliverableType) setDeliverableType(data.deliverableType);
      }
    } catch (err) {
      console.warn('AI formulate problem failed:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E7F3] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#5B4FE9]">
              Post a Problem Challenge
            </div>
            <h3 className="font-display text-lg font-semibold text-[#14162B]">
              Connect with Real Builders & Innovators
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {onOpenFullPagePost && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullPagePost();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D6D4EA] text-xs font-semibold text-[#5B4FE9] hover:bg-[#EFEDFC] transition-colors cursor-pointer"
              >
                <span>Open Full Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Poster Identity Banner */}
        {userProfile && (
          <div className="px-6 py-2.5 bg-[#EFEDFC]/70 border-b border-[#D6D4EA] flex items-center justify-between text-xs text-[#5B4FE9]">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#1FAE7C]" />
              <span>
                Posting challenge as <strong>{userProfile.fullName}</strong> ({userProfile.institution})
              </span>
            </div>
            <span className="text-[10px] bg-white text-[#1FAE7C] font-bold px-2 py-0.5 rounded-md border border-[#1FAE7C]/30">
              Authorized Poster ✓
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#FBE9EC] border border-[#D6455A]/30 text-[#D6455A] rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Automated Boiler Pressure Alert System"
              className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
            />
          </div>

          {/* Category & Domain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value === 'IoT') setDomain('IoT & Embedded Systems');
                  else if (e.target.value === 'Healthcare Tech') setDomain('Healthcare & MedTech');
                  else if (e.target.value === 'Agritech') setDomain('Agriculture & Agritech');
                  else if (e.target.value === 'MSME Tech') setDomain('Industrial Automation & MSME');
                  else if (e.target.value === 'Smart City') setDomain('Smart Cities & Civic Tech');
                  else if (e.target.value === 'Clean Energy') setDomain('Clean Energy & Power');
                }}
                className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              >
                <option value="IoT">IoT</option>
                <option value="Healthcare Tech">Healthcare Tech</option>
                <option value="Agritech">Agritech</option>
                <option value="MSME Tech">MSME Tech</option>
                <option value="Smart City">Smart City</option>
                <option value="Clean Energy">Clean Energy</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                Domain / Field
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. Industrial Automation"
                className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              />
            </div>
          </div>

          {/* Organization & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                Organization / Department Name *
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Coimbatore Foundry Works or PSG Tech Maker Lab"
                className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                Location (City, State) *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Coimbatore, Tamil Nadu"
                className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              />
            </div>
          </div>

          {/* Description with AI Assistant button */}
          <div>
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <label className="block font-semibold uppercase tracking-wider text-[#14162B]">
                Operational Problem Description *
              </label>
              <button
                type="button"
                onClick={handleAIFormulateProblem}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EFEDFC] hover:bg-[#E3E0FA] text-[#5B4FE9] text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiLoading ? 'Refining...' : 'AI Problem Assistant'}
              </button>
            </div>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurs right now in your facility, field, hospital, lab, or municipality..."
              className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
            />
          </div>

          {/* Current Pain Point */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
              Financial or Operational Pain Point
            </label>
            <input
              type="text"
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder="e.g. Causes ₹40,000 in monthly scrap losses and safety risks"
              className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
            />
          </div>

          {/* Budget & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                Honorarium Budget (₹) *
              </label>
              <input
                type="number"
                min={5000}
                step={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                Expected Timeline
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. 3 - 4 weeks"
                className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              >
                <option value="High (Immediate)">High (Immediate)</option>
                <option value="Moderate (Next 30 Days)">Moderate (30 Days)</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
              Required Skills / Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-[#EFEDFC] text-[#5B4FE9] px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type skill (e.g. Arduino, Python) and press Enter..."
              className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
            />
          </div>

          {/* Mentor contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                Contact Person / Problem Lead Name
              </label>
              <input
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                placeholder="e.g. Dr. Anand K. or Sanjay Verma"
                className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                Designation / Department Role
              </label>
              <input
                type="text"
                value={mentorTitle}
                onChange={(e) => setMentorTitle(e.target.value)}
                placeholder="e.g. Technical Director or Student Project Lead"
                className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#E8E7F3] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-[#4A4C63] hover:text-[#14162B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#5B4FE9] text-white font-semibold hover:bg-[#4C40DC] shadow-xs transition-colors"
            >
              Publish Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
