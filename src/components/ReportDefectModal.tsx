import React, { useState } from 'react';

interface ReportDefectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: string, zone: string, notes: string) => void;
}

export const ReportDefectModal: React.FC<ReportDefectModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Broken Streetlight');
  const [notes, setNotes] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Broken Streetlight',
    'Pothole / Pavement Defect',
    'Foliage Obstruction',
    'Wheelchair Ramp Blocked'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedCategory, 'City of Elmina • Zone 2 (Rainbow Bridge & Central Park)', notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#dae2fd] flex flex-col gap-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="report-modal-title"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">report_problem</span>
            </div>
            <div>
              <h3 id="report-modal-title" className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#131b2e]">
                Report Path Defect
              </h3>
              <p className="font-sans text-xs text-[#3d4a42]">
                Help municipal teams keep pathways safe & barrier-free.
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

        {/* Issue Categories */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-[11px] uppercase tracking-wider text-[#3d4a42] font-bold">
            Select Anomaly Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3.5 py-2.5 rounded-xl font-sans text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#00855d] text-white shadow-xs ring-2 ring-[#00855d]/30'
                      : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{cat}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] text-white">check</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Pin Details */}
        <div className="bg-[#f2f3ff] p-3.5 rounded-2xl flex items-center justify-between border border-[#dae2fd]/60">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#006948] text-[22px]">pin_drop</span>
            <div className="flex flex-col">
              <span className="font-sans text-[11px] text-[#3d4a42]">Automatic Geolocation</span>
              <span className="font-sans text-xs font-bold text-[#131b2e]">City of Elmina, Shah Alam (Central Park Zone 2)</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#6cf8bb] text-[#00714d] text-[10px] font-bold">
            GPS Verified
          </span>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="font-sans text-[11px] uppercase tracking-wider text-[#3d4a42] font-bold block mb-1">
            Additional Observations (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Overhanging branch low over bike lane near pole #42..."
            rows={2}
            className="w-full text-xs p-3 rounded-2xl bg-[#faf8ff] border border-[#dae2fd] text-[#131b2e] placeholder-[#6d7a72] focus:outline-none focus:ring-2 focus:ring-[#006948]"
          />
        </div>

        {/* Photo Upload Box Placeholder */}
        <div 
          onClick={() => setHasPhoto(!hasPhoto)}
          className={`w-full h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors border-2 border-dashed ${
            hasPhoto ? 'bg-[#f5fff7] border-[#00855d]' : 'bg-[#f2f3ff] border-[#dae2fd] hover:bg-[#eaedff]'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${hasPhoto ? 'text-[#00855d]' : 'text-[#6d7a72]'}`}>
            {hasPhoto ? 'check_circle' : 'add_a_photo'}
          </span>
          <span className="font-sans text-xs text-[#3d4a42] mt-1 font-medium">
            {hasPhoto ? 'Photo attached (canopy_defect_01.jpg)' : 'Tap to attach field photo proof'}
          </span>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f2f3ff]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-sans text-xs font-semibold text-[#3d4a42] hover:bg-[#eaedff] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#006948] hover:bg-[#00855d] text-white font-sans text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Submit Report (+20 Eco-Steps)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
