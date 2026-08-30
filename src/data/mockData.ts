import {
  UserProfile,
  Course,
  Assessment,
  Certificate,
  KnowledgeDocument,
  Announcement,
  PendingUserApproval,
  CompetencyMetric
} from '../types';

export const INITIAL_USER_PROFILES: Record<string, UserProfile> = {
  Trainee: {
    id: 'usr_tr_001',
    name: 'Rajesh Kumar Meena',
    email: 'rajesh.meena@imd.gov.in',
    role: 'Trainee',
    department: 'Radar & Satellite Meteorology Division',
    designation: 'Scientific Assistant / Radar Operator',
    employeeId: 'IMD-TR-2024-8842',
    centerLocation: 'Regional Meteorological Centre (RMC), New Delhi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Meteorological officer undergoing advanced operational training in S-Band Doppler Radar interpretation and severe convection tracking.',
    joinedDate: '15 Jan 2024',
    status: 'Active',
    skills: [
      { name: 'Doppler Radar Interpretation', level: 82, maxLevel: 100, category: 'Observational' },
      { name: 'NWP Model Post-Processing', level: 68, maxLevel: 100, category: 'Modeling' },
      { name: 'Severe Storm Warning SOPs', level: 90, maxLevel: 100, category: 'Disaster Warning' },
      { name: 'INSAT-3DR/3DS Thermal Channels', level: 75, maxLevel: 100, category: 'Satellite' },
      { name: 'Agromet Advisory Preparation', level: 60, maxLevel: 100, category: 'Applied Met' },
      { name: 'Cyclone Track Verification', level: 85, maxLevel: 100, category: 'Tropical Meteorology' },
    ]
  },
  Trainer: {
    id: 'usr_tn_002',
    name: 'Dr. Sunita Rao',
    email: 'sunita.rao@moes.gov.in',
    role: 'Trainer',
    department: 'Numerical Weather Prediction Division',
    designation: 'Scientist-F & Lead Training Faculty',
    employeeId: 'MOES-FAC-1049',
    centerLocation: 'National Centre for Medium Range Weather Forecasting (NCMRWF), Noida',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Atmospheric Scientist with 18+ years experience in ensemble prediction systems, mesoscale modeling, and capacity building for MoES institutions.',
    joinedDate: '10 Aug 2018',
    status: 'Active',
    skills: [
      { name: 'WRF & GFS Model Dynamics', level: 98, maxLevel: 100, category: 'Modeling' },
      { name: 'Curriculum Development', level: 95, maxLevel: 100, category: 'Pedagogy' },
      { name: 'Data Assimilation (GSI/4D-Var)', level: 92, maxLevel: 100, category: 'Advanced Computing' },
      { name: 'High Performance Computing (Pratyush/Mihir)', level: 88, maxLevel: 100, category: 'HPC' },
    ]
  },
  Admin: {
    id: 'usr_ad_003',
    name: 'Shri Vikramaditya Sharma',
    email: 'admin.capacity@imd.gov.in',
    role: 'Admin',
    department: 'Central Training & Capacity Building Directorate',
    designation: 'Joint Director (Capacity Building & Human Resources)',
    employeeId: 'IMD-HQ-DIR-002',
    centerLocation: 'India Meteorological Department HQ, Mausam Bhavan, New Delhi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Administrative lead managing pan-India meteorological capacity building programs, officer verifications, and MoES training resource allocations.',
    joinedDate: '01 Mar 2015',
    status: 'Active',
    skills: [
      { name: 'National Training Oversight', level: 98, maxLevel: 100, category: 'Administration' },
      { name: 'Resource Allocation & Budgeting', level: 94, maxLevel: 100, category: 'Management' },
      { name: 'MoES Inter-Agency Coordination', level: 96, maxLevel: 100, category: 'Policy' },
    ]
  }
};

