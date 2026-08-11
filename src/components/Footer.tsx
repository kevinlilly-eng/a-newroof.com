import React from 'react';
import { PhoneCall, ShieldCheck, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-lg">
                A
              </div>
              <span className="font-extrabold text-white text-base">A-NewRoof</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              A-NewRoof Emergency Response Platform — B2B2C Emergency Loss Mitigation & Contractor Dispatch.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">24/7 Rapid Dispatch</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-amber-400 font-bold">
                <PhoneCall className="w-4 h-4" />
                <a href="tel:7067400529" className="hover:underline">
                  (706) 740-0529
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>24/7 Statewide Emergency Response</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Statewide Network Dispatch</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Core Services</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Emergency Heavy Poly Roof Tarping</li>
              <li>Storm Damage Shrink Wrap & Leak Seal</li>
              <li>Gemini AI Unit-Rate Cost Estimating</li>
              <li>Insurance Claim & Supplement Reports</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Building Codes & Compliance</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              All contractor estimates and supplement defense reports cite International Residential Code (IRC) & International Building Code (IBC) standards.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <p>© 2026 A-NewRoof Emergency Response Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/sitemap.xml" className="hover:text-slate-300">
              Sitemap
            </a>
            <a href="/robots.txt" className="hover:text-slate-300">
              Robots
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
