import React, { useEffect, useState } from 'react';
import { Modal } from './ui/Modal';

interface RewardsModalProps {
  onClose: () => void;
  userPoints: number;
  onRedeem: (amount: number, voucherName: string) => void;
}

const VOUCHER_COST = 400;

export const RewardsModal: React.FC<RewardsModalProps> = ({ onClose, userPoints, onRedeem }) => {
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(23 * 60 + 15);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const canAfford = userPoints >= VOUCHER_COST;

  const handleRedeemClick = () => {
    if (!canAfford || isRedeemed) return;
    setIsRedeemed(true);
    onRedeem(VOUCHER_COST, 'RM20 Voucher at Elmina Lakeside Mall');
  };

  return (
    <Modal
      title="Rewards pass"
      description={`Canopy Steward, ${userPoints.toLocaleString()} pts`}
      onClose={onClose}
      widthClass="max-w-md"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-quiet">
            Close
          </button>
          <button
            type="button"
            onClick={handleRedeemClick}
            disabled={isRedeemed || !canAfford}
            className="btn btn-primary"
          >
            {isRedeemed ? 'Voucher ready to scan' : canAfford ? `Redeem for ${VOUCHER_COST} pts` : `${VOUCHER_COST - userPoints} pts short`}
          </button>
        </>
      }
    >
      <p className="text-[15px] leading-relaxed text-ink-2">
        You earn Eco-Steps each time you walk or cycle Elmina&rsquo;s shaded tracks instead of driving.
      </p>

      <dl className="mt-4 grid grid-cols-3 border-y border-rule">
        {[
          ['CO₂ avoided', '14.2', 'kg'],
          ['On foot', '18.4', 'km'],
          ['Trees planted', '2.1', '']
        ].map(([label, value, unit], i) => (
          <div key={label} className={`py-3 ${i > 0 ? 'pl-4 border-l border-rule' : ''}`}>
            <dt className="reading-label">{label}</dt>
            <dd className="figure text-[28px] mt-1">
              {value}
              {unit && <span className="ml-1 text-[14px] font-normal text-ink-2">{unit}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 border border-dashed border-ink p-4 flex items-center gap-4">
        <div className="w-16 h-16 border-2 border-ink p-1 grid grid-cols-4 gap-0.5 shrink-0" aria-hidden="true">
          {[1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1].map((on, i) => (
            <span key={i} className={on ? 'bg-ink' : 'bg-paper'} />
          ))}
        </div>
        <div>
          <h3 className="text-[19px]">RM20 voucher, Lakeside Mall</h3>
          <p className="text-[14px] text-ink-2 mt-0.5">Valid at the waterfront restaurants and grocers.</p>
          <p className="mt-1.5 text-[14px] num">
            <span className="font-semibold tracking-wider">ELMINA-MALL-20RM-VAL</span>
          </p>
          <p className="text-[13px] text-laterite-ink num">
            Expires in {minutes} min {seconds.toString().padStart(2, '0')} s
          </p>
        </div>
      </div>
    </Modal>
  );
};
