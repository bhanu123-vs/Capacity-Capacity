import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SplashScreen } from './components/common/SplashScreen';
import { AuthGatewayPage } from './components/auth/AuthGatewayPage';

// Trainee Views
import { TraineeDashboard } from './components/trainee/TraineeDashboard';
import { MyCoursesView } from './components/trainee/MyCoursesView';
import { CoursePlayer } from './components/trainee/CoursePlayer';
import { AssessmentQuizView } from './components/trainee/AssessmentQuizView';
import { CertificatesView, CertificateModal } from './components/trainee/CertificatesView';
import { KnowledgeLibraryView } from './components/trainee/KnowledgeLibraryView';

// Trainer Views
import { TrainerDashboard } from './components/trainer/TrainerDashboard';
import { CreateContentView } from './components/trainer/CreateContentView';
import { QuestionnaireBuilderView } from './components/trainer/QuestionnaireBuilderView';
import { TraineeAnalyticsView } from './components/trainer/TraineeAnalyticsView';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserApprovalView } from './components/admin/UserApprovalView';
import { RoleManagementView } from './components/admin/RoleManagementView';
import { GlobalStatisticsView } from './components/admin/GlobalStatisticsView';
import { AnnouncementsManagerView } from './components/admin/AnnouncementsManagerView';

// Common Modals
import { FirebaseSetupModal } from './components/common/FirebaseSetupModal';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileModal } from './components/common/ProfileModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { Footer } from './components/common/Footer';
import { AIDoubtSolverWidget } from './components/common/AIDoubtSolverWidget';
import { AIDoubtSolverStudio } from './components/trainee/AIDoubtSolverStudio';

const MainLayout: React.FC = () => {
  const { 
    currentRole, 
    activeTab, 
    activeCoursePlayer, 
    selectedCertificateModal, 
    closeCertificateModal,
    announcements
  } = useApp();

  // Urgent circular banner if any
  const urgentAnnouncement = announcements.find(a => a.priority === 'Urgent');

  // View Router
  const renderActiveView = () => {
    // If Course Player is active, prioritize it
    if (activeCoursePlayer) {
      return <CoursePlayer />;
    }

    // Role-specific routing
    if (currentRole === 'Trainee') {
      switch (activeTab) {
        case 'Dashboard':
          return <TraineeDashboard />;
        case 'AI Doubt Solver':
          return <AIDoubtSolverStudio />;
        case 'My Courses':
          return <MyCoursesView />;
        case 'MCQ Assessments':
          return <AssessmentQuizView />;
        case 'Certificates':
          return <CertificatesView />;
        case 'Knowledge Library':
          return <KnowledgeLibraryView />;
        default:
          return <TraineeDashboard />;
      }
    }

    if (currentRole === 'Trainer') {
      switch (activeTab) {
        case 'Dashboard':
          return <TrainerDashboard />;
        case 'AI Doubt Solver':
          return <AIDoubtSolverStudio />;
        case 'Create Content':
          return <CreateContentView />;
        case 'Questionnaires':
          return <QuestionnaireBuilderView />;
        case 'Trainee Analytics':
          return <TraineeAnalyticsView />;
        case 'Knowledge Library':
          return <KnowledgeLibraryView />;
        default:
          return <TrainerDashboard />;
      }
    }

    if (currentRole === 'Admin') {
      switch (activeTab) {
        case 'Dashboard':
          return <AdminDashboard />;
        case 'User Approval':
          return <UserApprovalView />;
        case 'Role Management':
          return <RoleManagementView />;
        case 'Global Statistics':
          return <GlobalStatisticsView />;
        case 'Announcements':
          return <AnnouncementsManagerView />;
        default:
          return <AdminDashboard />;
      }
    }

    return <TraineeDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Urgent Advisory Notice Banner */}
      {urgentAnnouncement && (
        <div className="bg-red-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <span className="bg-white text-red-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase shrink-0">
              URGENT ADVISORY
            </span>
            <span className="truncate">{urgentAnnouncement.title}: {urgentAnnouncement.content}</span>
          </div>
        </div>
      )}

      {/* Main App Body */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 gap-6">
        {/* Dynamic Role-Based Sidebar */}
        <div className="no-print">
          <Sidebar />
        </div>

        {/* Content View Container */}
        <main className="flex-1 min-w-0 pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Comprehensive Footer */}
      <Footer variant="light" />

      {/* Modal Dialogs */}
      {selectedCertificateModal && (
        <CertificateModal
          cert={selectedCertificateModal}
          onClose={closeCertificateModal}
        />
      )}

      <FirebaseSetupModal />
      <AuthModal />
      <ProfileModal />
      <NotificationDrawer />
      <AIDoubtSolverWidget />
    </div>
  );
};

const RootAppRouter: React.FC = () => {
  const { showSplash, setShowSplash, authUser, sessionUser, isGuestMode, authLoading } = useApp();

  // 1. First at start: Splash Screen with Logo and "CAPACITY CONNECT"
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // 2. Next: If user is authenticated/registered via Firebase/OTP OR in demo guest session, continue with dashboard
  if (authUser || sessionUser || isGuestMode) {
    return <MainLayout />;
  }

  // 3. Otherwise: Dedicated Sign In or Sign Up Gateway Page
  return (
    <>
      <AuthGatewayPage />
      <FirebaseSetupModal />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <RootAppRouter />
    </AppProvider>
  );
}

