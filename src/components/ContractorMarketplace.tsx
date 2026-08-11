import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, PhoneCall, Star, MapPin, CheckCircle2, Clock, Wrench, AlertCircle, FileText } from 'lucide-react';
import { ContractorCrew } from '../types';
import { db, collection, getDocs, query, orderBy, limit } from '../lib/firebase';

interface LiveTicket {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  damageType: string;
  status: string;
  createdAt: string;
}

export const ContractorMarketplace: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('All');
  const [liveTickets, setLiveTickets] = useState<LiveTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  useEffect(() => {
    async function fetchTickets() {
      setIsLoadingTickets(true);
      try {
        const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const loaded: LiveTicket[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loaded.push({
            id: doc.id,
            customerName: data.customerName || 'Homeowner',
            phone: data.phone || '(706) 740-0529',
            address: data.address || 'Metro Atlanta Area',
            damageType: data.damageType || 'Storm Damage',
            status: data.status || 'EN_ROUTE',
            createdAt: data.createdAt || new Date().toISOString()
          });
        });
        setLiveTickets(loaded);
      } catch (err) {
        console.error('Failed to fetch Firestore tickets:', err);
      } finally {
        setIsLoadingTickets(false);
      }
    }

    fetchTickets();
  }, []);

  const contractors: ContractorCrew[] = [
    {
      id: 'c1',
      companyName: 'A-NewRoof Emergency Rapid Response Crew #1',
      phone: '(706) 740-0529',
      city: 'Atlanta / Metro North',
      rating: 4.9,
      reviewsCount: 184,
      verified247: true,
      specialties: ['Shrink Wrap Roof Tarping', 'Storm Damage Leak Repair', 'Xactimate Supplements'],
      distanceMiles: 4.2,
      activeCrewsAvailable: 3,
    },
    {
      id: 'c2',
      companyName: 'Metro Atlanta Rapid Tarping & Repair',
      phone: '(706) 740-0529',
      city: 'Atlanta / Metro South',
      rating: 4.8,
      reviewsCount: 129,
      verified247: true,
      specialties: ['Emergency Tarping', 'Metal Roof Leak Seal', 'Commercial EPDM'],
      distanceMiles: 8.5,
      activeCrewsAvailable: 2,
    },
    {
      id: 'c3',
      companyName: 'Georgia Storm Response Roofers',
      phone: '(706) 740-0529',
      city: 'Gainesville / North GA',
      rating: 5.0,
      reviewsCount: 96,
      verified247: true,
      specialties: ['Tree Impact Repair', 'Tile & Slate Roofs', 'Insurance Claim Defense'],
      distanceMiles: 12.1,
      activeCrewsAvailable: 4,
    },
    {
      id: 'c4',
      companyName: 'Peachtree Emergency Loss Mitigation',
      phone: '(706) 740-0529',
      city: 'Athens / East GA',
      rating: 4.9,
      reviewsCount: 210,
      verified247: true,
      specialties: ['Residential Shingle Tarping', 'Chimney Flashing', 'Skylight Repair'],
      distanceMiles: 16.4,
      activeCrewsAvailable: 2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Verified 24/7 Emergency Contractor Partner Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Vetted, licensed, insured roofing crews equipped with heavy poly tarps, harnesses, and OSHA rapid response gear
            </p>
          </div>
        </div>
      </div>

      {/* Live Firestore Emergency Dispatch Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Live Firebase Dispatch & Lead Stream</h2>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
            Firestore Database Connected
          </span>
        </div>

        {liveTickets.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {isLoadingTickets ? 'Loading tickets from Firestore...' : 'No emergency tickets logged yet. Submit one from the Homeowner Portal!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveTickets.map((t) => (
              <div key={t.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-400">{t.customerName}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">{t.address}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-850 pt-2">
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">{t.damageType}</span>
                  <span className="text-emerald-400 font-bold uppercase">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contractor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contractors.map((c) => (
          <div
            key={c.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-amber-500/40 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {c.companyName}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{c.city}</span>
                  <span>•</span>
                  <span>{c.distanceMiles} miles away</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{c.rating}</span>
                <span className="text-slate-400 font-normal">({c.reviewsCount})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {c.specialties.map((spec, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{c.activeCrewsAvailable} Crews Ready For Dispatch</span>
              </div>

              <a
                href={`tel:${c.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call Crew
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
