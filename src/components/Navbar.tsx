import React from 'react';
import { PhoneCall, Home, ShieldAlert, Calculator, FileText, Users, MessageSquareCode, Clock } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'homeowner', label: 'Homeowner Portal', icon: Home },
    { id: 'dispatch', label: 'Emergency Triage', icon: ShieldAlert },
    { id: 'estimate', label: 'AI Cost Estimator', icon: Calculator },
    { id: 'supplement', label: 'Insurance Supplement Writer', icon: FileText },
    { id: 'marketplace', label: 'Contractor Network', icon: Users },
    { id: 'chat', label: '24/7 AI Claims Chat', icon: MessageSquareCode },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-xl">
      {/* Top Hotline Bar */}
      <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs md:text-sm font-semibold flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900"></span>
          </span>
          <span>24/7 CATASTROPHIC STORM & LEAK DISPATCH HOTLINE:</span>
          <a
            href="tel:7067400529"
            className="underline font-extrabold tracking-wide hover:text-slate-900 transition-colors"
          >
            (706) 740-0529
          </a>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-900">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Avg Crew Dispatch: 24 Mins
          </span>
          <span>•</span>
          <span>Free Homeowner & Carrier Triage</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('homeowner')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-lg tracking-tight">A-NewRoof</span>
                <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20">
                  24/7 DISPATCH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Emergency Tarp & Damage Mitigation Hub
              </p>
            </div>
          </div>

          {/* Call CTA Button Mobile / Desktop */}
          <div className="flex items-center gap-3">
            <a
              href="tel:7067400529"
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-md transition-all transform hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">CALL DISPATCH NOW:</span>
              <span>(706) 740-0529</span>
            </a>
          </div>
        </div>

        {/* Tab Bar */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/80 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
