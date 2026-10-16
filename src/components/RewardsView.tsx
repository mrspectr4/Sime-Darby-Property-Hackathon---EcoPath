import React, { useState } from 'react';
import { REWARDS_CATALOG, LEADERBOARD } from '../data/mockData';
import { RewardItem } from '../types';

interface RewardsViewProps {
  userPoints: number;
  onRedeem: (amount: number, voucherName: string) => void;
  showToast: (msg: string) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  userPoints,
  onRedeem,
  showToast
}) => {
  const [activeVoucher, setActiveVoucher] = useState<RewardItem | null>(null);

  const handleRedeemItem = (item: RewardItem) => {
    if (userPoints < item.points) {
      showToast('Insufficient points. Walk along Elmina canopy tracks to earn more!');
      return;
    }
    onRedeem(item.points, item.title);
    setActiveVoucher(item);
    showToast(`Redeemed ${item.title}! Digital pass ready for cashier scan.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in duration-300">
      {/* User Tier & Summary Card */}
      <div className="bg-gradient-to-r from-[#006948] via-[#00855d] to-[#005236] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <span className="material-symbols-outlined text-[240px]">award_star</span>
        </div>

        <div className="flex flex-col z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#85f8c4]">
              Sime Darby Property Wellness Pass
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              City of Elmina, Selangor
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold mt-1">
            Canopy Steward Tier • Danish (Elmina Valley)
          </h1>
          <p className="text-xs text-[#85f8c4] mt-1 max-w-lg leading-relaxed">
            Your active journeys along the 90km Elmina jogging & cycling spine earn tokens redeemable at Elmina Lakeside Mall and native tree planting at ERKC.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs opacity-80">Available Balance</span>
              <span className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-white">
                {userPoints.toLocaleString()} <span className="text-sm font-normal text-[#85f8c4]">pts</span>
              </span>
            </div>

            <div className="w-px h-10 bg-white/20"></div>

            <div className="flex flex-col">
              <span className="text-xs opacity-80">Next Tier Progress</span>
              <span className="text-xs font-semibold text-white">
                580 pts to <strong className="text-[#85f8c4]">Elmina Biophilic Guardian</strong>
              </span>
              <div className="w-36 h-2 bg-white/20 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-[#85f8c4] rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-2 gap-3 z-10 sm:w-72">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <span className="text-[10px] text-white/80 uppercase font-semibold">CO₂ Avoided</span>
            <div className="font-['Plus_Jakarta_Sans'] text-xl font-bold mt-0.5">14.2 kg</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <span className="text-[10px] text-white/80 uppercase font-semibold">Track Walked</span>
            <div className="font-['Plus_Jakarta_Sans'] text-xl font-bold mt-0.5">18.4 km</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <span className="text-[10px] text-white/80 uppercase font-semibold">Tree Equiv.</span>
            <div className="font-['Plus_Jakarta_Sans'] text-xl font-bold mt-0.5">2.1 Trees</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <span className="text-[10px] text-white/80 uppercase font-semibold">Elmina Streak</span>
            <div className="font-['Plus_Jakarta_Sans'] text-xl font-bold mt-0.5">12 Days</div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog & Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rewards Catalog */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
              City of Elmina Merchant & Environmental Perks
            </h3>
            <span className="text-xs text-[#006948] font-bold">4 Verified Township Rewards</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REWARDS_CATALOG.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006948] bg-[#6cf8bb]/30 px-2 py-0.5 rounded-full">
                      {item.merchant}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#006948] bg-[#f2f3ff] px-2.5 py-1 rounded-full">
                      {item.points} pts
                    </span>
                  </div>

                  <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#131b2e] mt-2">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-[#3d4a42] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRedeemItem(item)}
                  disabled={userPoints < item.points}
                  className={`w-full py-2.5 rounded-full font-sans text-xs font-bold transition-all ${
                    userPoints >= item.points
                      ? 'bg-[#006948] hover:bg-[#00855d] text-white shadow-xs active:scale-98'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {userPoints >= item.points ? `Redeem Pass (-${item.points} pts)` : 'Insufficient Points'}
                </button>
              </div>
            ))}
          </div>

          {/* Active Voucher Display if any */}
          {activeVoucher && (
            <div className="p-4 bg-[#f5fff7] rounded-3xl border border-[#006948]/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-[#131b2e] p-1 rounded-lg flex items-center justify-center shrink-0">
                  <div className="grid grid-cols-3 gap-1 w-full h-full bg-white p-1">
                    <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
                    <div className="bg-white"></div><div className="bg-black"></div><div className="bg-white"></div>
                    <div className="bg-black"></div><div className="bg-black"></div><div className="bg-black"></div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#006948] font-bold uppercase tracking-wider">
                    Elmina Voucher Activated
                  </span>
                  <h5 className="font-bold text-xs text-[#131b2e]">{activeVoucher.title}</h5>
                  <span className="font-mono text-xs text-[#006948] font-bold">{activeVoucher.code}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveVoucher(null)}
                className="text-xs text-[#3d4a42] hover:text-[#131b2e] underline px-3"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Community Leaderboard */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#131b2e]">
              Elmina Precinct Leaderboard
            </h3>
            <span className="material-symbols-outlined text-[#825100] text-[20px]">emoji_events</span>
          </div>
          <p className="text-xs text-[#3d4a42]">
            Top active commuters across Elmina Valley, Elmina Ridge, and Elmina Green this week.
          </p>

          <div className="flex flex-col gap-2 mt-2">
            {LEADERBOARD.map((user) => (
              <div
                key={user.rank}
                className={`p-3 rounded-2xl flex items-center justify-between text-xs ${
                  user.name.includes('You')
                    ? 'bg-[#6cf8bb]/20 border border-[#6cf8bb] font-bold'
                    : 'bg-[#faf8ff] border border-[#eaedff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    user.rank === 1 ? 'bg-[#ffddb8] text-[#825100]' : 'bg-[#eaedff] text-[#3d4a42]'
                  }`}>
                    {user.rank}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[#131b2e] font-semibold">{user.name}</span>
                    <span className="text-[10px] text-[#3d4a42]">{user.badge}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#006948]">{user.steps}</span>
                  <span className="text-[10px] text-[#3d4a42] block">{user.savedCo2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
