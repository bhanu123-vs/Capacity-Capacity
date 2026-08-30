import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import {
  auth,
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  testFirestoreConnection
} from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  UserRole,
  UserProfile,
  Course,
  Assessment,
  Certificate,
  KnowledgeDocument,
  Announcement,
  PendingUserApproval,
  CompetencyMetric
} from '../types';
import {
  INITIAL_USER_PROFILES,
  INITIAL_COURSES,
  INITIAL_ASSESSMENTS,
  INITIAL_CERTIFICATES,
  INITIAL_KNOWLEDGE_DOCUMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PENDING_APPROVALS,
  INITIAL_COMPETENCIES,
  INITIAL_TRAINEE_ANALYTICS
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Firebase & Real-time OTP Auth
  authUser: User | null;
  sessionUser: UserProfile | null;
  authLoading: boolean;
  isGuestMode: boolean;
  setIsGuestMode: (guest: boolean) => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  signupWithFirebase: (email: string, pass: string, profileData: Partial<UserProfile> & { role: UserRole }) => Promise<void>;
  loginWithFirebase: (email: string, pass: string) => Promise<void>;
  authenticateWithOtpUser: (userProfile: UserProfile, token?: string) => Promise<void>;
  logoutWithFirebase: () => Promise<void>;
  
  // Courses
  courses: Course[];
  enrolledCourses: Course[];
  enrollInCourse: (courseId: string) => void;
  updateCourseProgress: (courseId: string, moduleId: string, completed: boolean) => void;
  addNewCourse: (courseData: Partial<Course>) => Course;
  
  // Active learning player
  activeCoursePlayer: Course | null;
  openCoursePlayer: (course: Course) => void;
  closeCoursePlayer: () => void;
  
  // Assessments
  assessments: Assessment[];
  activeAssessment: Assessment | null;
  startAssessment: (assessment: Assessment) => void;
  closeAssessment: () => void;
  submitAssessmentAttempt: (
    assessmentId: string,
    answers: Record<string, number>,
    score: number,
    total: number,
    percentage: number,
    passed: boolean,
    timeSpentSeconds: number
  ) => Certificate | null;
  addNewAssessment: (assessmentData: Partial<Assessment>) => void;
  
  // Certificates
  certificates: Certificate[];
  activeCertificateModal: Certificate | null;
  openCertificateModal: (cert: Certificate) => void;
  closeCertificateModal: () => void;
  verifyCertificateByNumber: (certNumber: string) => Certificate | null;
  
  // Knowledge Library
  documents: KnowledgeDocument[];
  activeDocumentPreview: KnowledgeDocument | null;
  openDocumentPreview: (doc: KnowledgeDocument) => void;
  closeDocumentPreview: () => void;
  
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'isRead'>) => void;
  markAnnouncementAsRead: (id: string) => void;
  unreadAnnouncementsCount: number;
  
  // Admin Approvals
  pendingApprovals: PendingUserApproval[];
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
  
  // Competencies
  competencies: CompetencyMetric[];
  updateCompetencyScore: (skill: string, score: number) => void;
  
  // Trainee Analytics
  traineeAnalytics: typeof INITIAL_TRAINEE_ANALYTICS;
  
  // UI & Modals
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isFirebaseModalOpen: boolean;
  setIsFirebaseModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  
  // Staff Directory & Announcements extras
  allStaffUsers: UserProfile[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  createAnnouncement: (announcementData: {
    title: string;
    content: string;
    priority: Announcement['priority'];
    targetRole: Announcement['targetRole'];
    department: string;
    author: string;
  }) => void;
  deleteAnnouncement: (id: string) => void;
  currentRole: UserRole;
  selectedCertificateModal: Certificate | null;

  // Reset demo data
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Role and Navigation
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('cc_active_role');
    return (saved as UserRole) || 'Trainee';
  });

  const [activeTab, setActiveTabState] = useState<string>('Dashboard');

  // User Profiles per role
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>(() => {
    const saved = localStorage.getItem('cc_user_profiles');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILES;
  });

  const currentUser = userProfiles[role] || INITIAL_USER_PROFILES[role];

  const setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>> = (updater) => {
    setUserProfiles(prev => {
      const updatedUser = typeof updater === 'function' ? updater(prev[role]) : updater;
      const next = { ...prev, [role]: updatedUser };
      localStorage.setItem('cc_user_profiles', JSON.stringify(next));
      return next;
    });
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('cc_active_role', newRole);
    setActiveTabState('Dashboard');
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  // 2. Courses State
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('cc_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  // 3. Assessments State
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('cc_assessments');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  // 4. Certificates State
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('cc_certificates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  // 5. Knowledge Documents
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(() => {
    const saved = localStorage.getItem('cc_documents');
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_DOCUMENTS;
  });

  // 6. Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('cc_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // 7. Approvals
  const [pendingApprovals, setPendingApprovals] = useState<PendingUserApproval[]>(() => {
    const saved = localStorage.getItem('cc_approvals');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_APPROVALS;
  });

  // 8. Competencies
  const [competencies, setCompetencies] = useState<CompetencyMetric[]>(() => {
    const saved = localStorage.getItem('cc_competencies');
    return saved ? JSON.parse(saved) : INITIAL_COMPETENCIES;
  });

  // 9. Trainee Analytics
  const [traineeAnalytics, setTraineeAnalytics] = useState(() => {
    const saved = localStorage.getItem('cc_analytics');
    return saved ? JSON.parse(saved) : INITIAL_TRAINEE_ANALYTICS;
  });

  // Active Modals & Viewers
  const [activeCoursePlayer, setActiveCoursePlayer] = useState<Course | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [activeCertificateModal, setActiveCertificateModal] = useState<Certificate | null>(null);
  const [activeDocumentPreview, setActiveDocumentPreview] = useState<KnowledgeDocument | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Firebase Auth State
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [sessionUser, setSessionUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('cc_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    // Initial connectivity test
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setAuthUser(fbUser);
      setAuthLoading(false);

      if (fbUser) {
        try {
          // Fetch existing user role & data from Cloud Firestore
          const firestoreProfile = await getUserProfileFromFirestore(fbUser.uid);
          if (firestoreProfile && firestoreProfile.role) {
            setRoleState(firestoreProfile.role);
            localStorage.setItem('cc_active_role', firestoreProfile.role);
            
            setUserProfiles(prev => {
              const next = {
                ...prev,
                [firestoreProfile.role]: {
                  ...prev[firestoreProfile.role],
                  ...firestoreProfile,
                  id: fbUser.uid,
                  name: firestoreProfile.name || fbUser.displayName || prev[firestoreProfile.role]?.name || 'Meteorological Officer',
                  email: fbUser.email || firestoreProfile.email
                }
              };
              localStorage.setItem('cc_user_profiles', JSON.stringify(next));
              return next;
            });
          } else {
            // First time auth without profile doc: Save to Firestore
            const currentSavedRole = (localStorage.getItem('cc_active_role') as UserRole) || 'Trainee';
            await saveUserProfileToFirestore(fbUser.uid, {
              uid: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Meteorological Officer',
              email: fbUser.email || '',
              role: currentSavedRole,
              status: 'Active'
            });
          }
        } catch (err) {
          console.warn("Could not sync profile with Firestore, using fallback local profile:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signupWithFirebase = async (
    email: string,
    pass: string,
    profileData: Partial<UserProfile> & { role: UserRole }
  ) => {
    setAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      if (profileData.name) {
        await updateProfile(user, { displayName: profileData.name });
      }

      // Store the user's role and details in Cloud Firestore users/{uid}
      await saveUserProfileToFirestore(user.uid, {
        uid: user.uid,
        name: profileData.name || user.email?.split('@')[0] || 'Meteorological Officer',
        email: user.email || email,
        role: profileData.role,
        department: profileData.department,
        designation: profileData.designation,
        employeeId: profileData.employeeId,
        centerLocation: profileData.centerLocation,
        status: 'Active'
      });

      // Update state locally
      setRoleState(profileData.role);
      localStorage.setItem('cc_active_role', profileData.role);

      setUserProfiles(prev => {
        const next = {
          ...prev,
          [profileData.role]: {
            ...prev[profileData.role],
            id: user.uid,
            name: profileData.name || 'Meteorological Officer',
            email,
            role: profileData.role,
            department: profileData.department || prev[profileData.role].department,
            designation: profileData.designation || prev[profileData.role].designation,
            employeeId: profileData.employeeId || prev[profileData.role].employeeId,
            centerLocation: profileData.centerLocation || prev[profileData.role].centerLocation
          }
        };
        localStorage.setItem('cc_user_profiles', JSON.stringify(next));
        return next;
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithFirebase = async (email: string, pass: string) => {
    setAuthLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Fetch user's stored role from Firestore
      const firestoreProfile = await getUserProfileFromFirestore(user.uid);
      if (firestoreProfile && firestoreProfile.role) {
        setRoleState(firestoreProfile.role);
        localStorage.setItem('cc_active_role', firestoreProfile.role);

        setUserProfiles(prev => {
          const next = {
            ...prev,
            [firestoreProfile.role]: {
              ...prev[firestoreProfile.role],
              ...firestoreProfile,
              id: user.uid,
              name: firestoreProfile.name || user.displayName || 'Meteorological Officer',
              email: user.email || email
            }
          };
          localStorage.setItem('cc_user_profiles', JSON.stringify(next));
          return next;
        });
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const authenticateWithOtpUser = async (userProfile: UserProfile, token?: string) => {
    setAuthLoading(true);
    try {
      setRoleState(userProfile.role);
      localStorage.setItem('cc_active_role', userProfile.role);
      if (token) {
        localStorage.setItem('cc_session_token', token);
      }
      setSessionUser(userProfile);
      localStorage.setItem('cc_session_user', JSON.stringify(userProfile));

      setUserProfiles(prev => {
        const next = {
          ...prev,
          [userProfile.role]: {
            ...prev[userProfile.role],
            ...userProfile
          }
        };
        localStorage.setItem('cc_user_profiles', JSON.stringify(next));
        return next;
      });
      setIsGuestMode(false);
      setShowSplash(false);
      setIsAuthModalOpen(false);
      setActiveTabState('Dashboard');

      // Sync with Firestore in background if possible
      try {
        if (userProfile.id || userProfile.uid) {
          await saveUserProfileToFirestore(userProfile.id || userProfile.uid || 'usr-1', {
            uid: userProfile.id || userProfile.uid,
            name: userProfile.name,
            email: userProfile.email,
            role: userProfile.role,
            department: userProfile.department,
            designation: userProfile.designation,
            employeeId: userProfile.employeeId,
            centerLocation: userProfile.centerLocation,
            status: 'Active'
          });
        }
      } catch (e) {
        console.warn("Optional Firestore sync during OTP login:", e);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const logoutWithFirebase = async () => {
    try {
      await fbSignOut(auth);
      setAuthUser(null);
      setSessionUser(null);
      setIsGuestMode(false);
      localStorage.removeItem('cc_session_token');
      localStorage.removeItem('cc_session_user');
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('cc_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('cc_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('cc_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('cc_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('cc_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('cc_approvals', JSON.stringify(pendingApprovals));
  }, [pendingApprovals]);

  useEffect(() => {
    localStorage.setItem('cc_competencies', JSON.stringify(competencies));
  }, [competencies]);

  useEffect(() => {
    localStorage.setItem('cc_analytics', JSON.stringify(traineeAnalytics));
  }, [traineeAnalytics]);

  // Derived enrolled courses
  const enrolledCourses = courses.filter(c => c.isEnrolled);

  // Unread announcements
  const unreadAnnouncementsCount = announcements.filter(
    a => !a.isRead && (a.targetRole === 'All' || a.targetRole === role)
  ).length;

  // Actions
  const enrollInCourse = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, isEnrolled: true, enrolledCount: c.enrolledCount + 1 } : c))
    );
  };

  const updateCourseProgress = (courseId: string, moduleId: string, completed: boolean) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        const updatedModules = c.modules.map(m => (m.id === moduleId ? { ...m, completed } : m));
        const completedCount = updatedModules.filter(m => m.completed).length;
        const percentage = Math.round((completedCount / (updatedModules.length || 1)) * 100);
        return {
          ...c,
          modules: updatedModules,
          completionPercentage: percentage
        };
      })
    );

    // Also update in activeCoursePlayer if open
    if (activeCoursePlayer && activeCoursePlayer.id === courseId) {
      setActiveCoursePlayer(prev => {
        if (!prev) return null;
        const updatedModules = prev.modules.map(m => (m.id === moduleId ? { ...m, completed } : m));
        const completedCount = updatedModules.filter(m => m.completed).length;
        const percentage = Math.round((completedCount / (updatedModules.length || 1)) * 100);
        return {
          ...prev,
          modules: updatedModules,
          completionPercentage: percentage
        };
      });
    }
  };

  const addNewCourse = (courseData: Partial<Course>): Course => {
    const newCourse: Course = {
      id: `crs_${Date.now().toString(36)}`,
      code: courseData.code || `MET-EXP-${Math.floor(100 + Math.random() * 900)}`,
      title: courseData.title || 'Untitled MoES Meteorological Course',
      description: courseData.description || 'Comprehensive training module created via Capacity Connect authoring portal.',
      category: courseData.category || 'Radar Meteorology',
      department: courseData.department || currentUser.department || 'Training Directorate',
      level: courseData.level || 'Intermediate',
      durationHours: courseData.durationHours || 10,
      enrolledCount: 1,
      rating: 5.0,
      publishedDate: new Date().toISOString().split('T')[0],
      isEnrolled: true,
      completionPercentage: 0,
      instructor: {
        name: currentUser.name,
        designation: currentUser.designation,
        department: currentUser.department,
        avatar: currentUser.avatar
      },
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80',
      competenciesCovered: courseData.competenciesCovered || ['Operational Forecasting SOPs', 'Data Quality Control'],
      modules: courseData.modules && courseData.modules.length > 0 ? courseData.modules : [
        {
          id: `mod_${Date.now()}_1`,
          title: 'Module 1: Fundamental Principles & Data Flow',
          type: 'presentation',
          durationMinutes: 45,
          summary: 'Introduction to data ingestion and observational metrics.',
          completed: false,
          slides: [
            {
              slideNumber: 1,
              title: 'Introduction to Operational Workflow',
              bulletPoints: ['Standard data quality checks', 'IMD bulletin dispatch guidelines', 'Station maintenance checklist'],
              notes: 'Key focus for new inductees.'
            }
          ]
        }
      ]
    };

    setCourses(prev => [newCourse, ...prev]);
    return newCourse;
  };

  const openCoursePlayer = (course: Course) => {
    setActiveCoursePlayer(course);
  };

  const closeCoursePlayer = () => {
    setActiveCoursePlayer(null);
  };

  const startAssessment = (assessment: Assessment) => {
    setActiveAssessment(assessment);
  };

  const closeAssessment = () => {
    setActiveAssessment(null);
  };

  const submitAssessmentAttempt = (
    assessmentId: string,
    answers: Record<string, number>,
    score: number,
    total: number,
    percentage: number,
    passed: boolean,
    timeSpentSeconds: number
  ): Certificate | null => {
    const targetAssessment = assessments.find(a => a.id === assessmentId);
    if (!targetAssessment) return null;

    const newAttempt = {
      attemptId: `att_${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      score,
      totalMarks: total,
      percentage,
      passed,
      timeSpentSeconds,
      answers
    };

    // Update assessment attempts
    setAssessments(prev =>
      prev.map(a => {
        if (a.id !== assessmentId) return a;
        const prevAttempts = a.userAttempts || [];
        return {
          ...a,
          userAttempts: [newAttempt, ...prevAttempts]
        };
      })
    );

    // If passed, generate or update Certificate
    if (passed) {
      const certNumber = `MOES-IMD-${new Date().getFullYear()}-${targetAssessment.code.replace('EVAL-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const grade: 'A+' | 'A' | 'B+' | 'B' | 'Pass' =
        percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : 'Pass';

      const targetCourse = courses.find(c => c.id === targetAssessment.courseId);

      const newCert: Certificate = {
        id: `cert_${Date.now().toString(36)}`,
        certificateNumber: certNumber,
        courseId: targetAssessment.courseId,
        courseTitle: targetAssessment.courseTitle,
        courseCode: targetCourse?.code || targetAssessment.code,
        traineeName: currentUser.name,
        traineeId: currentUser.employeeId,
        traineeDepartment: currentUser.department,
        issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        grade,
        scorePercentage: percentage,
        instructorName: targetCourse?.instructor.name || 'Dr. Sunita Rao',
        instructorTitle: targetCourse?.instructor.designation || 'Lead Faculty, MoES',
        directorName: 'Dr. Mrutyunjay Mohapatra',
        directorTitle: 'Director General of Meteorology (DGM), IMD',
        qrCodeData: `https://capacityconnect.moes.gov.in/verify/${certNumber}`,
        skillsMastered: targetCourse?.competenciesCovered || ['Operational Meteorological Standards', 'Severe Weather Diagnostics'],
        verificationUrl: `https://capacityconnect.moes.gov.in/verify/${certNumber}`
      };

      setCertificates(prev => {
        const existingIndex = prev.findIndex(c => c.courseId === targetAssessment.courseId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newCert;
          return updated;
        }
        return [newCert, ...prev];
      });

      // Boost related competency score
      setCompetencies(prev =>
        prev.map(comp => {
          if (targetAssessment.title.toLowerCase().includes(comp.domain.toLowerCase()) || targetAssessment.title.toLowerCase().includes(comp.skill.toLowerCase())) {
            return {
              ...comp,
              currentLevel: Math.min(100, comp.currentLevel + 12),
              status: comp.currentLevel + 12 >= comp.requiredLevel ? 'Proficient' : 'Developing'
            };
          }
          return comp;
        })
      );

      return newCert;
    }

    return null;
  };

  const addNewAssessment = (assessmentData: Partial<Assessment>) => {
    const newAsm: Assessment = {
      id: `asm_${Date.now().toString(36)}`,
      code: assessmentData.code || `EVAL-MET-${Math.floor(100 + Math.random() * 900)}`,
      title: assessmentData.title || 'New Practical Skill Assessment',
      courseId: assessmentData.courseId || courses[0]?.id || 'crs_001',
      courseTitle: assessmentData.courseTitle || courses[0]?.title || 'Meteorological Course',
      department: assessmentData.department || currentUser.department || 'Training Directorate',
      timeLimitMinutes: assessmentData.timeLimitMinutes || 20,
      passingPercentage: assessmentData.passingPercentage || 75,
      totalMarks: assessmentData.totalMarks || (assessmentData.questions?.length ? assessmentData.questions.length * 5 : 50),
      instructions: assessmentData.instructions || [
        'Read each operational scenario carefully before selecting the best action.',
        'Total marks will be computed instantly upon final submission.'
      ],
      questions: assessmentData.questions || [
        {
          id: 'q1',
          text: 'What is the primary indicator of atmospheric instability in Pre-Convective sounding profiles?',
          options: ['High Convective Available Potential Energy (CAPE > 1500 J/kg)', 'Zero Wind Shear', 'Dry mid-levels with low lapse rate', 'High surface pressure'],
          correctIndex: 0,
          explanation: 'Elevated CAPE values coupled with low CIN (Convective Inhibition) represent high potential buoyant energy for thunderstorm updrafts.',
          category: 'Thermodynamics',
          difficulty: 'Medium'
        }
      ],
      userAttempts: []
    };

    setAssessments(prev => [newAsm, ...prev]);
  };

  const openCertificateModal = (cert: Certificate) => {
    setActiveCertificateModal(cert);
  };

  const closeCertificateModal = () => {
    setActiveCertificateModal(null);
  };

  const verifyCertificateByNumber = (certNumber: string): Certificate | null => {
    const cleaned = certNumber.trim().toUpperCase();
    return certificates.find(c => c.certificateNumber.toUpperCase() === cleaned) || null;
  };

  const openDocumentPreview = (doc: KnowledgeDocument) => {
    setActiveDocumentPreview(doc);
  };

  const closeDocumentPreview = () => {
    setActiveDocumentPreview(null);
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'isRead'>) => {
    const item: Announcement = {
      id: `ann_${Date.now().toString(36)}`,
      ...newAnn,
      isRead: false
    };
    setAnnouncements(prev => [item, ...prev]);
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const approveUser = (id: string) => {
    setPendingApprovals(prev => prev.map(u => (u.id === id ? { ...u, status: 'Approved' } : u)));
  };

  const rejectUser = (id: string) => {
    setPendingApprovals(prev => prev.map(u => (u.id === id ? { ...u, status: 'Rejected' } : u)));
  };

  const updateCompetencyScore = (skill: string, score: number) => {
    setCompetencies(prev =>
      prev.map(c => (c.skill === skill ? { ...c, currentLevel: Math.min(100, Math.max(0, score)) } : c))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const createAnnouncement = (annData: {
    title: string;
    content: string;
    priority: Announcement['priority'];
    targetRole: Announcement['targetRole'];
    department: string;
    author: string;
  }) => {
    const newAnn: Announcement = {
      id: `ann_${Date.now().toString(36)}`,
      title: annData.title,
      content: annData.content,
      priority: annData.priority,
      targetRole: annData.targetRole,
      targetDepartment: annData.department,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: annData.author,
      authorRole: 'Administrator',
      isRead: false
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const [staffList, setStaffList] = useState<UserProfile[]>([
    INITIAL_USER_PROFILES.Trainee,
    INITIAL_USER_PROFILES.Trainer,
    INITIAL_USER_PROFILES.Admin,
    {
      id: 'usr_tr_002',
      name: 'Pooja Verma',
      email: 'pooja.verma@imd.gov.in',
      role: 'Trainee',
      department: 'Satellite Meteorology Division',
      designation: 'Meteorologist-I',
      employeeId: 'IMD-TR-2024-9921',
      centerLocation: 'RMC Kolkata',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'INSAT-3DS radiometric analyst specializing in oceanic cyclogenesis detection.',
      joinedDate: '01 Feb 2024',
      status: 'Active',
      skills: []
    },
    {
      id: 'usr_tn_003',
      name: 'Prof. Amitabha Sen',
      email: 'amitabha.sen@moes.gov.in',
      role: 'Trainer',
      department: 'Cyclone Warning Division',
      designation: 'Senior Faculty / Cyclone Lead',
      employeeId: 'MOES-FAC-2018-091',
      centerLocation: 'RMC Chennai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Distinguished cyclone expert and WMO rapporteur.',
      joinedDate: '10 Aug 2018',
      status: 'Active',
      skills: []
    }
  ]);

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setStaffList(prev => prev.map(s => s.id === userId ? { ...s, role: newRole } : s));
  };

  const resetAllData = () => {
    localStorage.clear();
    setRoleState('Trainee');
    setActiveTabState('Dashboard');
    setUserProfiles(INITIAL_USER_PROFILES);
    setCourses(INITIAL_COURSES);
    setAssessments(INITIAL_ASSESSMENTS);
    setCertificates(INITIAL_CERTIFICATES);
    setDocuments(INITIAL_KNOWLEDGE_DOCUMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setPendingApprovals(INITIAL_PENDING_APPROVALS);
    setCompetencies(INITIAL_COMPETENCIES);
    setTraineeAnalytics(INITIAL_TRAINEE_ANALYTICS);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        authUser,
        sessionUser,
        authLoading,
        isGuestMode,
        setIsGuestMode,
        showSplash,
        setShowSplash,
        isAuthModalOpen,
        setIsAuthModalOpen,
        signupWithFirebase,
        loginWithFirebase,
        authenticateWithOtpUser,
        logoutWithFirebase,
        courses,
        enrolledCourses,
        enrollInCourse,
        updateCourseProgress,
        addNewCourse,
        activeCoursePlayer,
        openCoursePlayer,
        closeCoursePlayer,
        assessments,
        activeAssessment,
        startAssessment,
        closeAssessment,
        submitAssessmentAttempt,
        addNewAssessment,
        certificates,
        activeCertificateModal,
        openCertificateModal,
        closeCertificateModal,
        verifyCertificateByNumber,
        documents,
        activeDocumentPreview,
        openDocumentPreview,
        closeDocumentPreview,
        announcements,
        addAnnouncement,
        markAnnouncementAsRead,
        unreadAnnouncementsCount,
        pendingApprovals,
        approveUser,
        rejectUser,
        competencies,
        updateCompetencyScore,
        traineeAnalytics,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isFirebaseModalOpen,
        setIsFirebaseModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        allStaffUsers: staffList,
        updateUserRole,
        createAnnouncement,
        deleteAnnouncement,
        currentRole: role,
        selectedCertificateModal: activeCertificateModal,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
