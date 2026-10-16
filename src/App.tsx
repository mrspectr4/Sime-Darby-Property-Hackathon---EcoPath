import React, { useState } from 'react';
import { NavigationTab, EducationalPin } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { TownshipMap } from './components/TownshipMap';
import { ClimateSensorsView } from './components/ClimateSensorsView';
import { CanopyRoutePlannerView } from './components/CanopyRoutePlannerView';
import { RewardsView } from './components/RewardsView';
import { AccessibilityRadarView } from './components/AccessibilityRadarView';
import { EduModal } from './components/EduModal';
import { ReportDefectModal } from './components/ReportDefectModal';
import { RewardsModal } from './components/RewardsModal';
import { SettingsModal } from './components/SettingsModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('township-map');
  const [userPoints, setUserPoints] = useState<number>(1420);
  const [activeEduPin, setActiveEduPin] = useState<EducationalPin | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRedeem = (amount: number, voucherName: string) => {
    setUserPoints((prev) => Math.max(0, prev - amount));
    showToast(`Voucher redeemed: ${voucherName} (-${amount} pts)`);
  };

  const handleReportSubmit = (category: string, zone: string, notes: string) => {
    setUserPoints((prev) => prev + 20);
    showToast(`Issue reported: "${category}". Municipal team alerted! +20 Eco-Steps added.`);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#85f8c4] selection:text-[#002114]">
      {/* Fixed Top Header */}
      <Header
        onOpenNotifications={() => showToast('Displaying 3 active civic micro-climate alerts.')}
        onOpenProfile={() => setIsRewardsModalOpen(true)}
        onOpenFilter={() => showToast('Display layer filters: High contrast & canopy mesh enabled.')}
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
      />

      {/* Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileNavOpen(false);
        }}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Screen Content Viewport */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        <main className="relative pt-16 pb-7 w-full bg-[#faf8ff] flex-1">
          {currentTab === 'township-map' && (
            <TownshipMap
              onOpenEduModal={(pin) => setActiveEduPin(pin)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onOpenRewardsModal={() => setIsRewardsModalOpen(true)}
              userPoints={userPoints}
              showToast={showToast}
            />
          )}

          {currentTab === 'climate-sensors' && (
            <ClimateSensorsView showToast={showToast} />
          )}

          {currentTab === 'canopy-planner' && (
            <CanopyRoutePlannerView
              onSelectRouteAndNavigate={() => {
                setCurrentTab('township-map');
                showToast('Canopy Greenway Spine loaded into live map navigation!');
              }}
              showToast={showToast}
            />
          )}

          {currentTab === 'rewards' && (
            <RewardsView
              userPoints={userPoints}
              onRedeem={handleRedeem}
              showToast={showToast}
            />
          )}

          {currentTab === 'accessibility' && (
            <AccessibilityRadarView showToast={showToast} />
          )}
        </main>
      </div>

      {/* Fixed Bottom Telemetry Footer */}
      <Footer />

      {/* Interactive Modals */}
      <EduModal
        pin={activeEduPin}
        onClose={() => setActiveEduPin(null)}
      />

      <ReportDefectModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        userPoints={userPoints}
        onRedeem={handleRedeem}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        showToast={showToast}
      />

      {/* Toast Banner */}
      <Toast message={toastMessage} />
    </div>
  );
}
