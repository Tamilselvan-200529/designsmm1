import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileNav } from './components/layout/MobileNav';
import { BrandModal } from './components/layout/BrandModal';
import { LoginView } from './components/auth/LoginView';
import { SignUpView } from './components/auth/SignUpView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardView } from './components/dashboard/DashboardView';
import { CalendarView } from './components/calendar/CalendarView';
import { ContentListView } from './components/content/ContentListView';
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { MediaLibraryView } from './components/media/MediaLibraryView';
import { ChannelsView } from './components/social/ChannelsView';
import { ChannelSettingsView } from './components/social/ChannelSettingsView';
import { TeamView } from './components/team/TeamView';
import { RolesPermissionsView } from './components/team/RolesPermissionsView';
import { SettingsView } from './components/settings/SettingsView';
import { OrgBrandsView } from './components/org/OrgBrandsView';
import { BillingView } from './components/org/BillingView';
import { ComposerView } from './components/composer/ComposerView';
import { ScheduleModal } from './components/publishing/ScheduleModal';
import { ScheduledPostsView } from './components/publishing/ScheduledPostsView';
import { UnpublishedPostsView } from './components/publishing/UnpublishedPostsView';
import { PublishingLogsDrawer } from './components/publishing/PublishingLogsDrawer';
import { SearchModal } from './components/common/SearchModal';
import { ToastContainer } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { AdminPortal } from './components/admin/AdminPortal';
import { canAccessPage, getDefaultPage } from './utils/rbac';
import { ShieldOff } from 'lucide-react';

const AccessDenied: React.FC<{ role: string; page: string }> = ({ role, page }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', gap: '16px', textAlign: 'center', padding: '40px'
  }}>
    <div style={{
      width: '72px', height: '72px', borderRadius: '50%',
      background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', marginBottom: '8px'
    }}>
      <ShieldOff size={32} color="#ef4444" />
    </div>
    <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
      Access Denied
    </h2>
    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, maxWidth: '360px' }}>
      Your role <strong>{role}</strong> does not have permission to access{' '}
      <strong>{page}</strong>.
    </p>
    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
      Contact your workspace administrator if you believe this is a mistake.
    </p>
  </div>
);

const AppContent: React.FC = () => {
  const { 
    isAuthenticated, 
    currentRoute, 
    navigateTo, 
    activeNav, 
    setActiveNav, 
    currentUser 
  } = useApp();
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
  // Track which channel's settings page is open (null = show list)
  const [channelSettingsAccount, setChannelSettingsAccount] = useState<import('./types').SocialAccount | null>(null);

  // ── Route 1: Public Landing Page ──────────────────────────────────────────
  if (currentRoute === '/') {
    return (
      <>
        <LandingPage
          onNavigateToLogin={() => navigateTo('/login')}
          onNavigateToSignup={() => navigateTo('/signup')}
        />
        <ToastContainer />
      </>
    );
  }

  // ── Route 2: Authentication Views (when not authenticated) ─────────────────
  if (!isAuthenticated) {
    return (
      <>
        {(currentRoute === '/signup' || authView === 'signup') ? (
          <SignUpView onSwitchView={(view) => {
            setAuthView(view);
            navigateTo(view === 'login' ? '/login' : view === 'signup' ? '/signup' : '/forgot');
          }} />
        ) : (currentRoute === '/forgot' || authView === 'forgot') ? (
          <ForgotPasswordView onSwitchView={(view) => {
            setAuthView(view);
            navigateTo(view === 'login' ? '/login' : view === 'signup' ? '/signup' : '/forgot');
          }} />
        ) : (
          <LoginView onSwitchView={(view) => {
            setAuthView(view);
            navigateTo(view === 'login' ? '/login' : view === 'signup' ? '/signup' : '/forgot');
          }} />
        )}
        <ToastContainer />
      </>
    );
  }

  // ── Route 3: Admin Portal (Owner / Admin) ──────────────────────────────────
  if (currentRoute === '/admin') {
    return (
      <>
        <AdminPortal />
        <ToastContainer />
      </>
    );
  }

  // ── Route 4: Main Application (Dashboard & Brand Views) ────────────────────
  const renderActiveView = () => {
    // RBAC route guard: block forbidden pages regardless of how the user arrived
    const role = currentUser.role;
    if (!canAccessPage(role, activeNav)) {
      const defaultPage = getDefaultPage(role);
      if (activeNav !== defaultPage) {
        setTimeout(() => setActiveNav(defaultPage), 0);
      }
      return <AccessDenied role={role} page={activeNav} />;
    }

    switch (activeNav) {
      // Brand Level Views
      case 'dashboard':
        return <DashboardView />;
      case 'calendar':
        return <CalendarView />;
      case 'scheduled-posts':
        return <ScheduledPostsView />;
      case 'content':
        return <ContentListView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'unpublished':
        return <UnpublishedPostsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'media':
        return <MediaLibraryView />;
      case 'social':
        return channelSettingsAccount
          ? <ChannelSettingsView account={channelSettingsAccount} onBack={() => setChannelSettingsAccount(null)} />
          : <ChannelsView onOpenSettings={setChannelSettingsAccount} />;
      case 'team':
        return <TeamView />;
      case 'settings':
        return <SettingsView />;

      // Organization Level Views
      case 'org-brands':
        return <OrgBrandsView />;
      case 'roles-permissions':
        return <RolesPermissionsView />;
      case 'org-settings':
        return <SettingsView initialTab="organization" />;
      case 'billing':
        return <BillingView />;

      case 'composer':
        return <ComposerView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Desktop Topbar */}
        <Topbar />

        {/* Mobile Top and Bottom Navigation */}
        <MobileNav />

        {/* Dynamic Page Content */}
        <main className="page-content">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Interactive Modals & Drawers */}
      <ScheduleModal />
      <BrandModal />
      <SearchModal />
      <PublishingLogsDrawer />
      <OnboardingWizard />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
