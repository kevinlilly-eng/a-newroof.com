import React, { useState } from 'react';
import { FileText, ShieldAlert, Sparkles, Loader2, Download, Printer, Check, Copy } from 'lucide-react';
import { SupplementReportResult } from '../types';

export const SupplementWriter: React.FC = () => {
  const [policyholder, setPolicyholder] = useState('Robert Smith');
  const [claimNumber, setClaimNumber] = useState('CLM-2026-98124');
  const [carrier, setCarrier] = useState('State Farm Insurance');
  const [lossDate, setLossDate] = useState('2026-07-28');
  const [adjusterGap, setAdjusterGap] = useState<number>(4850);
  const [missedItemsText, setMissedItemsText] = useState(
    '1. Ice & Water Shield at eaves and valleys (IRC R905.1.2) - Carrier omitted.\n2. Drip edge flashing (IRC R905.2.8.5) - Carrier omitted.\n3. High-wind 6-nail fastening requirement.\n4. Step flashing replacement at sidewall.'
  );

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SupplementReportResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/gemini/insurance-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimInfo: {
            policyholder,
            claimNumber,
            carrier,
            lossDate,
          },
          lossDetails: {
            causeOfLoss: 'Wind & Hail Catastrophic Storm',
            roofAgeYears: 12,
            roofType: 'Architectural Shingle',
          },
          missedItems: missedItemsText,
          adjusterGap,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReport(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!report) return;
    const text = `${report.reportTitle}\nPolicyholder: ${report.policyholder}\nClaim #: ${report.claimNumber}\nCarrier: ${report.carrier}\n\nEXECUTIVE SUMMARY:\n${report.executiveSummary}\n\nTOTAL SUPPLEMENT DEMAND: $${report.totalSupplementAmount}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Insurance Claim & Supplement Report Writer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Draft formal, carrier-ready defense reports with Xactimate code cross-references and IRC building code citations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            Claim Discrepancy & Loss Details
          </h2>

          <form onSubmit={handleGenerateReport} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Policyholder Name
                </label>
                <input
                  type="text"
                  required
                  value={policyholder}
                  onChange={(e) => setPolicyholder(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Claim Number
                </label>
                <input
                  type="text"
                  required
                  value={claimNumber}
                  onChange={(e) => setClaimNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Insurance Carrier
                </label>
                <input
                  type="text"
                  required
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adjuster Gap Amount ($)
                </label>
                <input
                  type="number"
                  value={adjusterGap}
                  onChange={(e) => setAdjusterGap(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Missed Items & Omitted Scope Details
              </label>
              <textarea
                rows={5}
                value={missedItemsText}
                onChange={(e) => setMissedItemsText(e.target.value)}
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
                  Drafting Carrier Defense Report...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Draft Formal Supplement Report
                </>
              )}
            </button>
          </form>
        </div>

        {/* Report Output */}
        <div className="lg:col-span-7 space-y-6">
          {report ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                    CARRIER DEFENSE DOCUMENT
                  </span>
                  <h3 className="text-lg font-black text-white">{report.reportTitle}</h3>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              </div>

              {/* Claim Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Policyholder</span>
                  <span className="font-bold text-white">{report.policyholder}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Claim #</span>
                  <span className="font-bold text-white">{report.claimNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Carrier</span>
                  <span className="font-bold text-white">{report.carrier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Supplement Demand</span>
                  <span className="font-bold text-amber-400">${report.totalSupplementAmount || adjusterGap}</span>
                </div>
              </div>

              {/* Executive Statement */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Executive Statement
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {report.executiveSummary}
                </p>
              </div>

              {/* Building Code Citations */}
              {report.buildingCodeCitations?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Mandatory Building Code Citations (IRC / IBC)
                  </h4>
                  <div className="space-y-2">
                    {report.buildingCodeCitations.map((code, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-amber-400">{code.codeRef}</span>
                          <span className="text-[10px] text-slate-400">{code.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-normal">{code.requirementText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Adjuster Rebuttal Points */}
              {report.adjusterRebuttalPoints?.length > 0 && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Adjuster Rebuttal Arguments
                  </h4>
                  <ul className="space-y-1.5">
                    {report.adjusterRebuttalPoints.map((pt, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">Awaiting Claim Input</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Fill out the claim details and omitted line items on the left to generate an undeniable carrier defense document.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
