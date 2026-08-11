import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, AlertTriangle, CheckCircle2, Clock, MapPin, Truck, ArrowRight, Loader2, Wrench } from 'lucide-react';
import { EmergencyIntakeData, TriageResult } from '../types';
import { db, collection, addDoc } from '../lib/firebase';

export const EmergencyDispatch: React.FC = () => {
  const [formData, setFormData] = useState<EmergencyIntakeData>({
    homeownerName: '',
    phone: '',
    address: '',
    city: 'Atlanta',
    state: 'GA',
    zip: '30301',
    damageType: 'WIND_STORM',
    roofType: 'ASPHALT_SHINGLE',
    stories: 1,
    pitch: 'MEDIUM_PITCH',
    activeWaterLeak: true,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/gemini/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyData: formData,
          availableContractors: [
            { id: 'anr-1', companyName: 'A-NewRoof Emergency Rapid Response Crew #1', distanceMiles: 4.2 },
            { id: 'anr-2', companyName: 'Metro Atlanta Rapid Tarping & Repair', distanceMiles: 8.5 },
            { id: 'anr-3', companyName: 'Georgia Storm Response Roofers', distanceMiles: 12.1 },
          ],
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTriageResult(data.data);
      }

      // Persist to Firebase Firestore database
      await addDoc(collection(db, 'tickets'), {
        customerName: formData.homeownerName,
        phone: formData.phone,
        email: 'homeowner@example.com',
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        roofMaterial: formData.roofType,
        roofPitch: formData.pitch,
        stories: formData.stories,
        severity: formData.activeWaterLeak ? 'CRITICAL_LEAK' : 'STORM_DAMAGE',
        status: 'EN_ROUTE',
        hasActiveWaterLeak: formData.activeWaterLeak,
        createdAt: new Date().toISOString(),
        notes: formData.notes
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs px-3 py-1 rounded-full">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            24/7 RAPID EMERGENCY TARPING & LEAK SEAL DISPATCH
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stop Water Damage Before It Wrecks Your Home
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Submit an emergency intake for immediate AI loss severity assessment, crew matching, and immediate dispatch prioritization — or call our emergency hotline directly at{' '}
            <a href="tel:7067400529" className="text-amber-400 font-bold underline">
              (706) 740-0529
            </a>
            .
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Intake Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Emergency Loss Intake Form</h2>
              <p className="text-xs text-slate-400">Instant AI Triage & Roofer Matching</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name / Policyholder
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.homeownerName}
                  onChange={(e) => setFormData({ ...formData, homeownerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(706) 740-0529"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Property Address
              </label>
              <input
                type="text"
                required
                placeholder="123 Peachtree St NW"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Zip Code</label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Damage Type
                </label>
                <select
                  value={formData.damageType}
                  onChange={(e) => setFormData({ ...formData, damageType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="WIND_STORM">Wind / Tornado Shingle Loss</option>
                  <option value="HAIL_IMPACT">Hail Impact / Puncture</option>
                  <option value="TREE_FALL">Tree Limb / Debris Impact</option>
                  <option value="ACTIVE_LEAK">Active Water Intrusion</option>
                  <option value="FIRE_STRUCTURAL">Fire / Structural Compromise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Roof Material
                </label>
                <select
                  value={formData.roofType}
                  onChange={(e) => setFormData({ ...formData, roofType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="ASPHALT_SHINGLE">Architectural / 3-Tab Shingle</option>
                  <option value="METAL">Standing Seam / Ribbed Metal</option>
                  <option value="TILE">Concrete / Clay Tile</option>
                  <option value="FLAT_EPDM">Flat / EPDM / TPO</option>
                  <option value="WOOD_SHAKE">Cedar Shake</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                id="activeWaterLeak"
                checked={formData.activeWaterLeak}
                onChange={(e) => setFormData({ ...formData, activeWaterLeak: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
              />
              <label htmlFor="activeWaterLeak" className="text-sm font-semibold text-red-400 cursor-pointer">
                CRITICAL: Water is actively leaking into the living space or ceiling
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Scope Notes / Special Access Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Describe active leaks, attic access, dog on site, power lines nearby..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Loss Severity & Matching Crew...
                </>
              ) : (
                <>
                  Submit Emergency Intake & Run AI Triage
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dispatch Hotline & AI Results Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hotline Card */}
          <div className="bg-gradient-to-br from-red-950/80 to-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded tracking-wider uppercase">
                  DIRECT 24/7 LINE
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Need Immediate Crew Dispatch?</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Skip the queue! Call our master emergency response coordinator directly.
                </p>
              </div>
              <PhoneCall className="w-10 h-10 text-amber-400 shrink-0 animate-bounce" />
            </div>

            <div className="mt-6">
              <a
                href="tel:7067400529"
                className="block text-center bg-red-600 hover:bg-red-500 text-white font-black text-xl py-3.5 rounded-xl shadow-lg tracking-wide transition-all"
              >
                (706) 740-0529
              </a>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                24 Hours a Day • 7 Days a Week • Statewide Rapid Response
              </p>
            </div>
          </div>

          {/* AI Triage Results */}
          {triageResult ? (
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AI Triage Report
                </span>
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full ${
                    triageResult.urgencyCategory === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {triageResult.urgencyCategory} SEVERITY ({triageResult.severityScore}/100)
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Hazard Assessment
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {triageResult.hazardAssessment}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Homeowner Interim Safety Steps
                </h4>
                <ul className="space-y-1.5">
                  {triageResult.homeownerInterimAdvice.map((advice, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  Recommended Mitigation Equipment
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {triageResult.recommendedEquipment.map((eq, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {triageResult.contractorPrioritization.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-2">
                    Matched Emergency Crew
                  </h4>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-amber-400">
                        {triageResult.contractorPrioritization[0].companyName}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                        {triageResult.contractorPrioritization[0].suitabilityScore}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {triageResult.contractorPrioritization[0].matchingReason}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <Clock className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">Awaiting Loss Intake</h4>
              <p className="text-xs text-slate-500">
                Fill out the emergency form to run live AI triage & match local licensed emergency roof tarping crews.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
