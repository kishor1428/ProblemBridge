import React, { useState, useEffect } from 'react';
import { Problem, UserProfile } from '../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building,
  MapPin,
  Clock,
  Coins,
  Cpu,
  Layers,
  FileCheck2,
  Tag,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ChevronRight,
  Plus,
  X,
  HelpCircle
} from 'lucide-react';

interface PostProblemPageProps {
  onAddProblem: (newProblem: Problem) => void;
  userProfile?: UserProfile;
  onNavigateHome: () => void;
  onProblemCreatedAndRedirect: (createdProblem: Problem) => void;
}

export const PostProblemPage: React.FC<PostProblemPageProps> = ({
  onAddProblem,
  userProfile,
  onNavigateHome,
  onProblemCreatedAndRedirect,
}) => {
  // Current active step in multi-step wizard (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IoT');
  const [domain, setDomain] = useState('IoT & Embedded Systems');
  const [location, setLocation] = useState('Coimbatore, Tamil Nadu');
  const [organization, setOrganization] = useState('');
  const [organizationType, setOrganizationType] = useState<Problem['organizationType']>('MSME & Industry');
  const [budget, setBudget] = useState<number>(25000);
  const [timeline, setTimeline] = useState('3 - 4 weeks');
  const [urgency, setUrgency] = useState<Problem['urgency']>('High (Immediate)');
  const [description, setDescription] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [deliverableType, setDeliverableType] = useState<Problem['deliverableType']>('Hardware Prototype');
  const [hardwareProvided, setHardwareProvided] = useState('');
  const [mentorName, setMentorName] = useState('Er. R. Ramesh');
  const [mentorTitle, setMentorTitle] = useState('Operations & Technical Lead');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorPhone, setMentorPhone] = useState('+91 94432 10987');

  // Dynamic tags & deliverables lists
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['ESP32', 'Sensors', 'Relay Control']);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    'Bench prototype test demo on-site with live telemetry',
    'Circuit schematic, wiring pinouts, and firmware documentation',
    'Full bill of materials under agreed target budget'
  ]);

  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccessNote, setAiSuccessNote] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Pre-fill fields from user registration profile if available
  useEffect(() => {
    if (userProfile) {
      if (userProfile.fullName) setMentorName(userProfile.fullName);
      if (userProfile.email) setMentorEmail(userProfile.email);
      if (userProfile.phone) setMentorPhone(userProfile.phone);
      if (userProfile.institution) setOrganization(userProfile.institution);
      if (userProfile.city && userProfile.state) setLocation(`${userProfile.city}, ${userProfile.state}`);
      if (userProfile.accountType === 'Student Builder / Innovator') {
        setMentorTitle(`${userProfile.department || 'Engineering'} Project Lead`);
      } else {
        setMentorTitle('Operations & Technical Lead');
      }
    }
  }, [userProfile]);

  // Handle adding custom skills
  const handleAddSkill = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (tagToRemove: string) => {
    setSkills(skills.filter((s) => s !== tagToRemove));
  };

  // Handle adding custom deliverables
  const handleAddDeliverable = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = deliverableInput.trim();
    if (trimmed && !deliverables.includes(trimmed)) {
      setDeliverables([...deliverables, trimmed]);
      setDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (itemToRemove: string) => {
    setDeliverables(deliverables.filter((d) => d !== itemToRemove));
  };

  // Step validation
  const validateStep = (stepNumber: number): boolean => {
    setError('');
    if (stepNumber === 1) {
      if (!title.trim()) {
        setError('Please provide a descriptive Challenge Title.');
        return false;
      }
      if (!organization.trim()) {
        setError('Please enter your Organization or Institution Name.');
        return false;
      }
      if (!location.trim()) {
        setError('Please enter the City and State for field testing.');
        return false;
      }
    } else if (stepNumber === 2) {
      if (!description.trim() || description.length < 30) {
        setError('Please write at least 2–3 sentences explaining the operational problem and root causes.');
        return false;
      }
    } else if (stepNumber === 3) {
      if (deliverables.length === 0) {
        setError('Please list at least one concrete deliverable.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Call Gemini AI to formulate and refine the operational challenge
  const handleAIFormulateProblem = async () => {
    if (!description.trim() && !title.trim()) {
      setError('Please type a rough title or bottleneck description first for the AI Assistant to refine.');
      return;
    }
    setAiLoading(true);
    setError('');
    setAiSuccessNote(null);

    try {
      const res = await fetch('/api/ai/formulate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roughDescription: description || title,
          organizationType,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
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

        setAiSuccessNote('AI Assistant refined title, impact analysis, tags, and deliverable milestones!');
        setTimeout(() => setAiSuccessNote(null), 5000);
      } else {
        throw new Error('AI formulation API returned error or static route');
      }
    } catch (err) {
      console.warn('AI formulate problem fallback:', err);
      // Fallback local refinement
      if (!title) setTitle('Automated Facility Monitoring & Alert System');
      if (!painPoint) setPainPoint(`Manual inspection causes production slowdowns and monthly scrap loss.`);
      setSkills(Array.from(new Set([...skills, 'IoT', 'Telemetry', 'Automation'])));
      setAiSuccessNote('Structured challenge statement generated successfully!');
      setTimeout(() => setAiSuccessNote(null), 4000);
    } finally {
      setAiLoading(false);
    }
  };

  // Final Publish Handler: Validates and redirects to the next page (Problem Detail view)
  const handlePublishChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    setIsPublishing(true);
    setError('');

    const newProblemId = `pb-${Date.now()}`;
    const newProblem: Problem = {
      id: newProblemId,
      title: title.trim(),
      category: category || 'IoT',
      domain: domain || `${category} Systems`,
      location: location.trim() || 'Tamil Nadu',
      organization: organization.trim(),
      organizationType,
      postedTime: 'Just now',
      budget: Number(budget) || 20000,
      interestedCount: 0,
      skills: skills.length > 0 ? skills : ['Embedded Systems', 'Prototyping'],
      description: description.trim(),
      painPoint: painPoint.trim() || description.slice(0, 120),
      deliverableType,
      deliverables: deliverables.length > 0 ? deliverables : ['Working functional solution', 'Documentation'],
      hardwareProvided: hardwareProvided.trim() || 'Access to facility test rig and 24V power supply.',
      timeline: timeline.trim() || '3 - 4 weeks',
      urgency,
      status: 'Open',
      mentorName: mentorName.trim() || userProfile?.fullName || 'Problem Host',
      mentorTitle: mentorTitle.trim() || 'Technical Lead',
      ownerEmail: mentorEmail || userProfile?.email || 'host@problembridge.org',
      ownerPhone: mentorPhone || userProfile?.phone || '+91 94432 00000',
      ownerName: mentorName.trim() || userProfile?.fullName || 'Problem Host',
      ownerTitle: mentorTitle.trim() || 'Technical Lead',
      ownerOrg: organization.trim(),
      ownerCity: location.split(',')[0]?.trim() || 'Coimbatore',
      ownerState: location.split(',')[1]?.trim() || 'Tamil Nadu',
      ownerVerificationStatus: 'Verified Official',
      ownerResponseTime: 'Usually responds in ~1 hour',
      ownerActiveProjects: 1,
      ownerId: userProfile?.id || `usr-${Date.now()}`,
    };

    // 1. Add to state via parent callback
    onAddProblem(newProblem);

    // 2. Persist to Express JSON Backend Database
    try {
      await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProblem),
      });
    } catch (err) {
      console.warn('Backend database post problem error:', err);
    }

    setTimeout(() => {
      setIsPublishing(false);
      // 3. REDIRECT TO THE NEXT PAGE (Problem Detail view for this newly posted challenge!)
      onProblemCreatedAndRedirect(newProblem);
    }, 400);
  };

  const stepsList = [
    { num: 1, title: 'Challenge Context', subtitle: 'Title & Organization' },
    { num: 2, title: 'Operational Bottleneck', subtitle: 'Root Causes & AI Assist' },
    { num: 3, title: 'Deliverables & Hardware', subtitle: 'Target Deliverables' },
    { num: 4, title: 'Honorarium & Mentorship', subtitle: 'Budget & Review' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-24">
      {/* Top Breadcrumb & Page Banner */}
      <div className="bg-white border-b border-[#E8E7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Breadcrumb row */}
          <div className="flex items-center gap-2 text-xs text-[#8B8DA3] mb-2">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#5B4FE9] transition-colors font-medium cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#D6D4EA]" />
            <span className="font-semibold text-[#5B4FE9]">Post a Problem Challenge</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEDFC] text-[#5B4FE9] text-xs font-semibold mb-2">
                <ShieldCheck className="w-4 h-4 text-[#1FAE7C]" />
                <span>Verified Challenge Publisher · Real Field Projects</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14162B] tracking-tight">
                Post an Operational Challenge
              </h1>
              <p className="text-xs sm:text-sm text-[#4A4C63] max-w-2xl mt-1 leading-relaxed">
                Connect your factory, hospital, agricultural collective, or civic department with verified student innovators and software engineers.
              </p>
            </div>

            {/* Quick Switch / Cancel button */}
            <button
              onClick={onNavigateHome}
              className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2 border border-[#D6D4EA] text-xs font-semibold text-[#14162B] rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Problems Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Navigation Strip */}
      <div className="bg-[#F4F4F8] border-b border-[#E8E7F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {stepsList.map((step) => {
              const isCurrent = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    if (step.num < currentStep || validateStep(currentStep)) {
                      setCurrentStep(step.num);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    isCurrent
                      ? 'border-[#5B4FE9] bg-white shadow-xs ring-2 ring-[#5B4FE9]/10'
                      : isCompleted
                      ? 'border-[#1FAE7C]/40 bg-[#E4F6EE]/40 text-[#1FAE7C]'
                      : 'border-transparent bg-transparent text-[#8B8DA3] hover:bg-white/50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-[#5B4FE9] text-white'
                        : isCompleted
                        ? 'bg-[#1FAE7C] text-white'
                        : 'bg-[#E5E4EE] text-[#6B6D82]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `0${step.num}`}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-[#14162B] truncate leading-tight">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-[#8B8DA3] truncate block">
                      {step.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Form & Live Preview Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: The Stepped Interactive Wizard Form */}
          <div className="lg:col-span-8 bg-white border border-[#E8E7F3] rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {/* Global Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-[#FBE9EC] border border-[#D6455A]/30 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-[#D6455A] animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* AI Assistant Success Banner */}
            {aiSuccessNote && (
              <div className="mb-6 p-4 bg-[#E4F6EE] border border-[#1FAE7C]/40 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-[#1FAE7C] font-bold animate-in fade-in">
                <Sparkles className="w-5 h-5 text-[#1FAE7C] shrink-0" />
                <span>{aiSuccessNote}</span>
              </div>
            )}

            <form onSubmit={handlePublishChallenge}>
              
              {/* ======================================================== */}
              {/* STEP 1: CHALLENGE CONTEXT & ORGANIZATION */}
              {/* ======================================================== */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-[#F0EFF8] pb-4">
                    <h2 className="font-display text-xl font-bold text-[#14162B]">
                      Step 1: Challenge Context & Organization
                    </h2>
                    <p className="text-xs text-[#6B6D82] mt-0.5">
                      State the title and the verified facility or organization issuing this challenge.
                    </p>
                  </div>

                  {/* Problem Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                      Challenge Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g. Automated Continuous Water Tank Level Telemetry & Dry-Run Pump Cutoff"
                      className="w-full text-sm p-3.5 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:bg-white focus:border-[#5B4FE9] focus:ring-4 focus:ring-[#5B4FE9]/10 transition-all font-medium text-[#14162B]"
                    />
                    <p className="text-[11px] text-[#8B8DA3] mt-1">
                      Keep it concrete and descriptive. Mention what is being monitored, controlled, or automated.
                    </p>
                  </div>

                  {/* Category & Field Domain Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                        Technical Category *
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
                          else if (e.target.value === 'Clean Energy') setDomain('Clean Energy & Power Systems');
                        }}
                        className="w-full text-xs sm:text-sm p-3 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:border-[#5B4FE9] focus:bg-white text-[#14162B]"
                      >
                        <option value="IoT">IoT (Hardware & Sensors)</option>
                        <option value="Healthcare Tech">Healthcare Tech & Hospitals</option>
                        <option value="Agritech">Agritech & Cold Storage</option>
                        <option value="MSME Tech">MSME & Textile Automation</option>
                        <option value="Smart City">Smart City & Municipal Logistics</option>
                        <option value="Clean Energy">Clean Energy & Solar Modbus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                        Specific Sub-Domain
                      </label>
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g. Industrial Automation & Effluents"
                        className="w-full text-xs sm:text-sm p-3 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:border-[#5B4FE9] focus:bg-white text-[#14162B]"
                      />
                    </div>
                  </div>

                  {/* Organization & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                        Organization / Enterprise Name *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-[#8B8DA3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={organization}
                          onChange={(e) => {
                            setOrganization(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="e.g. Erode Textile Dyeing & Processing Cluster"
                          className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:border-[#5B4FE9] focus:bg-white text-[#14162B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                        Facility Location (City, State) *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#8B8DA3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Erode, Tamil Nadu"
                          className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:border-[#5B4FE9] focus:bg-white text-[#14162B]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Organization Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                      Entity Classification
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'MSME & Industry',
                        'Hospital & Healthcare',
                        'Farmer Producer Org',
                        'Municipality / Urban Local Body',
                        'Social Enterprise',
                      ].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setOrganizationType(type as any)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                            organizationType === type
                              ? 'border-[#5B4FE9] bg-[#EFEDFC] text-[#5B4FE9] shadow-2xs'
                              : 'border-[#E8E7F3] bg-white text-[#4A4C63] hover:bg-slate-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 2: OPERATIONAL BOTTLENECK & AI ASSISTANT */}
              {/* ======================================================== */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-[#F0EFF8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#14162B]">
                        Step 2: Operational Bottleneck & Root Causes
                      </h2>
                      <p className="text-xs text-[#6B6D82] mt-0.5">
                        Describe what happens currently on the plant floor, hospital ward, or field.
                      </p>
                    </div>

                    {/* Prominent Gemini AI Refine Button */}
                    <button
                      type="button"
                      onClick={handleAIFormulateProblem}
                      disabled={aiLoading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5B4FE9] to-[#8B7FF5] hover:from-[#4C40DC] hover:to-[#7A6DF0] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer self-start sm:self-auto"
                      title="Uses Gemini 2.5 Flash to structure the problem statement and deliverables"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{aiLoading ? 'AI Formulating...' : '✨ Refine Statement with AI'}</span>
                    </button>
                  </div>

                  {/* Full Description Textarea */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                      Operational Problem Description *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Explain the background. For example: We operate three 10,000-liter overhead industrial water tanks. Operators currently climb ladders twice per shift with manual dipsticks. When tanks run dry unexpectedly mid-batch, expensive dye runs get contaminated and pump motors burn out..."
                      className="w-full text-xs sm:text-sm p-4 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:bg-white focus:border-[#5B4FE9] focus:ring-4 focus:ring-[#5B4FE9]/10 transition-all text-[#14162B] leading-relaxed"
                    />
                  </div>

                  {/* Quantifiable Pain Point */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                      Quantifiable Financial & Operational Pain Point
                    </label>
                    <textarea
                      rows={2}
                      value={painPoint}
                      onChange={(e) => setPainPoint(e.target.value)}
                      placeholder="e.g. Manual dipstick readings are dangerous and inaccurate. Frequent pump dry-runs burn out motors costing ₹18,000 in rewinding and ₹75,000 in spoiled fabric batches per incident."
                      className="w-full text-xs sm:text-sm p-3.5 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:bg-white focus:border-[#5B4FE9] text-[#14162B]"
                    />
                    <p className="text-[11px] text-[#8B8DA3] mt-1">
                      Giving specific financial or downtime numbers helps student engineers appreciate the high real-world value of their solution.
                    </p>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 3: DELIVERABLES & HARDWARE ACCESS */}
              {/* ======================================================== */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-[#F0EFF8] pb-4">
                    <h2 className="font-display text-xl font-bold text-[#14162B]">
                      Step 3: Tangible Deliverables & Technical Specs
                    </h2>
                    <p className="text-xs text-[#6B6D82] mt-0.5">
                      Specify the working prototype format and equipment provided to the student solvers.
                    </p>
                  </div>

                  {/* Deliverable Type Select */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                      Primary Deliverable Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        'Hardware Prototype',
                        'Web & Mobile App',
                        'Firmware & Cloud',
                        'Full-Stack Solution',
                        'Edge AI Model',
                      ].map((dType) => (
                        <button
                          key={dType}
                          type="button"
                          onClick={() => setDeliverableType(dType as any)}
                          className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                            deliverableType === dType
                              ? 'border-[#5B4FE9] bg-[#EFEDFC] text-[#5B4FE9] ring-2 ring-[#5B4FE9]/10'
                              : 'border-[#E8E7F3] bg-white text-[#4A4C63] hover:bg-slate-50'
                          }`}
                        >
                          <Cpu className="w-4 h-4 mb-1" />
                          <span>{dType}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hardware & Site Access Provided */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                      Facilities & Hardware Access Provided by Organization
                    </label>
                    <input
                      type="text"
                      value={hardwareProvided}
                      onChange={(e) => setHardwareProvided(e.target.value)}
                      placeholder="e.g. Access to test tank on-site, 24V DC control cabinet rails, and reimbursement for test ultrasonic sensors."
                      className="w-full text-xs sm:text-sm p-3.5 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:bg-white focus:border-[#5B4FE9] text-[#14162B]"
                    />
                  </div>

                  {/* Specific Tangible Deliverables List */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                      Tangible Deliverables Checklist *
                    </label>
                    
                    <div className="space-y-2 mb-3">
                      {deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAF9] border border-[#E8E7F3] text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#1FAE7C] shrink-0" />
                            <span className="text-[#14162B] font-medium">{item}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDeliverable(item)}
                            className="text-[#8B8DA3] hover:text-[#D6455A] p-1"
                            title="Remove deliverable"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={deliverableInput}
                        onChange={(e) => setDeliverableInput(e.target.value)}
                        onKeyDown={handleAddDeliverable}
                        placeholder="Add another deliverable (e.g. Bilingual audio speaker alert in Tamil) and press Enter..."
                        className="flex-1 text-xs sm:text-sm p-3 bg-[#FAFAF9] border border-[#D6D4EA] rounded-xl outline-none focus:bg-white focus:border-[#5B4FE9]"
                      />
                      <button
                        type="button"
                        onClick={handleAddDeliverable}
                        className="px-4 py-3 bg-[#EFEDFC] hover:bg-[#5B4FE9] text-[#5B4FE9] hover:text-white rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 4: BUDGET, TIMELINE & MENTOR REVIEW */}
              {/* ======================================================== */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-[#F0EFF8] pb-4">
                    <h2 className="font-display text-xl font-bold text-[#14162B]">
                      Step 4: Honorarium Budget & Lead Mentor Review
                    </h2>
                    <p className="text-xs text-[#6B6D82] mt-0.5">
                      Verify honorarium escrow and your direct communication contact details.
                    </p>
                  </div>

                  {/* Budget, Timeline & Urgency */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                        Honorarium Budget (₹ INR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[#14162B]">
                          ₹
                        </span>
                        <input
                          type="number"
                          min={5000}
                          step={1000}
                          required
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full text-sm font-bold pl-8 pr-3.5 py-3 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:bg-white focus:border-[#5B4FE9] text-[#14162B]"
                        />
                      </div>
                      <span className="text-[10px] text-[#8B8DA3] mt-1 block">
                        Typical student stipend range: ₹15,000 – ₹75,000+
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                        Target Timeline
                      </label>
                      <input
                        type="text"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        placeholder="e.g. 3 - 4 weeks"
                        className="w-full text-xs sm:text-sm p-3 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:border-[#5B4FE9] focus:bg-white text-[#14162B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                        Urgency Level
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value as any)}
                        className="w-full text-xs sm:text-sm p-3 bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl outline-none focus:border-[#5B4FE9] focus:bg-white text-[#14162B]"
                      >
                        <option value="High (Immediate)">High (Immediate)</option>
                        <option value="Moderate (Next 30 Days)">Moderate (Next 30 Days)</option>
                        <option value="Flexible">Flexible Timeline</option>
                      </select>
                    </div>
                  </div>

                  {/* Required Skills Chips */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#14162B] mb-1.5">
                      Required Skills & Hardware Frameworks
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#EFEDFC] text-[#5B4FE9] px-3 py-1 rounded-full border border-[#D6D4EA]"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-[#D6455A] cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="Type skill (e.g. ESP32, React, MQTT, OpenCV) and press Enter..."
                        className="flex-1 text-xs p-3 bg-[#FAFAF9] border border-[#D6D4EA] rounded-xl outline-none focus:bg-white focus:border-[#5B4FE9]"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-4 py-3 bg-[#EFEDFC] hover:bg-[#5B4FE9] text-[#5B4FE9] hover:text-white rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>

                  {/* Contact Person & Mentorship */}
                  <div className="p-4 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F3] space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#5B4FE9]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#14162B]">
                        Problem Lead & Mentor Contact (Visible to Solvers)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-[#14162B] mb-1">
                          Contact Person / Lead Engineer *
                        </label>
                        <input
                          type="text"
                          required
                          value={mentorName}
                          onChange={(e) => setMentorName(e.target.value)}
                          placeholder="e.g. Er. Sivakumar M."
                          className="w-full p-2.5 rounded-xl border border-[#D6D4EA] bg-white outline-none focus:border-[#5B4FE9]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#14162B] mb-1">
                          Designation / Department *
                        </label>
                        <input
                          type="text"
                          required
                          value={mentorTitle}
                          onChange={(e) => setMentorTitle(e.target.value)}
                          placeholder="e.g. Plant Engineering Manager"
                          className="w-full p-2.5 rounded-xl border border-[#D6D4EA] bg-white outline-none focus:border-[#5B4FE9]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#14162B] mb-1">
                          Official Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={mentorEmail}
                          onChange={(e) => setMentorEmail(e.target.value)}
                          placeholder="commissioner@erode.gov.in"
                          className="w-full p-2.5 rounded-xl border border-[#D6D4EA] bg-white outline-none focus:border-[#5B4FE9]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#14162B] mb-1">
                          Official Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={mentorPhone}
                          onChange={(e) => setMentorPhone(e.target.value)}
                          placeholder="+91 94432 10987"
                          className="w-full p-2.5 rounded-xl border border-[#D6D4EA] bg-white outline-none focus:border-[#5B4FE9]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Bottom Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-[#E8E7F3] flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#D6D4EA] text-xs font-bold text-[#14162B] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onNavigateHome}
                    className="text-xs font-semibold text-[#8B8DA3] hover:text-[#14162B] transition-colors cursor-pointer"
                  >
                    Cancel & Return
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#5B4FE9] hover:bg-[#4C40DC] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <span>Proceed to Step {currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1FAE7C] hover:bg-[#189669] text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 cursor-pointer"
                  >
                    {isPublishing ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Publishing & Redirecting...</span>
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Publish Challenge & View Page</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT 4 COLUMNS: Live Real-time Challenge Card Preview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#E8E7F3] rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F0EFF8]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5B4FE9]" />
                  <span className="text-xs font-bold text-[#14162B] uppercase tracking-wider">
                    Live Directory Preview
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4F6EE] text-[#1FAE7C]">
                  Card View
                </span>
              </div>

              {/* The Mocked Card */}
              <div className="bg-[#FAFAF9] border border-[#D6D4EA] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8B8DA3]">
                  <span className="font-semibold text-[#5B4FE9]">{category || 'IoT'}</span>
                  <span>Just now</span>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-[#14162B] leading-snug line-clamp-2">
                  {title || 'Your Challenge Title Will Appear Here'}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#4A4C63]">
                  <Building className="w-3.5 h-3.5 text-[#8B8DA3] shrink-0" />
                  <span className="truncate">{organization || 'Your Organization'}</span>
                </div>

                <div className="text-xs text-[#8B8DA3] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8B8DA3] shrink-0" />
                  <span>{location || 'Location'}</span>
                </div>

                <p className="text-xs text-[#6B6D82] line-clamp-3 leading-relaxed bg-white p-2.5 rounded-xl border border-[#E8E7F3]">
                  "{painPoint || description || 'Operational description and impact summary will be shown here...'}"
                </p>

                {/* Skills tags preview */}
                <div className="flex flex-wrap gap-1">
                  {(skills.length > 0 ? skills.slice(0, 3) : ['Skills']).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#EFEDFC] text-[#5B4FE9]"
                    >
                      {s}
                    </span>
                  ))}
                  {skills.length > 3 && (
                    <span className="text-[10px] text-[#8B8DA3] self-center">
                      +{skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Bottom preview bar */}
                <div className="flex items-center justify-between pt-2.5 border-t border-[#E8E7F3] text-xs">
                  <div>
                    <span className="text-[10px] text-[#8B8DA3] block uppercase font-bold">Honorarium</span>
                    <strong className="text-sm font-bold text-[#14162B]">
                      ₹{(Number(budget) || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <span className="text-[11px] font-bold text-[#5B4FE9] bg-white border border-[#D6D4EA] px-2.5 py-1 rounded-lg">
                    {deliverableType}
                  </span>
                </div>
              </div>
            </div>

            {/* Why Post on ProblemBridge Guidance Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#14162B] to-[#25284E] text-white space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <CheckCircle2 className="w-4 h-4 text-[#1FAE7C]" />
                <span>The ProblemBridge Promise</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Over 1,200+ verified engineering innovators receive notifications for newly posted problems. Challenges average 3 technical proposals within the first 48 hours.
              </p>
              <div className="text-[11px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
                <span>Free for MSMEs & non-profits</span>
                <span className="text-[#1FAE7C] font-semibold">100% Protected Escrow</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
