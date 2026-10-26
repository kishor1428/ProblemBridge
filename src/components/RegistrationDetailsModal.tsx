import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Github,
  Linkedin,
  AlertCircle,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

interface RegistrationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  onOpenPostProblem?: () => void;
  isNewRegistration?: boolean;
  onOpenLogin?: () => void;
}

export const RegistrationDetailsModal: React.FC<RegistrationDetailsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onOpenPostProblem,
  isNewRegistration = false,
  onOpenLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'skills'>('personal');
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [skillInput, setSkillInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNewRegistration) {
      setFormData({
        id: `usr-${Date.now()}`,
        fullName: '',
        email: '',
        phone: '+91 ',
        role: 'builder',
        accountType: 'Student Builder / Innovator',
        institution: '',
        department: '',
        degree: '',
        rollNo: '',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        bio: '',
        skills: ['Embedded Systems', 'IoT', 'React'],
        githubUrl: '',
        linkedinUrl: '',
        registrationDate: 'Just now',
        registrationStatus: 'Verified',
        idVerificationType: 'College ID Card',
        idCardVerified: true,
        canPostProblems: true,
        isLoggedIn: true,
      });
      setActiveTab('personal');
      setSaveSuccess(false);
    } else {
      setFormData({
        ...userProfile,
        canPostProblems: true,
        isLoggedIn: true,
      });
      setSaveSuccess(false);
    }
  }, [userProfile, isOpen, isNewRegistration]);

  if (!isOpen) return null;

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skillInput.trim()]
        });
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError('Full Name and Email are mandatory.');
      return;
    }

    const updated: UserProfile = {
      ...formData,
      canPostProblems: true,
      isLoggedIn: true,
    };

    onSaveProfile(updated);
    setSaveSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E7F3] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reg-modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8E7F3] bg-[#FAFAF9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFEDFC] text-[#5B4FE9] font-bold text-sm flex items-center justify-center border border-[#D6D4EA]">
              {formData.fullName
                ? formData.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'PB'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5B4FE9]">
                  {isNewRegistration ? 'User Registration & Onboarding' : 'Personal Registration Information'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1FAE7C] bg-[#E4F6EE] px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Problem Posting Enabled</span>
                </span>
              </div>
              <h3 id="reg-modal-title" className="font-display text-lg font-semibold text-[#14162B]">
                {isNewRegistration ? 'Create ProblemBridge Account' : `${formData.fullName || 'User'}'s Registered Profile`}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8B8DA3] hover:text-[#14162B] hover:bg-[#E5E4EE] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notice: Registration gives every user problem posting powers */}
        <div className="bg-[#EFEDFC]/70 px-6 py-2.5 border-b border-[#D6D4EA] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#5B4FE9]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="font-medium">
              Every registered user receives instant privileges to <strong>post problems</strong> and <strong>collaborate with builders</strong>.
            </span>
          </div>
          <span className="text-[10px] bg-white font-bold text-[#1FAE7C] px-2 py-0.5 rounded-md border border-[#1FAE7C]/30 shrink-0">
            Posting Rights Included
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#E8E7F3] px-6 bg-white gap-6 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'personal'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#4A4C63] hover:text-[#14162B]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal & Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'academic'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#4A4C63] hover:text-[#14162B]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic & Verification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'border-[#5B4FE9] text-[#5B4FE9]'
                : 'border-transparent text-[#4A4C63] hover:text-[#14162B]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skills & Posting Privileges</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#FBE9EC] border border-[#D6455A]/30 text-[#D6455A] rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner when registered */}
          {saveSuccess && (
            <div className="p-4 bg-[#E4F6EE] border border-[#1FAE7C]/40 rounded-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1FAE7C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#14162B]">
                    Registration Completed Successfully!
                  </h4>
                  <p className="text-xs text-[#4A4C63] mt-0.5">
                    Welcome to ProblemBridge, <strong>{formData.fullName}</strong>. You now have full permissions to post operational challenges, review builder applications, or submit engineering proposals.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                {onOpenPostProblem && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPostProblem();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5B4FE9] text-white text-xs font-semibold hover:bg-[#4C40DC] transition-colors shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post a Problem Challenge Now</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white border border-[#D6D4EA] text-[#14162B] text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Close & Explore
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: PERSONAL & CONTACT */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="bg-[#EFEDFC]/50 p-3 rounded-xl border border-[#D6D4EA] text-xs text-[#4A4C63]">
                Your personal details enable direct coordination between problem owners and student engineers when projects are selected.
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                  Full Name *
                </label>
                <div className="flex items-center gap-2 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg px-3 py-2 focus-within:border-[#5B4FE9] focus-within:bg-white">
                  <User className="w-4 h-4 text-[#8B8DA3]" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sanjay Verma"
                    className="w-full bg-transparent border-none outline-none text-[#14162B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    Registered Email Address *
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg px-3 py-2 focus-within:border-[#5B4FE9] focus-within:bg-white">
                    <Mail className="w-4 h-4 text-[#8B8DA3]" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sanjay.verma@psgtech.ac.in"
                      className="w-full bg-transparent border-none outline-none text-[#14162B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    Primary Phone / WhatsApp *
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg px-3 py-2 focus-within:border-[#5B4FE9] focus-within:bg-white">
                    <Phone className="w-4 h-4 text-[#8B8DA3]" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98421 54321"
                      className="w-full bg-transparent border-none outline-none text-[#14162B]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    City / District
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg px-3 py-2 focus-within:border-[#5B4FE9] focus-within:bg-white">
                    <MapPin className="w-4 h-4 text-[#8B8DA3]" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Coimbatore"
                      className="w-full bg-transparent border-none outline-none text-[#14162B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg px-3 py-2 outline-none focus:border-[#5B4FE9] text-[#14162B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                  Profile Bio & Interests
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell others what challenges you face, or what hardware/software you can build..."
                  className="w-full bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg p-2.5 outline-none focus:border-[#5B4FE9] text-[#14162B]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC & VERIFICATION */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#E4F6EE] border border-[#1FAE7C]/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#1FAE7C]" />
                  <div>
                    <span className="font-semibold text-xs text-[#14162B] block">
                      Verification & Problem Posting Authorization
                    </span>
                    <span className="text-[11px] text-[#4A4C63]">
                      All registered accounts are authorized to post problems directly.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-white font-bold text-[#1FAE7C] px-2 py-0.5 rounded-md border border-[#1FAE7C]/30">
                  Authorized ✓
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    Primary Account Role
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as any })}
                    className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9] text-[#14162B]"
                  >
                    <option value="Student Builder / Innovator">Student Builder / Innovator (Can also post problems)</option>
                    <option value="Problem Owner / Organization">Problem Owner / Organization (Industry, Hospital, FPO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    Student Roll No / Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    placeholder="e.g. 21L248 or EMP-509"
                    className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9] text-[#14162B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                  College / University / Company / Organization *
                </label>
                <div className="flex items-center gap-2 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg px-3 py-2 focus-within:border-[#5B4FE9] focus-within:bg-white">
                  <Building className="w-4 h-4 text-[#8B8DA3]" />
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. PSG College of Technology, Coimbatore"
                    className="w-full bg-transparent border-none outline-none text-[#14162B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    Department / Division
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Electronics & Communication Engineering"
                    className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9] text-[#14162B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    Degree / Year / Designation
                  </label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="e.g. Final Year B.E. or Project Lead"
                    className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9] text-[#14162B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                  ID Verification Method
                </label>
                <select
                  value={formData.idVerificationType}
                  onChange={(e) => setFormData({ ...formData, idVerificationType: e.target.value as any })}
                  className="w-full p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9] text-[#14162B]"
                >
                  <option value="College ID Card">College ID Card (Uploaded during signup)</option>
                  <option value="Institution Letter">Department Bonafide / Organization Authorization</option>
                  <option value="Official Institutional Email">Institutional .edu / .ac.in / Official Email Verification</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS & POSTING PRIVILEGES */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              
              {/* Feature highlight: Problem Posting is unlocked for every user */}
              <div className="p-4 bg-[#FAFAF9] border border-[#5B4FE9]/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#5B4FE9]">
                  <PlusCircle className="w-4 h-4" />
                  <span>Problem Posting Privileges</span>
                </div>
                <p className="text-xs text-[#4A4C63] leading-relaxed">
                  As part of ProblemBridge's open innovation ethos, <strong>every registered user</strong>—whether an engineering student, faculty researcher, factory supervisor, or clinic coordinator—can publish real problems to crowdsource builder solutions.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-2 h-2 rounded-full bg-[#1FAE7C]"></span>
                  <span className="text-xs font-semibold text-[#14162B]">
                    Status: Fully Authorized to Post Challenges (No Approval Required)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1.5">
                  Technical Domains & Skills
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs font-medium bg-[#EFEDFC] text-[#5B4FE9] px-2.5 py-1 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-[#4C40DC]"
                        aria-label={`Remove ${skill}`}
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
                  placeholder="Type domain or skill (e.g. Embedded, IoT, React, Python) and press Enter..."
                  className="w-full text-xs p-2.5 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg outline-none focus:border-[#5B4FE9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    GitHub / Prototype Portfolio
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg px-3 py-2 focus-within:border-[#5B4FE9] focus-within:bg-white">
                    <Github className="w-4 h-4 text-[#8B8DA3]" />
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-transparent border-none outline-none text-[#14162B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#14162B] mb-1">
                    LinkedIn Profile
                  </label>
                  <div className="flex items-center gap-2 bg-[#FAFAF9] border border-[#E8E7F3] rounded-lg px-3 py-2 focus-within:border-[#5B4FE9] focus-within:bg-white">
                    <Linkedin className="w-4 h-4 text-[#8B8DA3]" />
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-transparent border-none outline-none text-[#14162B]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          {!saveSuccess && (
            <div className="pt-4 border-t border-[#E8E7F3] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#8B8DA3] block">
                  {isNewRegistration ? 'All accounts can post problems & build solutions' : `Registered since ${formData.registrationDate}`}
                </span>
                {isNewRegistration && onOpenLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLogin();
                    }}
                    className="text-xs font-bold text-[#5B4FE9] hover:underline mt-0.5"
                  >
                    Already have an account? Log In instead →
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-semibold text-[#4A4C63] hover:text-[#14162B] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#5B4FE9] text-white font-semibold hover:bg-[#4C40DC] transition-all shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isNewRegistration ? 'Complete Registration & Enable Posting' : 'Save Registration Details'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
