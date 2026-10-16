import React from 'react';
import { EducationalPin } from '../types';
import { Modal } from './ui/Modal';

interface EduModalProps {
  pin: EducationalPin;
  onClose: () => void;
}

export const EduModal: React.FC<EduModalProps> = ({ pin, onClose }) => (
  <Modal
    title={pin.title}
    description={pin.badge}
    onClose={onClose}
    widthClass="max-w-md"
    footer={
      <button type="button" onClick={onClose} className="btn btn-primary">
        Back to the map
      </button>
    }
  >
    <p className="text-[16px] leading-relaxed text-ink-2">{pin.body}</p>

    <dl className="mt-5 pt-4 border-t border-rule flex items-baseline justify-between gap-4">
      <dt className="reading-label">EcoPath benchmark</dt>
      <dd className="font-semibold text-[16px] text-right num">{pin.stat}</dd>
    </dl>
  </Modal>
);