export const INITIAL_COMPETENCIES: CompetencyMetric[] = [
  { skill: 'Doppler Velocity De-aliasing', domain: 'Radar Meteorology', currentLevel: 85, requiredLevel: 80, status: 'Proficient', lastAssessed: '2024-05-12' },
  { skill: 'NWP Ensemble Probabilistic Forecasting', domain: 'Numerical Modeling', currentLevel: 68, requiredLevel: 75, status: 'Developing', lastAssessed: '2024-05-18' },
  { skill: 'INSAT Multi-Spectral RGB Analysis', domain: 'Satellite Met', currentLevel: 78, requiredLevel: 70, status: 'Proficient', lastAssessed: '2024-04-30' },
  { skill: 'Urban Flash Flood Hydrometeorology', domain: 'Disaster Early Warning', currentLevel: 62, requiredLevel: 80, status: 'Needs Training', lastAssessed: '2024-05-02' },
  { skill: 'Cyclone Intensity Dvorak Technique', domain: 'Tropical Meteorology', currentLevel: 90, requiredLevel: 85, status: 'Proficient', lastAssessed: '2024-05-20' },
  { skill: 'Agromet Block-Level Bulletin Formulation', domain: 'Applied Services', currentLevel: 72, requiredLevel: 75, status: 'Developing', lastAssessed: '2024-04-15' },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs_001',
    code: 'MET-RAD-401',
    title: 'Advanced Doppler Weather Radar (DWR) Calibration & Severe Storm Interception',
    description: 'Master the principles of dual-polarization S-Band and C-Band radar systems, hydrometeor classification, velocity de-aliasing algorithms, and microburst identification.',
    category: 'Radar Meteorology',
    department: 'Radar & Satellite Meteorology Division',
    level: 'Advanced',
    durationHours: 16,
    enrolledCount: 142,
    rating: 4.9,
    publishedDate: '2024-02-10',
    isEnrolled: true,
    completionPercentage: 75,
    instructor: {
      name: 'Dr. Rameshwar Dayal',
      designation: 'Chief Radar Scientist',
      department: 'IMD Radar Operations Division',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&auto=format&fit=crop&q=80',
    competenciesCovered: [
      'Dual-Pol ZDR & KDP Analysis',
      'Mesocyclone Vortex Signature Detection',
      'Reflectivity Attenuation Correction',
      'Real-time Nowcasting Protocols'
    ],
    modules: [
      {
        id: 'mod_101',
        title: 'Module 1: Dual-Polarization Physics & Signal Processing',
        type: 'presentation',
        durationMinutes: 45,
        summary: 'Theoretical breakdown of differential reflectivity (ZDR), specific differential phase (KDP), and correlation coefficient (CC).',
        completed: true,
        slides: [
          {
            slideNumber: 1,
            title: 'Dual-Polarization Fundamentals',
            bulletPoints: [
              'Transmitting horizontal (H) and vertical (V) polarized electromagnetic waves simultaneously.',
              'Measuring the oblateness of raindrops as a function of drop diameter.',
              'Differential reflectivity (ZDR = 10 * log10(Zh / Zv)) discriminates spherical hailstones from oblong rain.'
            ],
            notes: 'Emphasize to trainees that ZDR near 0 dB indicates tumbling hail or light spherical drizzle, while positive ZDR represents flattened raindrops in high convective updrafts.'
          },
          {
            slideNumber: 2,
            title: 'Correlation Coefficient (ρhv) & Non-Meteorological Echoes',
            bulletPoints: [
              'ρhv measures the uniformity of scatterers within the radar resolution volume.',
              'Pure meteorological echoes typically produce ρhv > 0.95.',
              'Tornado Debris Signatures (TDS) drop ρhv < 0.80 while co-located with high reflectivity and strong velocity shear.'
            ],
            notes: 'Key examination question: Identification of biological scatterers (birds, insects) versus light stratiform precipitation.'
          },
          {
            slideNumber: 3,
            title: 'Operational Calibration SOP for S-Band Radars',
            bulletPoints: [
              'Daily solar calibration scans at sunrise and sunset.',
              'Receiver noise figure checks and waveguide power monitoring.',
              'Validation against IMD Automatic Weather Station (AWS) tipping bucket rain gauges.'
            ],
            notes: 'Radar operators must document beam blockage azimuth angles in the station digital logbook every monsoon cycle.'
          }
        ]
      },
      {
        id: 'mod_102',
        title: 'Module 2: Real-time Convective Cell Tracking & Mesocyclone Signatures',
        type: 'video',
        durationMinutes: 60,
        summary: 'Recorded operational session analyzing a severe pre-monsoon Nor’wester storm over Eastern India with Doppler velocity products.',
        completed: true,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        documentContent: 'Operational checklist for severe squall line detection: 1. Monitor Base Velocity for Couplets. 2. Verify Echo Tops exceeding 14km. 3. Check VIL (Vertically Integrated Liquid) > 45 kg/m². 4. Issue Nowcast 30-min warning.'
      },
      {
        id: 'mod_103',
        title: 'Module 3: Hydrometeor Classification (HCA) Matrix',
        type: 'document',
        durationMinutes: 30,
        summary: 'Fuzzy logic algorithm parameters used in operational IMD Radar software for distinguishing heavy rain, hail, graupel, and mixed phase.',
        completed: false,
        documentContent: `### Hydrometeor Classification Algorithm (HCA) Guidelines

In modern IMD Doppler Weather Radar networks (METEOR 1500S and indigenous radars), fuzzy logic membership functions classify targets into 10 distinct classes:

1. **Light Rain (LR)**: Zh < 30 dBZ, ZDR: 0.1 - 0.8 dB, Kdp: 0.0 - 0.2 deg/km, CC: > 0.98.
2. **Heavy Rain (HR)**: Zh > 45 dBZ, ZDR: 1.5 - 3.5 dB, Kdp: 1.0 - 4.0 deg/km, CC: > 0.97.
3. **Hail (HAIL)**: Zh > 55 dBZ, ZDR: -0.5 - 0.5 dB, Kdp: low to moderate, CC: 0.85 - 0.95.
4. **Graupel (GR)**: Zh: 30 - 45 dBZ, ZDR: -0.2 - 0.3 dB, Kdp: ~0 deg/km, CC: > 0.97.
5. **Biological Scatterers (BIO)**: Zh < 20 dBZ, ZDR: extreme variations (-4 to +6 dB), CC < 0.75.

**Critical Action Protocol**: When Hail class is detected within 30km radius of urban center airports, trigger Immediate Priority Amber Alert to ATC tower.`
      },
      {
        id: 'mod_104',
        title: 'Module 4: End-of-Course Practical Assessment Checkpoint',
        type: 'quiz_checkpoint',
        durationMinutes: 20,
        summary: 'Final knowledge validation quiz covering radar interpretation, dual-pol metrics, and early warning SOPs.',
        completed: false
      }
    ]
  },
  {
    id: 'crs_002',
    code: 'NWP-DYN-502',
    title: 'Numerical Weather Prediction (NWP) - High-Resolution GFS & WRF Modeling',
    description: 'Understand atmospheric thermodynamic equations, boundary layer parameterization, 4D-Var data assimilation, and ensemble forecast post-processing on MoES supercomputers.',
    category: 'Numerical Weather Prediction',
    department: 'Numerical Weather Prediction Division',
    level: 'Advanced',
    durationHours: 24,
    enrolledCount: 198,
    rating: 4.8,
    publishedDate: '2024-01-20',
    isEnrolled: true,
    completionPercentage: 100,
    instructor: {
      name: 'Dr. Sunita Rao',
      designation: 'Scientist-F',
      department: 'NCMRWF / MoES',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    competenciesCovered: [
      'WRF Pre-Processing System (WPS)',
      'Data Assimilation via GSI',
      'Cumulus & Microphysics Schemes',
      'Ensemble Spread & Probability Calculation'
    ],
    modules: [
      {
        id: 'mod_201',
        title: 'Module 1: Atmospheric Dynamics & Primitive Equations',
        type: 'presentation',
        durationMinutes: 50,
        summary: 'Conservation of mass, momentum, and moisture in sigma-pressure hybrid vertical coordinate systems.',
        completed: true,
        slides: [
          {
            slideNumber: 1,
            title: 'Hydrostatic vs Non-Hydrostatic Modeling',
            bulletPoints: [
              'Hydrostatic approximation valid when horizontal scale >> vertical scale (grid spacing > 10 km).',
              'Non-hydrostatic equations mandatory for resolving cloud-scale updrafts at < 3 km grid resolution.',
              'IMD 3km Unified Model solves fully compressible non-hydrostatic Euler equations.'
            ],
            notes: 'Crucial for trainees to recognize the computational difference in matrix inversion steps.'
          }
        ]
      },
      {
        id: 'mod_202',
        title: 'Module 2: Observational Data Assimilation Pipeline',
        type: 'video',
        durationMinutes: 75,
        summary: 'GSI framework ingesting satellite radiances, radiosonde soundings, and AWS observations.',
        completed: true,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    ]
  },
  {
    id: 'crs_003',
    code: 'TC-WARN-303',
    title: 'Tropical Cyclone Genesis, Trajectory Tracking & Early Warning Protocols',
    description: 'Operational methods for cyclone track prediction over Bay of Bengal and Arabian Sea, Dvorak satellite intensity estimation, storm surge modeling, and 4-stage alert dissemination.',
    category: 'Disaster Management',
    department: 'Cyclone Warning Division',
    level: 'Intermediate',
    durationHours: 18,
    enrolledCount: 310,
    rating: 5.0,
    publishedDate: '2024-03-01',
    isEnrolled: true,
    completionPercentage: 40,
    instructor: {
      name: 'Dr. Ananda Kumar Das',
      designation: 'Scientist-E & Cyclone Specialist',
      department: 'Cyclone Warning Division, IMD New Delhi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&auto=format&fit=crop&q=80',
    competenciesCovered: [
      'Dvorak T-Number Analysis',
      'Multi-Model Consensus Track Prediction',
      'IIT-D Storm Surge Model Execution',
      'MoES 4-Stage Cyclone Warning Bulletins'
    ],
    modules: [
      {
        id: 'mod_301',
        title: 'Module 1: Cyclone Genesis & Ocean Thermal Energy Criteria',
        type: 'document',
        durationMinutes: 40,
        summary: 'Sea surface temperatures > 26.5°C, Tropical Cyclone Heat Potential (TCHP) > 60 kJ/cm², and low vertical wind shear.',
        completed: true
      },
      {
        id: 'mod_302',
        title: 'Module 2: 4-Stage Warning Protocol for Coastal Authorities',
        type: 'presentation',
        durationMinutes: 45,
        summary: '1. Pre-Cyclone Watch (72h), 2. Cyclone Alert (48h), 3. Cyclone Warning (24h), 4. Post-Landfall Outlook (12h).',
        completed: false,
        slides: [
          {
            slideNumber: 1,
            title: '4-Stage Cyclone Warning System (IMD SOP)',
            bulletPoints: [
              'Stage 1: Pre-Cyclone Watch (Issued 72 hours in advance of anticipated landfall).',
              'Stage 2: Cyclone Alert (Yellow message, 48 hours prior to adverse weather onset).',
              'Stage 3: Cyclone Warning (Orange message, 24 hours prior to landfall with expected gale winds).',
              'Stage 4: Post-Landfall Outlook (Red message, 12 hours prior to landfall until interior dissipation).'
            ],
            notes: 'Trainees must adhere to standardized bilingual bulletin templates dispatched to NDMA, SDMA, and Cabinet Secretary.'
          }
        ]
      }
    ]
  },
  {
    id: 'crs_004',
    code: 'SAT-MET-204',
    title: 'Satellite Meteorology: INSAT-3DR & 3DS Multi-Spectral Image Interpretation',
    description: 'Learn to utilize Visible, Thermal Infrared, Water Vapor, and Middle Infrared channels for cloud top height, fog/fog dissipation monitoring, and rapid scan convective initiation.',
    category: 'Satellite Meteorology',
    department: 'Satellite Meteorology Division',
    level: 'Beginner',
    durationHours: 12,
    enrolledCount: 220,
    rating: 4.7,
    publishedDate: '2024-03-15',
    isEnrolled: false,
    completionPercentage: 0,
    instructor: {
      name: 'Dr. Priya Varma',
      designation: 'Scientist-E',
      department: 'Satellite Imagery Division, SAC/ISRO & IMD',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80',
    competenciesCovered: [
      'RGB Composite Channel Pairing (Night Microphysics & Day Land-Cloud)',
      'Water Vapor Channel Upper-Level Vorticity Tracking',
      'Outgoing Longwave Radiation (OLR) & Convection Mapping'
    ],
    modules: [
      {
        id: 'mod_401',
        title: 'Module 1: Imager and Sounder Payloads on INSAT-3DR/3DS',
        type: 'presentation',
        durationMinutes: 35,
        summary: 'Spectral bands specification, spatial resolution (1km VIS, 4km TIR), and radiometric calibration.',
        completed: false
      }
    ]
  },
  {
    id: 'crs_005',
    code: 'AGRO-MET-105',
    title: 'Agrometeorological Advisory Services (AAS) & Gramin Krishi Mausam Sewa',
    description: 'Translation of block-level weather forecasts into farmer-actionable crop advisories, pest-disease weather correlations, soil moisture estimation, and Meghdoot app integration.',
    category: 'Agrometeorology',
    department: 'Agromet Advisory Division',
    level: 'Intermediate',
    durationHours: 14,
    enrolledCount: 175,
    rating: 4.9,
    publishedDate: '2024-04-01',
    isEnrolled: false,
    completionPercentage: 0,
    instructor: {
      name: 'Dr. K. K. Singh',
      designation: 'Head, Agrimet Division',
      department: 'Agrometeorology Division, IMD',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
    competenciesCovered: [
      'Block-Level Weather Advisory Formulation',
      'Growing Degree Days (GDD) & Phenology Calculation',
      'Damini & Meghdoot Mobile App Data Delivery'
    ],
    modules: [
      {
        id: 'mod_501',
        title: 'Module 1: GKMS Framework & District Agromet Units (DAMUs)',
        type: 'document',
        durationMinutes: 40,
        summary: 'Standard operating procedure for bi-weekly advisory issuance every Tuesday and Friday.',
        completed: false
      }
    ]
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm_001',
    code: 'EVAL-RAD-401',
    title: 'National Certification Assessment: Doppler Radar Interpretation & Severe Storm Early Warning',
    courseId: 'crs_001',
    courseTitle: 'Advanced Doppler Weather Radar (DWR) Calibration & Severe Storm Interception',
    department: 'Radar & Satellite Meteorology Division',
    timeLimitMinutes: 20,
    passingPercentage: 75,
    totalMarks: 50,
    instructions: [
      'This timed assessment evaluates operational readiness for S-Band & C-Band Doppler Radar stations.',
      'Each question carries 5 marks. Incorrect responses do not have negative marking.',
      'You must achieve at least 75% score (38/50) to unlock your official MoES/IMD Verified Certificate.',
      'Do not switch browser tabs during the examination window.'
    ],
    userAttempts: [
      {
        attemptId: 'att_001',
        date: '2024-05-10',
        score: 45,
        totalMarks: 50,
        percentage: 90,
        passed: true,
        timeSpentSeconds: 780,
        answers: {
          'q1': 1,
          'q2': 0,
          'q3': 2,
          'q4': 1,
          'q5': 0,
          'q6': 3,
          'q7': 1,
          'q8': 2,
          'q9': 0,
          'q10': 1
        }
      }
    ],
    questions: [
      {
        id: 'q1',
        text: 'In dual-polarization Doppler radar products, what does a very high Reflectivity (Zh > 60 dBZ) accompanied by near-zero or negative Differential Reflectivity (ZDR ≈ 0 dB) and a drop in Correlation Coefficient (ρhv < 0.90) signify?',
        options: [
          'Heavy tropical monsoonal rain with oversized raindrops',
          'Presence of large, tumbling hailstones or hail mixed with rain',
          'Biological clutter caused by nocturnal bird migration',
          'Ground clutter due to anomalous atmospheric propagation (AP)'
        ],
        correctIndex: 1,
        explanation: 'Large hailstones tumble irregularly as they fall, presenting an isotropic aspect ratio (horizontal dimension ≈ vertical dimension), causing ZDR ≈ 0 dB despite extremely high Zh > 60 dBZ.',
        category: 'Dual-Pol Physics',
        difficulty: 'Hard'
      },
      {
        id: 'q2',
        text: 'What is the standard velocity Nyquist interval (Vmax) relation for a pulsed radar with wavelength λ and Pulse Repetition Frequency (PRF)?',
        options: [
          'Vmax = (λ * PRF) / 4',
          'Vmax = (λ * PRF) / 2',
          'Vmax = 2 * λ * PRF',
          'Vmax = (λ) / (4 * PRF)'
        ],
        correctIndex: 0,
        explanation: 'The maximum unambiguous velocity is given by Vmax = (λ * PRF) / 4. This is the Doppler dilemma constraint balancing maximum range and maximum unambiguous velocity.',
        category: 'Radar Principles',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        text: 'Which radar product feature is the primary diagnostic signature for detecting an approaching Tornado or intense Mesocyclone vortex?',
        options: [
          'Bright Band horizontal melting layer enhancement',
          'Uniform zero-isodop line parallel to the radar beam',
          'Tornado Vortex Signature (TVS) exhibiting adjacent high inbound and outbound velocity couplet',
          'Drizzle echo with ZDR > 4 dB'
        ],
        correctIndex: 2,
        explanation: 'A Mesocyclone or TVS displays a tight azimuthal shear couplet where maximum inbound (towards radar) and maximum outbound (away from radar) velocities occur within adjacent radar azimuth gates.',
        category: 'Severe Convection',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        text: 'During pre-monsoon squall line tracking over Kolkata (Kalbaishakhi/Nor’wester), what does a "Bow Echo" pattern on the radar reflectivity PPI product indicate?',
        options: [
          'A decaying thunderstorm system undergoing dissipation',
          'A strong Rear-Inflow Jet (RIJ) causing damaging straight-line surface winds (microburst/macroburst)',
          'Stratiform precipitation with embedded melting snow layer',
          'Sea breeze front with no convective potential'
        ],
        correctIndex: 1,
        explanation: 'A bow echo forms when a strong Rear-Inflow Jet pushes the central portion of the convective line rapidly forward, creating intense downbursts and damaging straight-line surface winds.',
        category: 'Nowcasting',
        difficulty: 'Hard'
      },
      {
        id: 'q5',
        text: 'What is the primary objective of Specific Differential Phase (KDP) in precipitation estimation algorithms compared to conventional Z-R relationships?',
        options: [
          'KDP is unaffected by radar calibration offsets, partial beam blockage, and receiver attenuation',
          'KDP can only be calculated for frozen hydrometeors like dry snow',
          'KDP directly measures wind direction at the cloud top',
          'KDP eliminates the need for velocity measurements'
        ],
        correctIndex: 0,
        explanation: 'Because KDP is a phase measurement along the propagation path, it is immune to absolute power calibration errors, radome wetness attenuation, and partial terrain beam blockage.',
        category: 'QPE Algorithms',
        difficulty: 'Hard'
      },
      {
        id: 'q6',
        text: 'In the IMD Standard Operating Procedure (SOP), within what lead time must a radar-based "Nowcast Severe Thunderstorm Warning" be updated and dispatched to Disaster Managers?',
        options: [
          'Every 24 hours',
          'Every 12 hours',
          'Every 6 hours',
          'Every 3 hours or on rapid 15-minute intervals when radar scans refresh'
        ],
        correctIndex: 3,
        explanation: 'Nowcasts are short-range warnings (0 to 3 hours lead time) updated continuously every 15-30 minutes based on real-time volumetric radar scan cycles.',
        category: 'Warning SOP',
        difficulty: 'Easy'
      },
      {
        id: 'q7',
        text: 'What radar artifact occurs when the atmospheric temperature inversion causes the transmitted radar beam to bend downward towards the ground more steeply than normal?',
        options: [
          'Sub-refraction causing beam to overshoot storm cells',
          'Super-refraction or Ducting causing Ground Clutter Anomalous Propagation (AP)',
          'Velocity folding causing false cyclonic circulation',
          'Second-trip echo caused by high PRF'
        ],
        correctIndex: 1,
        explanation: 'When dn/dz is strongly negative (high temperature inversion or sharp moisture drop with height), the beam is bent towards the surface, hitting terrain and generating false intense reflectivity known as AP clutter.',
        category: 'Radar Physics',
        difficulty: 'Medium'
      },
      {
        id: 'q8',
        text: 'Which frequency band is most suited for Long-Range (400km+) coastal Tropical Cyclone surveillance with minimal heavy rain signal attenuation?',
        options: [
          'X-Band (9.3 - 9.5 GHz)',
          'Ka-Band (35 GHz)',
          'S-Band (2.7 - 2.9 GHz)',
          'W-Band (94 GHz)'
        ],
        correctIndex: 2,
        explanation: 'S-Band (~10 cm wavelength) experiences almost zero precipitation attenuation in extreme monsoonal rain and tropical cyclones, making it the gold standard for IMD coastal radar network.',
        category: 'Radar Hardware',
        difficulty: 'Easy'
      },
      {
        id: 'q9',
        text: 'What does a Vertically Integrated Liquid (VIL) density value exceeding 3.5 g/m³ in a mid-latitude or subtropical convective storm strongly correlate with?',
        options: [
          'High probability of severe ground hail',
          'Light continuous drizzle',
          'Dust storm without rain',
          'Low-level stratus fog'
        ],
        correctIndex: 0,
        explanation: 'VIL density (VIL divided by Echo Top height) normalizes liquid content against storm height; values above 3.5 g/m³ are reliable predictors of severe hail occurrences.',
        category: 'Convective Analysis',
        difficulty: 'Medium'
      },
      {
        id: 'q10',
        text: 'In the IMD Color-Coded Warning System, which color signifies "Take Action" (Highest Danger / Extreme Event Expected)?',
        options: [
          'Green (No Warning)',
          'Red (Take Action)',
          'Orange (Be Prepared)',
          'Yellow (Be Updated)'
        ],
        correctIndex: 1,
        explanation: 'Red Warning is the highest priority alert signifying severe/disastrous weather requiring emergency response, evacuation, and active disaster management protocol.',
        category: 'IMD Color Code',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'asm_002',
    code: 'EVAL-NWP-502',
    title: 'Numerical Weather Prediction & WRF Parameterization Certification Test',
    courseId: 'crs_002',
    courseTitle: 'Numerical Weather Prediction (NWP) - High-Resolution GFS & WRF Modeling',
    department: 'Numerical Weather Prediction Division',
    timeLimitMinutes: 25,
    passingPercentage: 70,
    totalMarks: 40,
    instructions: [
      'Evaluates competency in non-hydrostatic dynamics, microphysics, and model data assimilation.',
      'Passing score: 70% (28/40).',
      'Successful candidates receive the MoES Advanced Modeler Credential.'
    ],
    userAttempts: [
      {
        attemptId: 'att_002',
        date: '2024-04-28',
        score: 36,
        totalMarks: 40,
        percentage: 90,
        passed: true,
        timeSpentSeconds: 950,
        answers: { 'q1': 0, 'q2': 2, 'q3': 1, 'q4': 3 }
      }
    ],
    questions: [
      {
        id: 'q1',
        text: 'Why are convective parameterization schemes (e.g., Kain-Fritsch, Betts-Miller-Janjic) turned OFF when configuring WRF at grid spacing ≤ 3 km?',
        options: [
          'Because at ≤ 3 km resolution, grid cells can explicitly resolve deep convective updrafts and downdrafts without subgrid parameterization (Convection-Permitting Scale)',
          'Because supercomputers do not support cumulus schemes at high resolution',
          'Because cumulus schemes prevent rainfall from reaching the surface',
          'Because satellite assimilation takes over the equation'
        ],
        correctIndex: 0,
        explanation: 'At convection-permitting resolutions (≤ 3-4 km), the model grid directly resolves convective circulation, making empirical subgrid parameterized convection redundant and often counterproductive.',
        category: 'Model Physics',
        difficulty: 'Hard'
      },
      {
        id: 'q2',
        text: 'What mathematical principle underlies 4D-Var Data Assimilation in operational NWP systems at NCMRWF/IMD?',
        options: [
          'Simple linear interpolation between AWS stations',
          'Finding the optimal model trajectory over a finite time window that minimizes a cost function balancing background forecast error and observational error',
          'Replacing all previous model states with raw satellite radiances',
          'Using Monte Carlo random noise injection'
        ],
        correctIndex: 1,
        explanation: '4D-Var assimilates observations distributed throughout a time window using the adjoint model to find the initial state trajectory with minimal cost function J.',
        category: 'Data Assimilation',
        difficulty: 'Hard'
      }
    ]
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_001',
    certificateNumber: 'MOES-IMD-2024-RAD-8842',
    courseId: 'crs_001',
    courseTitle: 'Advanced Doppler Weather Radar (DWR) Calibration & Severe Storm Interception',
    courseCode: 'MET-RAD-401',
    traineeName: 'Rajesh Kumar Meena',
    traineeId: 'IMD-TR-2024-8842',
    traineeDepartment: 'Radar & Satellite Meteorology Division',
    issueDate: '10 May 2024',
    grade: 'A+',
    scorePercentage: 90,
    instructorName: 'Dr. Rameshwar Dayal',
    instructorTitle: 'Chief Radar Scientist, IMD',
    directorName: 'Dr. Mrutyunjay Mohapatra',
    directorTitle: 'Director General of Meteorology (DGM), IMD',
    qrCodeData: 'https://capacityconnect.moes.gov.in/verify/MOES-IMD-2024-RAD-8842',
    skillsMastered: [
      'Dual-Polarization S-Band Radar Diagnostics',
      'Hydrometeor Classification Algorithm (HCA)',
      'Severe Storm Nowcasting & Microburst Tracking',
      'MoES Standard Operating Warning Protocols'
    ],
    verificationUrl: 'https://capacityconnect.moes.gov.in/verify/MOES-IMD-2024-RAD-8842'
  },
  {
    id: 'cert_002',
    certificateNumber: 'MOES-NCMRWF-2024-NWP-5021',
    courseId: 'crs_002',
    courseTitle: 'Numerical Weather Prediction (NWP) - High-Resolution GFS & WRF Modeling',
    courseCode: 'NWP-DYN-502',
    traineeName: 'Rajesh Kumar Meena',
    traineeId: 'IMD-TR-2024-8842',
    traineeDepartment: 'Radar & Satellite Meteorology Division',
    issueDate: '28 Apr 2024',
    grade: 'A+',
    scorePercentage: 90,
    instructorName: 'Dr. Sunita Rao',
    instructorTitle: 'Scientist-F & Lead Training Faculty, NCMRWF',
    directorName: 'Dr. A. K. Sahai',
    directorTitle: 'Head, Center for Climate Research & Training',
    qrCodeData: 'https://capacityconnect.moes.gov.in/verify/MOES-NCMRWF-2024-NWP-5021',
    skillsMastered: [
      'Non-Hydrostatic WRF Model Configuration',
      '4D-Var Data Assimilation Pipeline',
      'High-Performance Supercomputing Execution',
      'Ensemble Post-Processing & Uncertainty Mapping'
    ],
    verificationUrl: 'https://capacityconnect.moes.gov.in/verify/MOES-NCMRWF-2024-NWP-5021'
  }
];

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc_001',
    title: 'IMD Standard Operating Procedure (SOP) for Cyclone Warning Operations',
    category: 'Cyclone SOPs',
    fileType: 'SOP',
    fileSize: '4.2 MB',
    author: 'Cyclone Warning Division, IMD New Delhi',
    department: 'Disaster Warning Directorate',
    uploadDate: '2024-04-10',
    tags: ['Cyclone', 'SOP', 'NDMA', 'Emergency Protocols', 'Bay of Bengal'],
    downloadsCount: 1420,
    description: 'The mandatory operational handbook governing the 4-stage warning system, Dvorak analysis standards, storm surge advisories, and disaster manager communication channels.',
    keyHighlights: [
      'Pre-Cyclone Watch (72 hrs), Alert (48 hrs), Warning (24 hrs), and Post-Landfall Outlook (12 hrs).',
      'Dvorak technique intensity scale matrix matching central pressure deficit (ΔP).',
      'Mandatory dissemination protocols via WhatsApp, GTS, CAP (Common Alerting Protocol), and SMS.'
    ],
    contentSummary: 'Complete standard operational guideline for meteorologists posted across Coastal Cyclone Warning Centers (ACWC Kolkata, ACWC Chennai, ACWC Mumbai, CWC Bhubaneswar, CWC Visakhapatnam, CWC Ahmedabad).'
  },
  {
    id: 'doc_002',
    title: 'Technical Manual on S-Band Doppler Weather Radar Maintenance & Echo Interpretation',
    category: 'Radar & Doppler',
    fileType: 'MANUAL',
    fileSize: '8.7 MB',
    author: 'Doppler Radar Operations Unit, Mausam Bhavan',
    department: 'Radar & Satellite Meteorology Division',
    uploadDate: '2024-03-22',
    tags: ['Radar', 'S-Band', 'Dual-Pol', 'Maintenance', 'Hydrometeors'],
    downloadsCount: 890,
    description: 'Comprehensive operational manual containing circuit diagrams, sun calibration procedures, ZDR zero check methods, and severe convective signature atlases.',
    keyHighlights: [
      'Step-by-step diagnostic guide for transmitter magnetron/klystron output power verification.',
      'Reflectivity attenuation equations in heavy tropical monsoon showers.',
      'Atlas of 40 real-world extreme events captured by Indian DWR network (Amphan, Biparjoy, Nor’westers).'
    ],
    contentSummary: 'Authoritative maintenance and interpretation manual for field engineers and operational radar meteorologists across all 37 IMD radar centers.'
  },
  {
    id: 'doc_003',
    title: 'High-Resolution INSAT-3DR & 3DS Multi-Spectral Image Interpretation Guide',
    category: 'Satellite Datasets',
    fileType: 'RESEARCH_PAPER',
    fileSize: '6.1 MB',
    author: 'Satellite Meteorology Division & SAC/ISRO',
    department: 'Satellite Division',
    uploadDate: '2024-02-18',
    tags: ['INSAT-3DS', 'Satellite', 'RGB Composites', 'Fog', 'Nowcasting'],
    downloadsCount: 1120,
    description: 'Official RGB product recipe guide detailing false color composite combinations for distinguishing night fog from low stratus, dust storms, and convective cloud tops.',
    keyHighlights: [
      'Night Microphysics RGB: 12.0µm - 10.8µm (Red), 10.8µm - 3.9µm (Green), 10.8µm (Blue).',
      'Day Convective Storm RGB recipes for tracking rapid cloud top glaciation.',
      'Sounder vertical temperature/humidity profile retrieval validation against radiosondes.'
    ],
    contentSummary: 'Comprehensive tutorial on maximizing the operational value of India’s newly operational geostationary meteorological satellites INSAT-3DR and INSAT-3DS.'
  },
  {
    id: 'doc_004',
    title: 'MoES National Climate Vulnerability Assessment Framework & Atlas',
    category: 'MoES Guidelines',
    fileType: 'PDF',
    fileSize: '12.4 MB',
    author: 'Ministry of Earth Sciences (MoES) Working Group',
    department: 'Climate Research and Services (CRS), IMD Pune',
    uploadDate: '2024-01-15',
    tags: ['Climate Change', 'Vulnerability', 'Heat Waves', 'Flood Risk', 'Atlas'],
    downloadsCount: 2340,
    description: 'District-wise climate risk atlas identifying vulnerable hotspots for heat waves, tropical cyclones, heavy precipitation events, and agricultural droughts across India.',
    keyHighlights: [
      'Comprehensive district vulnerability indices based on IPCC AR6 methodology.',
      'Actionable recommendations for municipal heat action plans (HAP).',
      'Sea level rise projections along the 7,516 km Indian coastline.'
    ],
    contentSummary: 'Strategic policy paper and geospatial atlas published by the Ministry of Earth Sciences for pan-India climate resilience planning.'
  },
  {
    id: 'doc_005',
    title: 'Urban Flash Flood Forecasting Guidelines: Integrating Radar QPE with Hydrological Models',
    category: 'Weather Forecasting',
    fileType: 'SOP',
    fileSize: '5.5 MB',
    author: 'Hydrometeorology Division, IMD',
    department: 'Hydrometeorology Directorate',
    uploadDate: '2024-04-05',
    tags: ['Urban Floods', 'QPE', 'Hydrology', 'Nowcasting', 'Mumbai', 'Chennai'],
    downloadsCount: 780,
    description: 'Operational integration protocol coupling high-resolution Doppler Radar Quantitative Precipitation Estimation (QPE) with hydrodynamic urban drainage models.',
    keyHighlights: [
      'Sub-hourly rainfall intensity threshold matrix for metro cities.',
      'Flash Flood Guidance System (FFGS) automated alert generation steps.',
      'Integration with municipal real-time pump station and river gauge sensors.'
    ],
    contentSummary: 'Technical framework deployed across Mumbai, Chennai, Bengaluru, and Delhi for mitigating urban inundation risks during extreme convective downpours.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_001',
    title: 'National Monsoon Preparedness & Radar Certification Drive (2024 Cycle)',
    content: 'All Regional Meteorological Centres (RMCs) and State Meteorological Centres (MCs) are directed to complete mandatory certification on S-Band Doppler Calibration before June 15th.',
    priority: 'Urgent',
    targetRole: 'All',
    targetDepartment: 'All Divisions',
    date: '2024-05-25',
    author: 'Dr. Mrutyunjay Mohapatra (DGM, IMD)',
    authorRole: 'Director General',
    isRead: false,
    linkText: 'Enroll in MET-RAD-401'
  },
  {
    id: 'ann_002',
    title: 'New INSAT-3DS Operational Data Stream Now Live in Knowledge Library',
    content: 'High-resolution 1km VIS and rapid 15-minute sector scan datasets from the recently commissioned INSAT-3DS satellite are now available in the Knowledge Repository for training modules.',
    priority: 'High',
    targetRole: 'Trainee',
    targetDepartment: 'Satellite Meteorology Division',
    date: '2024-05-22',
    author: 'Dr. Priya Varma (Scientist-E)',
    authorRole: 'Satellite Training Lead',
    isRead: false,
    linkText: 'Explore Datasets'
  },
  {
    id: 'ann_003',
    title: 'Trainer Workshop: Authoring AI-Ready Meteorological Questionnaires',
    content: 'Faculty members are invited to a specialized workshop on developing scenario-based MCQ assessments and hands-on simulation modules using the Capacity Connect Curriculum Builder.',
    priority: 'Normal',
    targetRole: 'Trainer',
    targetDepartment: 'Central Training Directorate',
    date: '2024-05-20',
    author: 'Shri Vikramaditya Sharma',
    authorRole: 'Joint Director (Capacity Building)',
    isRead: true,
    linkText: 'Join Virtual Session'
  }
];

export const INITIAL_PENDING_APPROVALS: PendingUserApproval[] = [
  {
    id: 'pnd_001',
    name: 'Anjali Deshmukh',
    email: 'anjali.deshmukh@imd.gov.in',
    appliedRole: 'Trainee',
    department: 'Radar & Satellite Meteorology Division',
    employeeId: 'IMD-TR-2024-9102',
    centerLocation: 'RMC Mumbai (Colaba Radar)',
    appliedDate: '2024-05-24',
    qualifications: 'M.Sc. Atmospheric Science, IIT Kharagpur',
    stationCode: 'BOM-RAD-04',
    idProofNumber: 'GOV-EMP-982103',
    status: 'Pending'
  },
  {
    id: 'pnd_002',
    name: 'Dr. T. Harikrishnan',
    email: 'hari.krishnan@ncmrwf.gov.in',
    appliedRole: 'Trainer',
    department: 'Numerical Weather Prediction Division',
    employeeId: 'MOES-FAC-1188',
    centerLocation: 'NCMRWF Noida / MoES',
    appliedDate: '2024-05-23',
    qualifications: 'Ph.D. Boundary Layer Meteorology, IISc Bengaluru',
    stationCode: 'NCMR-HPC-01',
    idProofNumber: 'GOV-SCI-449102',
    status: 'Pending'
  },
  {
    id: 'pnd_003',
    name: 'Suresh Chandra Panda',
    email: 'suresh.panda@imd.gov.in',
    appliedRole: 'Trainee',
    department: 'Cyclone Warning Division',
    employeeId: 'IMD-TR-2024-8994',
    centerLocation: 'CWC Bhubaneswar, Odisha',
    appliedDate: '2024-05-22',
    qualifications: 'B.Tech Mechanical + IMD Met-II Trainee Diploma',
    stationCode: 'BBI-CWC-02',
    idProofNumber: 'GOV-EMP-119284',
    status: 'Pending'
  },
  {
    id: 'pnd_004',
    name: 'Nisha B. Menon',
    email: 'nisha.menon@incois.gov.in',
    appliedRole: 'Trainee',
    department: 'Ocean-Atmosphere Dynamics',
    employeeId: 'INCOIS-TR-2024-301',
    centerLocation: 'INCOIS Hyderabad, MoES',
    appliedDate: '2024-05-21',
    qualifications: 'M.Sc. Physical Oceanography, CUSAT Cochin',
    stationCode: 'HYD-INC-07',
    idProofNumber: 'GOV-EMP-667104',
    status: 'Pending'
  }
];

export const INITIAL_TRAINEE_ANALYTICS = [
  { id: '1', name: 'Rajesh Kumar Meena', center: 'RMC New Delhi', coursesCompleted: 2, inProgress: 1, avgScore: 90, lastActive: 'Today', status: 'Excellent', weakDomain: 'Hydrometeorology' },
  { id: '2', name: 'Pooja Bhattacharya', center: 'RMC Kolkata', coursesCompleted: 3, inProgress: 0, avgScore: 94, lastActive: 'Yesterday', status: 'Top Performer', weakDomain: 'None' },
  { id: '3', name: 'Mohd. Imran Khan', center: 'MC Srinagar', coursesCompleted: 1, inProgress: 2, avgScore: 78, lastActive: '2 days ago', status: 'On Track', weakDomain: 'Radar De-aliasing' },
  { id: '4', name: 'Divya S. Pillai', center: 'MC Thiruvananthapuram', coursesCompleted: 2, inProgress: 1, avgScore: 82, lastActive: 'Today', status: 'Good', weakDomain: 'WPS Configuration' },
  { id: '5', name: 'Kalyan Mukherjee', center: 'CWC Bhubaneswar', coursesCompleted: 1, inProgress: 1, avgScore: 65, lastActive: '3 days ago', status: 'Needs Support', weakDomain: 'Dvorak Intensity Estimation' },
  { id: '6', name: 'Tarun V. Joshi', center: 'MC Ahmedabad', coursesCompleted: 2, inProgress: 0, avgScore: 88, lastActive: '1 day ago', status: 'On Track', weakDomain: 'Ensemble Post-Processing' },
];
