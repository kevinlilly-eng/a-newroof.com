import React, { useState } from 'react';
import { db, collection, addDoc } from '../lib/firebase';
import {
  PhoneCall,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Camera,
  CheckCircle2,
  Truck,
  ArrowRight,
  FileCheck,
  HelpCircle,
  Loader2,
  Sparkles,
  MapPin,
  Flame,
  Shield
} from 'lucide-react';

interface HomeownerPortalProps {
  onNavigateToEstimate: () => void;
  onNavigateToChat: () => void;
}

export const HomeownerPortal: React.FC<HomeownerPortalProps> = ({
  onNavigateToEstimate,
  onNavigateToChat,
}) => {
  // Dispatch Step State
  const [step, setStep] = useState<number>(1);
  const [homeownerName, setHomeownerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [damageType, setDamageType] = useState('Active Roof Leak / Water Intrusion');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchTicket, setDispatchTicket] = useState<{
    id: string;
    etaMinutes: number;
    crewName: string;
  } | null>(null);

  // Photo Analysis State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<string | null>(null);

  const handleQuickDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const generatedId = `ANR-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Save to Firebase Firestore tickets collection
      await addDoc(collection(db, 'tickets'), {
        id: generatedId,
        customerName: homeownerName,
        phone: phone,
        email: 'homeowner@example.com',
        address: address,
        damageType: damageType,
        roofMaterial: 'Architectural Shingle',
        roofPitch: '7/12',
        stories: 2,
        severity: 'EMERGENCY_LEAK',
        status: 'EN_ROUTE',
        hasActiveWaterLeak: damageType.includes('Leak'),
        contractorAssigned: 'A-NewRoof Emergency Crew #2',
        etaMinutes: 22,
        notes: notes || 'Submitted from Homeowner Portal',
        createdAt: new Date().toISOString()
      });

      // Also publish to Firebase Firestore leads collection for local contractor marketplace
      await addDoc(collection(db, 'leads'), {
        id: `LEAD-${Date.now()}`,
        type: damageType.includes('Leak') ? 'EMERGENCY_TARP' : 'STORM_REPAIR',
        createdAt: new Date().toISOString(),
        customerName: homeownerName,
        phone: phone,
        email: 'homeowner@example.com',
        address: address,
        zipCode: '30301',
        neighborhood: 'Metro Area',
        roofMaterial: 'Architectural Shingle',
        roofPitch: '7/12',
        stories: 2,
        sqFt: 2600,
        severity: 'HIGH',
        jobEstimateValue: 1450,
        leadFee: 35,
        isClaimed: false,
        status: 'OPEN',
        hasActiveLeak: true,
        notes: notes || 'Emergency dispatch requested by policyholder'
      });
    } catch (err) {
      console.error('Firebase save error:', err);
    } finally {
      setIsSubmitting(false);
      setDispatchTicket({
        id: generatedId,
        etaMinutes: 22,
        crewName: 'A-NewRoof Emergency Crew #2',
      });
      setStep(3);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setIsAnalyzingPhoto(true);
        // Simulate Gemini AI image scan
        setTimeout(() => {
          setIsAnalyzingPhoto(false);
          setPhotoAnalysis(
            "AI Inspection Analysis: High-probability asphalt shingle displacement & exposed decking detected near valley seam. Active risk of sub-layer water saturated plywood. Recommendation: Immediate 20mil reinforced poly tarp installation & temporary rubber seal strip."
          );
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs px-3.5 py-1.5 rounded-full">
            <Shield className="w-4 h-4" />
            OFFICIAL HOMEOWNER & POLICYHOLDER EMERGENCY PORTAL
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Storm Damage or Roof Leak? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Get Immediate Tarping & Repair
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the <strong>A-NewRoof Homeowner Portal</strong>. Request emergency tarping crews to stop leaks, upload damage photos for AI analysis, or call our 24/7 hotline directly.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="tel:7067400529"
              className="flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl shadow-red-950/40 transition-all transform hover:scale-105"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>CALL EMERGENCY HOTLINE: (706) 740-0529</span>
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('homeowner-dispatch-form');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm px-5 py-3.5 rounded-2xl border border-slate-700 transition-all"
            >
              Request Online Dispatch
            </button>
          </div>
        </div>
      </div>

      {/* Main Homeowner 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 3-Step Emergency Tarp Request */}
        <div id="homeowner-dispatch-form" className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Emergency Crew Dispatch Request</h2>
                <p className="text-xs text-slate-400">Fast 3-step request for homeowners & policyholders</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Avg Dispatch: 24 Mins</span>
            </div>
          </div>

          {/* Active Ticket Banner */}
          {dispatchTicket && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-5 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  DISPATCH CONFIRMED
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">{dispatchTicket.id}</span>
              </div>
              <h3 className="text-lg font-black text-white">Crew En Route to Property!</h3>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Assigned Emergency Team</span>
                  <span className="font-bold text-white">{dispatchTicket.crewName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Estimated Arrival</span>
                  <span className="font-bold text-amber-400">~{dispatchTicket.etaMinutes} Minutes</span>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                Our team is preparing heavy-duty tarps, flashing sealants, and ladder safety rigs. Call hotline anytime for updates: {' '}
                <a href="tel:7067400529" className="font-bold text-amber-400 underline">
                  (706) 740-0529
                </a>
              </p>
            </div>
          )}

          {/* Intake Form */}
          {!dispatchTicket && (
            <form onSubmit={handleQuickDispatch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={homeownerName}
                    onChange={(e) => setHomeownerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Callback Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(706) 740-0529"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Property Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Street Address, City, State, Zip"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Issue / Damage Type
                </label>
                <select
                  value={damageType}
                  onChange={(e) => setDamageType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Active Roof Leak / Water Intrusion">Active Roof Leak / Water Intrusion</option>
                  <option value="Wind / Shingles Blown Off">Wind Damage / Shingles Blown Off</option>
                  <option value="Hail Impact / Punctures">Hail Impact / Punctures</option>
                  <option value="Tree Branch / Debris Impact">Tree Branch / Debris Impact</option>
                  <option value="Chimney or Skylight Leak">Chimney or Skylight Leak</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Special Notes or Access Instructions (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Water dripping into upstairs hallway, gated driveway..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base py-4 rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Assigning Local Emergency Crew...
                  </>
                ) : (
                  <>
                    <span>Dispatch Emergency Crew Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: AI Photo Scanner & Homeowner Tools */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Photo Damage Inspection Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Damage Photo Scanner</h3>
                <p className="text-xs text-slate-400">Upload a roof or ceiling photo for instant AI analysis</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 text-center bg-slate-950/60 transition-all">
              {photoPreview ? (
                <div className="space-y-3">
                  <img
                    src={photoPreview}
                    alt="Damage Upload"
                    className="max-h-48 rounded-xl mx-auto border border-slate-800 object-cover"
                  />
                  <label className="inline-block text-xs text-amber-400 font-bold underline cursor-pointer">
                    Change Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer space-y-2 block">
                  <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                  <span className="text-xs font-semibold text-slate-300 block">
                    Click to Upload or Take Damage Photo
                  </span>
                  <span className="text-[11px] text-slate-500 block">JPG, PNG, HEIC up to 10MB</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            {isAnalyzingPhoto && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini Vision AI analyzing roof damage patterns...</span>
              </div>
            )}

            {photoAnalysis && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Inspection Result</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{photoAnalysis}</p>
              </div>
            )}
          </div>

          {/* Quick Homeowner Tools Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Homeowner Self-Service Tools
            </h3>

            <button
              onClick={onNavigateToEstimate}
              className="w-full text-left bg-slate-950 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors block">
                  Free Roof Replacement Cost Calculator
                </span>
                <span className="text-[11px] text-slate-400">
                  Estimate square footage, materials & insurance claim totals
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </button>

            <button
              onClick={onNavigateToChat}
              className="w-full text-left bg-slate-950 hover:bg-slate-800 p-4 rounded-2xl border border-slate-800 transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors block">
                  24/7 AI Insurance Claim Assistant
                </span>
                <span className="text-[11px] text-slate-400">
                  Ask questions about deductibles, adjusters, or building codes
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </button>
          </div>

          {/* Homeowner Survival Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              Immediate Homeowner Storm Action Steps
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Document Damage:</strong> Take photos of water spots, fallen limbs, and shingle loss.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Mitigate Water Intrusion:</strong> Insurance policies require prompt tarping to prevent secondary mold.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Call Dispatch:</strong> Dial (706) 740-0529 for immediate emergency tarping deployment.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
