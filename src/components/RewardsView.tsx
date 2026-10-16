import React, { useState } from 'react';
import { REWARDS_CATALOG, LEADERBOARD } from '../data/mockData';
import { RewardItem } from '../types';
import { PageHeader } from './ui/PageHeader';
import { Readings } from './ui/Readings';

interface RewardsViewProps {
  userPoints: number;
  onRedeem: (amount: number, voucherName: string) => void;
  showToast: (msg: string) => void;
}

const NEXT_TIER_AT = 2000;

export const RewardsView: React.FC<RewardsViewProps> = ({ userPoints, onRedeem, showToast }) => {
  const [activeVoucher, setActiveVoucher] = useState<RewardItem | null>(null);

  const toNextTier = Math.max(0, NEXT_TIER_AT - userPoints);
  const tierProgress = Math.min(100, Math.round((userPoints / NEXT_TIER_AT) * 100));

  const handleRedeemItem = (item: RewardItem) => {
    if (userPoints < item.points) {
      showToast(`You need ${item.points - userPoints} more Eco-Steps. Walk a shaded route to earn them.`);
      return;
    }
    onRedeem(item.points, item.title);
    setActiveVoucher(item);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-10 flex flex-col gap-10">
      <PageHeader
        title="Rewards"
        description="Walking and cycling the Elmina tracks earns Eco-Steps. Spend them at Elmina Lakeside Mall or on a native tree at ERKC."
      />

      {/* Balance and tier */}
      <section aria-label="Your balance" className="grid md:grid-cols-[auto_1fr] gap-x-16 gap-y-6 items-end -mt-4">
        <div>
          <p className="reading-label">Balance, Canopy Steward tier</p>
          <p className="mt-2">
            <span className="figure text-[72px] sm:text-[88px]">{userPoints.toLocaleString()}</span>
            <span className="ml-2 text-[20px] text-ink-2">pts</span>
          </p>
        </div>

        <div className="max-w-md pb-3">
          <p className="text-[15px]">
            {toNextTier > 0 ? (
              <>
                <span className="font-semibold num">{toNextTier} pts</span> to Elmina Biophilic Guardian
              </>
            ) : (
              <span className="font-semibold">You have reached Elmina Biophilic Guardian</span>
            )}
          </p>
          <div
            className="mt-2 h-2 bg-wash border border-rule-strong"
            role="progressbar"
            aria-valuenow={tierProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress to the next tier"
          >
            <div className="h-full bg-ink" style={{ width: `${tierProgress}%` }} />
          </div>
        </div>
      </section>

      <Readings
        className="-mt-4 border-t border-rule-strong"
        items={[
          { label: 'CO₂ avoided', value: '14.2', unit: 'kg' },
          { label: 'Distance on foot', value: '18.4', unit: 'km' },
          { label: 'Same as planting', value: '2.1', unit: 'trees' },
          { label: 'Daily streak', value: '12', unit: 'days' }
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_22rem] gap-x-14 gap-y-12 items-start">
        {/* Catalogue */}
        <section aria-labelledby="perks-title">
          <h2 id="perks-title" className="text-[28px]">
            Spend your Eco-Steps
          </h2>

          <ul className="mt-4 border-t border-rule-strong">
            {REWARDS_CATALOG.map((item) => {
              const canAfford = userPoints >= item.points;
              return (
                <li
                  key={item.id}
                  className="grid sm:grid-cols-[1fr_auto] gap-x-8 gap-y-3 py-5 border-b border-rule-strong"
                >
                  <div>
                    <p className="text-[14px] text-ink-2">{item.merchant}</p>
                    <h3 className="mt-1 text-[22px]">{item.title}</h3>
                    <p className="mt-2 text-[15px] text-ink-2 leading-relaxed max-w-[58ch]">{item.description}</p>
                  </div>
                  <div className="flex sm:flex-col sm:items-end justify-between sm:justify-start gap-3">
                    <p className="figure text-[30px] num">
                      {item.points}
                      <span className="ml-1 text-[14px] font-normal text-ink-2">pts</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRedeemItem(item)}
                      disabled={!canAfford}
                      className="btn btn-primary"
                    >
                      {canAfford ? 'Redeem' : `${item.points - userPoints} pts short`}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {activeVoucher && (
            <div className="mt-6 border border-dashed border-ink bg-paper p-5 flex flex-wrap items-center gap-5 rise-in">
              <div
                className="w-16 h-16 bg-paper border-2 border-ink p-1 grid grid-cols-3 gap-0.5 shrink-0"
                aria-hidden="true"
              >
                {[1, 0, 1, 0, 1, 0, 1, 1, 1].map((on, i) => (
                  <span key={i} className={on ? 'bg-ink' : 'bg-paper'} />
                ))}
              </div>
              <div className="flex-1 min-w-48">
                <p className="text-[14px] text-ink-2">Show this at the till</p>
                <h3 className="mt-0.5 text-[20px]">{activeVoucher.title}</h3>
                <p className="mt-1 font-semibold tracking-wider text-[15px] num">{activeVoucher.code}</p>
              </div>
              <button type="button" onClick={() => setActiveVoucher(null)} className="btn btn-quiet btn-sm">
                Dismiss
              </button>
            </div>
          )}
        </section>

        {/* Leaderboard */}
        <section aria-labelledby="board-title">
          <h2 id="board-title" className="text-[28px]">
            This week in Elmina
          </h2>
          <p className="mt-2 text-[15px] text-ink-2">
            Most active walkers across Elmina Valley, Ridge and Green.
          </p>

          <ol className="mt-4 border-t border-rule-strong">
            {LEADERBOARD.map((user) => {
              const isYou = user.name.includes('You');
              return (
                <li
                  key={user.rank}
                  className={`grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 py-3 border-b border-rule ${
                    isYou ? 'bg-canopy-tint -mx-3 px-3 border-b-rule-strong' : ''
                  }`}
                >
                  <span className="figure text-[22px] text-ink-2">{user.rank}</span>
                  <span className="min-w-0">
                    <span className={`block text-[15px] leading-snug ${isYou ? 'font-semibold' : ''}`}>
                      {user.name}
                    </span>
                    <span className="block text-[13px] text-ink-2">{user.badge}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[15px] font-semibold num">{user.steps}</span>
                    <span className="block text-[13px] text-ink-2 num">{user.savedCo2}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
};
