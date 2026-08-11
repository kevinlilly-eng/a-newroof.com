import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeownerPortal } from './components/HomeownerPortal';
import { EmergencyDispatch } from './components/EmergencyDispatch';
import { CostEstimator } from './components/CostEstimator';
import { SupplementWriter } from './components/SupplementWriter';
import { ContractorMarketplace } from './components/ContractorMarketplace';
import { AiChatAssistant } from './components/AiChatAssistant';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('homeowner');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'homeowner' && (
          <HomeownerPortal
            onNavigateToEstimate={() => setActiveTab('estimate')}
            onNavigateToChat={() => setActiveTab('chat')}
          />
        )}
        {activeTab === 'dispatch' && <EmergencyDispatch />}
        {activeTab === 'estimate' && <CostEstimator />}
        {activeTab === 'supplement' && <SupplementWriter />}
        {activeTab === 'marketplace' && <ContractorMarketplace />}
        {activeTab === 'chat' && <AiChatAssistant />}
      </main>

      <Footer />
    </div>
  );
}
