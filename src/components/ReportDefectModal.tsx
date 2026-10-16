import React, { useState } from 'react';
import { Icon } from './ui/Icon';
import { Modal } from './ui/Modal';

interface ReportDefectModalProps {
  onClose: () => void;
  onSubmit: (category: string, zone: string, notes: string) => void;
}

const CATEGORIES = [
  'Broken streetlight',
  'Pothole or damaged pavement',
  'Branches blocking the path',
  'Wheelchair ramp blocked'
];

const ZONE = 'Zone 2, Rainbow Bridge and Central Park';

export const ReportDefectModal: React.FC<ReportDefectModalProps> = ({ onClose, onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedCategory, ZONE, notes);
    onClose();
  };

  return (
    <Modal
      title="Report a path problem"
      description="Tell the township team what needs fixing."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-quiet">
            Cancel
          </button>
          <button type="submit" form="report-form" className="btn btn-primary">
            Send report (+20 Eco-Steps)
          </button>
        </>
      }
    >
      <form id="report-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        <fieldset>
          <legend className="reading-label mb-2">What is the problem?</legend>
          <div className="seg flex-wrap" role="group">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="flex items-start gap-2.5 text-[15px]">
          <Icon name="pin_drop" size={19} className="mt-0.5 shrink-0 text-ink-2" />
          <span>
            <span className="block font-semibold">{ZONE}</span>
            <span className="block text-[13px] text-ink-2">Location taken from your phone</span>
          </span>
        </p>

        <label className="block">
          <span className="reading-label block mb-1.5">Anything else we should know? (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="For example: a low branch over the bike lane near pole 42"
            rows={3}
            className="field"
          />
        </label>

        <button
          type="button"
          onClick={() => setHasPhoto(!hasPhoto)}
          aria-pressed={hasPhoto}
          className="btn btn-secondary justify-start h-14 border-dashed"
        >
          <Icon name={hasPhoto ? 'check_circle' : 'add_a_photo'} size={20} className={hasPhoto ? 'text-canopy' : 'text-ink-2'} />
          {hasPhoto ? 'Photo attached (canopy_defect_01.jpg)' : 'Add a photo'}
        </button>
      </form>
    </Modal>
  );
};
