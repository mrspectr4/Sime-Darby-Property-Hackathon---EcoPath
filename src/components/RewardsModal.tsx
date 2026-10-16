import React, { useState, useEffect } from 'react';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  onRedeem: (amount: number, voucherName: string) => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  userPoints,
  onRedeem
}) => {
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(23 * 60 + 15);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleRedeemClick = () => {
    if (userPoints < 400 && !isRedeemed) return;
    setIsRedeemed(true);
    onRedeem(400, 'RM20 Voucher at Elmina Lakeside Mall');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#dae2fd] flex flex-col gap-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="rewards-modal-title"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6cf8bb]/40 text-[#006948] flex items-center justify-center border border-[#6cf8bb]">
              <span className="material-symbols-outlined text-[24px]">award_star</span>
            </div>
            <div>
              <h3 id="rewards-modal-title" className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#131b2e]">
                Eco-Steps Rewards
              </h3>
              <p className="font-sans text-xs text-[#006c49] font-bold">
                City of Elmina • Canopy Steward ({userPoints} pts)
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3d4a42] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="font-sans text-xs text-[#3d4a42] leading-relaxed">
          You earn verified civic tokens each time you commute along Elmina's 90km dedicated jogging track and shaded rainforest walkways instead of driving.
        </p>

        {/* Cumulative Civic Impact Stats */}
        <div className="grid grid-cols-3 gap-2 bg-[#f2f3ff] p-3.5 rounded-2xl border border-[#dae2fd]/60 text-center">
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#006948]">14.2</span>
            <span className="font-sans text-[10px] text-[#3d4a42] font-medium">kg CO₂ Saved</span>
          </div>
          <div className="flex flex-col border-x border-[#dae2fd]/60">
            <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#006948]">18.4</span>
            <span className="font-sans text-[10px] text-[#3d4a42] font-medium">km Walked</span>
          </div>
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#006948]">2.1</span>
            <span className="font-sans text-[10px] text-[#3d4a42] font-medium">Trees Planted</span>
          </div>
        </div>

        {/* Featured Retailer Reward Card */}
        <div className="bg-[#006948]/5 rounded-2xl p-4 flex flex-col gap-3 border border-[#006948]/15">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-sans text-[10px] text-[#006948] font-bold uppercase tracking-wider">
                Elmina Lakeside Mall Perk
              </span>
              <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#131b2e] mt-0.5">
                RM20 Cash Voucher at Lakeside Mall
              </h4>
              <p className="font-sans text-[11px] text-[#3d4a42] mt-0.5">
                Valid at all waterfront concourse restaurants & grocers.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#006948] text-white font-sans text-xs font-bold shrink-0">
              400 pts
            </span>
          </div>

          {/* QR Code Bar for In-Store Scan */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#dae2fd] shadow-xs">
            <div className="w-16 h-16 bg-[#131b2e] p-1 rounded-lg flex items-center justify-center shrink-0">
              {/* QR Pattern */}
              <div className="grid grid-cols-4 gap-0.5 w-full h-full bg-white p-1 rounded">
                <div className="bg-[#131b2e]"></div><div className="bg-[#faf8ff]"></div><div className="bg-[#131b2e]"></div><div className="bg-[#131b2e]"></div>
                <div className="bg-[#faf8ff]"></div><div className="bg-[#131b2e]"></div><div className="bg-[#faf8ff]"></div><div className="bg-[#131b2e]"></div>
                <div className="bg-[#131b2e]"></div><div className="bg-[#131b2e]"></div><div className="bg-[#faf8ff]"></div><div className="bg-[#faf8ff]"></div>
                <div className="bg-[#faf8ff]"></div><div className="bg-[#131b2e]"></div><div className="bg-[#131b2e]"></div><div className="bg-[#131b2e]"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[10px] text-[#3d4a42]">Show barcode at cashier</span>
              <span className="font-mono text-xs font-bold text-[#006948] tracking-wider">
                ELMINA-MALL-20RM-VAL
              </span>
              <span className="font-sans text-[10px] text-[#825100] font-semibold mt-0.5">
                Expires in {minutes}m {seconds.toString().padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleRedeemClick}
          disabled={isRedeemed || userPoints < 400}
          className={`w-full py-3 rounded-full font-sans text-xs font-bold shadow-md transition-all ${
            isRedeemed
              ? 'bg-[#00855d] text-white cursor-default'
              : userPoints < 400
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-[#006948] hover:bg-[#00855d] text-white active:scale-98'
          }`}
        >
          {isRedeemed ? '✓ Voucher Activated for In-Store Scan' : 'Redeem Voucher (-400 pts)'}
        </button>
      </div>
    </div>
  );
};
