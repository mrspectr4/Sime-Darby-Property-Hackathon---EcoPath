import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationTab, EducationalPin } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
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
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable identity so effects that depend on showToast don't restart on every render.
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleRedeem = (amount: number, voucherName: string) => {
    setUserPoints((prev) => Math.max(0, prev - amount));
    showToast(`Redeemed: ${voucherName} (-${amount} pts)`);
  };

  const handleReportSubmit = (category: string) => {
    setUserPoints((prev) => prev + 20);
    showToast(`Report sent: ${category}. The township team has been alerted. +20 Eco-Steps.`);
  };

  return (
    <div className="min-h-screen bg-ground text-ink">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileNavOpen(false);
        }}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        userPoints={userPoints}
      />

      <div className="lg:pl-60 min-h-screen flex flex-col">
        <Header
          userPoints={userPoints}
          onOpenNotifications={() => showToast('3 active climate alerts.')}
          onOpenProfile={() => setIsRewardsModalOpen(true)}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          isMobileNavOpen={isMobileNavOpen}
        />

        <main className="relative pt-14 flex-1">
          {currentTab === 'township-map' && (
            <TownshipMap
              onOpenEduModal={(pin) => setActiveEduPin(pin)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onOpenRewardsModal={() => setIsRewardsModalOpen(true)}
              userPoints={userPoints}
              showToast={showToast}
            />
          )}

          {currentTab === 'climate-sensors' && <ClimateSensorsView showToast={showToast} />}

          {currentTab === 'canopy-planner' && (
            <CanopyRoutePlannerView
              onSelectRouteAndNavigate={() => {
                setCurrentTab('township-map');
                showToast('Route loaded on the map.');
              }}
              showToast={showToast}
            />
          )}

          {currentTab === 'rewards' && (
            <RewardsView userPoints={userPoints} onRedeem={handleRedeem} showToast={showToast} />
          )}

          {currentTab === 'accessibility' && <AccessibilityRadarView showToast={showToast} />}
        </main>
      </div>

      {activeEduPin && <EduModal pin={activeEduPin} onClose={() => setActiveEduPin(null)} />}

      {isReportModalOpen && (
        <ReportDefectModal
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReportSubmit}
        />
      )}

      {isRewardsModalOpen && (
        <RewardsModal
          onClose={() => setIsRewardsModalOpen(false)}
          userPoints={userPoints}
          onRedeem={handleRedeem}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal onClose={() => setIsSettingsModalOpen(false)} showToast={showToast} />
      )}

      <Toast message={toastMessage} />
    </div>
  );
}
