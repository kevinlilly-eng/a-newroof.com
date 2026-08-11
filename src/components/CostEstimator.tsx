import React, { useState } from 'react';
import { Calculator, Sparkles, FileSpreadsheet, Loader2, DollarSign, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { EstimateResult } from '../types';

export const CostEstimator: React.FC = () => {
  const [squares, setSquares] = useState<number>(28);
  const [pitch, setPitch] = useState<string>('7/12 (Medium Pitch)');
  const [stories, setStories] = useState<number>(2);
  const [tearOffLayers, setTearOffLayers] = useState<number>(1);
  const [tarpSqFt, setTarpSqFt] = useState<number>(1200);
  const [customNotes, setCustomNotes] = useState<string>(
    'Emergency tarping over storm damaged ridge and front slope, followed by complete tear-off and architectural shingle installation with synthetic underlayment and ice/water shield at eaves.'
  );

  const [tarpRateSqFt, setTarpRateSqFt] = useState<number>(2.50);
  const [tearOffRatePerSq, setTearOffRatePerSq] = useState<number>(65.00);
  const [shingleRatePerSq, setShingleRatePerSq] = useState<number>(380.00);

  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);

  const handleGenerateEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/gemini/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rooferRates: {
            tarpingRatePerSqFt: tarpRateSqFt,
            tearOffRatePerSq: tearOffRatePerSq,
            shingleReplacementRatePerSq: shingleRatePerSq,
            syntheticUnderlaymentPerSq: 45.00,
            iceAndWaterShieldPerSqFt: 1.85,
            ridgeCapPerLf: 12.00,
            dripEdgePerLf: 4.50,
            dumpsterDebrisFee: 550.00,
          },
          projectDetails: {
            totalRoofSquares: squares,
            pitch,
            stories,
            tearOffLayers,
            emergencyTarpingSqFt: tarpSqFt,
          },
          customNotes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEstimate(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Gemini AI Contractor Estimate Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate unit-rate estimates, line-item waste factors, and building code upgrades (IRC R905)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Scope & Unit Rates</span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Custom Rates Active
            </span>
          </h2>

          <form onSubmit={handleGenerateEstimate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Roof Size (SQ)
                </label>
                <input
                  type="number"
                  min={1}
                  value={squares}
                  onChange={(e) => setSquares(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Emergency Tarp Area (Sq Ft)
                </label>
                <input
                  type="number"
                  min={0}
                  value={tarpSqFt}
                  onChange={(e) => setTarpSqFt(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pitch</label>
                <select
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="4/12 (Low Pitch)">4/12 (Low Pitch)</option>
                  <option value="7/12 (Medium Pitch)">7/12 (Medium Pitch)</option>
                  <option value="10/12 (Steep Pitch)">10/12 (Steep Pitch)</option>
                  <option value="12/12+ (Mansard / Very Steep)">12/12+ (Steep / Mansard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Stories</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={stories}
                  onChange={(e) => setStories(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Custom Unit Rates */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Contractor Base Rates
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Tarp Rate / sq ft</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-500">$</span>
                    <input
                      type="number"
                      step="0.10"
                      value={tarpRateSqFt}
                      onChange={(e) => setTarpRateSqFt(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Tear-Off / SQ</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-500">$</span>
                    <input
                      type="number"
                      value={tearOffRatePerSq}
                      onChange={(e) => setTearOffRatePerSq(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Shingle / SQ</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-500">$</span>
                    <input
                      type="number"
                      value={shingleRatePerSq}
                      onChange={(e) => setShingleRatePerSq(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Notes & Scope Details
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating Itemized Line Items & Code Upgrades...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Estimate
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {estimate ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Itemized Contractor Estimate
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Total: ${estimate.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Waste Factor</span>
                  <span className="text-sm font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    +{estimate.wasteFactorPercentage}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {estimate.summary}
              </p>

              {/* Line Items Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3">Rate</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {estimate.lineItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-3 font-medium">
                          <div>{item.item}</div>
                          {item.codeRef && (
                            <span className="text-[10px] text-amber-400/90">{item.codeRef}</span>
                          )}
                        </td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">{item.unit}</td>
                        <td className="p-3">${item.unitRate.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold text-white">
                          ${item.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AI Strategic Thoughts */}
              {estimate.geminiSuggestionsAndThoughts?.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Gemini AI Strategic Insights for Roofer & Adjuster
                  </h4>
                  <ul className="space-y-1.5">
                    {estimate.geminiSuggestionsAndThoughts.map((thought, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{thought}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">Ready to Calculate</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Set project scope & unit rates on the left, then click "Generate AI Estimate" to get an itemized breakdown with building code citations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
