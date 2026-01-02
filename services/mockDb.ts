import { User, Mess, Student, DailyAttendance, UserRole, MonthlyBill, AttendanceRecord } from '../types';

const STORAGE_KEYS = {
  USERS: 'messmate_users',
  MESSES: 'messmate_messes',
  STUDENTS: 'messmate_students',
  ATTENDANCE: 'messmate_attendance',
  CURRENT_USER: 'messmate_current_user',
};

// --- Helper Functions ---
const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- Initialization / Seeding ---
const seedData = (forceRecreate = false) => {
  const existingUsers = getStorage<Record<string, User>>(STORAGE_KEYS.USERS, {});
  
  // Only seed if owner doesn't exist or we are forcing it
  if (!forceRecreate && existingUsers['owner_1']) return;

  // Create a default Owner
  const ownerId = 'owner_1';
  const messId = 'mess_1';
  
  const owner: User = { id: ownerId, name: 'Rajesh Kumar', phone: '9876543210', role: UserRole.OWNER };
  const mess: Mess = { id: messId, name: 'Annapurna Mess', ownerId, perMealRate: 80, currency: '₹', createdAt: new Date().toISOString() };
  
  const students: Student[] = [
    { id: 's1', name: 'Amit Sharma', phone: '9000000001', messId, joinedAt: new Date().toISOString() },
    { id: 's2', name: 'Rahul Verma', phone: '9000000002', messId, joinedAt: new Date().toISOString() },
    { id: 's3', name: 'Priya Singh', phone: '9000000003', messId, joinedAt: new Date().toISOString() },
    { id: 's4', name: 'Vikram Das', phone: '9000000004', messId, joinedAt: new Date().toISOString() },
  ];

  // Seed User map
  const users: Record<string, User> = { [ownerId]: owner };
  students.forEach(s => {
    users[s.phone] = { id: s.id, name: s.name, phone: s.phone, role: UserRole.STUDENT, messId };
  });

  setStorage(STORAGE_KEYS.USERS, users);
  setStorage(STORAGE_KEYS.MESSES, { [messId]: mess });
  setStorage(STORAGE_KEYS.STUDENTS, students);
  // Do not overwrite attendance if it exists, to preserve data across re-seeds
  if (forceRecreate || !localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    setStorage(STORAGE_KEYS.ATTENDANCE, []);
  }
};

// Initial seed on load
seedData();

// --- Service Methods ---

export const mockAuth = {
  login: async (phone: string): Promise<User | null> => {
    // Sanitize input
    const cleanPhone = phone.replace(/\D/g, '');

    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let users = getStorage<Record<string, User>>(STORAGE_KEYS.USERS, {});
    let user = Object.values(users).find(u => u.phone === cleanPhone);

    // AUTO-RECOVERY: If demo user not found, force re-seed and try again.
    if (!user && (cleanPhone === '9876543210' || cleanPhone === '9000000001')) {
      seedData(true);
      users = getStorage<Record<string, User>>(STORAGE_KEYS.USERS, {});
      user = Object.values(users).find(u => u.phone === cleanPhone);
    }
    
    if (user) {
      setStorage(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }
    return null;
  },
  
  register: async (name: string, phone: string, role: UserRole, messName?: string): Promise<User> => {
    const cleanPhone = phone.replace(/\D/g, '');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

    const users = getStorage<Record<string, User>>(STORAGE_KEYS.USERS, {});
    
    // Check if user already exists
    if (users[cleanPhone]) {
      throw new Error('User already exists');
    }

    const userId = `u_${Date.now()}`;
    const newUser: User = {
      id: userId,
      name,
      phone: cleanPhone,
      role
    };

    // If Owner, create a mess
    if (role === UserRole.OWNER && messName) {
      const messId = `m_${Date.now()}`;
      const newMess: Mess = {
        id: messId,
        name: messName,
        ownerId: userId,
        perMealRate: 0, // Default, user can update later
        currency: '₹',
        createdAt: new Date().toISOString()
      };
      
      const messes = getStorage<Record<string, Mess>>(STORAGE_KEYS.MESSES, {});
      messes[messId] = newMess;
      setStorage(STORAGE_KEYS.MESSES, messes);
    }

    // Save User
    users[cleanPhone] = newUser;
    setStorage(STORAGE_KEYS.USERS, users);
    
    // Login immediately
    setStorage(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    return getStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  refreshSession: (): User | null => {
    const currentUser = getStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!currentUser) return null;

    const users = getStorage<Record<string, User>>(STORAGE_KEYS.USERS, {});
    // Find the fresh user record
    const freshUser = Object.values(users).find(u => u.id === currentUser.id);
    
    if (freshUser) {
      setStorage(STORAGE_KEYS.CURRENT_USER, freshUser);
      return freshUser;
    }
    return currentUser;
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const users = getStorage<Record<string, User>>(STORAGE_KEYS.USERS, {});
    
    // Find user by ID since key is phone (this is a simple scan)
    const phoneKey = Object.keys(users).find(key => users[key].id === userId);
    
    if (!phoneKey) throw new Error("User not found");
    
    const updatedUser = { ...users[phoneKey], ...updates };
    users[phoneKey] = updatedUser;
    
    setStorage(STORAGE_KEYS.USERS, users);
    
    // Update session if it's current user
    const currentUser = getStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser && currentUser.id === userId) {
      setStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }

    return updatedUser;
  }
};

export const messService = {
  getMess: (ownerId: string): Mess | undefined => {
    const messes = getStorage<Record<string, Mess>>(STORAGE_KEYS.MESSES, {});
    return Object.values(messes).find(m => m.ownerId === ownerId);
  },

  getMessById: (messId: string): Mess | undefined => {
    const messes = getStorage<Record<string, Mess>>(STORAGE_KEYS.MESSES, {});
    return messes[messId];
  },

  updateMess: async (messId: string, updates: Partial<Mess>): Promise<Mess> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const messes = getStorage<Record<string, Mess>>(STORAGE_KEYS.MESSES, {});
    
    if (!messes[messId]) throw new Error("Mess not found");
    
    const updatedMess = { ...messes[messId], ...updates };
    messes[messId] = updatedMess;
    setStorage(STORAGE_KEYS.MESSES, messes);
    
    return updatedMess;
  },

  getStudents: (messId: string): Student[] => {
    const allStudents = getStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
    return allStudents.filter(s => s.messId === messId);
  },

  addStudent: async (messId: string, name: string, phone: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const cleanPhone = phone.replace(/\D/g, '');
    
    const students = getStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
    const newStudent: Student = {
      id: `s_${Date.now()}`,
      name,
      phone: cleanPhone,
      messId,
      joinedAt: new Date().toISOString()
    };
    students.push(newStudent);
    setStorage(STORAGE_KEYS.STUDENTS, students);

    // Also update Users map so they can login
    const users = getStorage<Record<string, User>>(STORAGE_KEYS.USERS, {});
    // Don't overwrite if existing user (e.g. registered student)
    if (!users[cleanPhone]) {
        users[cleanPhone] = { id: newStudent.id, name, phone: cleanPhone, role: UserRole.STUDENT, messId };
        setStorage(STORAGE_KEYS.USERS, users);
    } else {
        // If user exists, just ensure they are linked to the mess if they were unlinked
        const existing = users[cleanPhone];
        if (existing.role === UserRole.STUDENT && !existing.messId) {
            existing.messId = messId;
            setStorage(STORAGE_KEYS.USERS, users);
        }
    }

    return newStudent;
  },

  getAttendance: (messId: string, date: string): AttendanceRecord => {
    const allAttendance = getStorage<DailyAttendance[]>(STORAGE_KEYS.ATTENDANCE, []);
    const entry = allAttendance.find(a => a.messId === messId && a.date === date);
    return entry ? entry.records : {};
  },

  markAttendance: async (messId: string, date: string, studentId: string, status: boolean) => {
    const allAttendance = getStorage<DailyAttendance[]>(STORAGE_KEYS.ATTENDANCE, []);
    const index = allAttendance.findIndex(a => a.messId === messId && a.date === date);

    if (index >= 0) {
      allAttendance[index].records[studentId] = status;
    } else {
      allAttendance.push({
        messId,
        date,
        records: { [studentId]: status }
      });
    }
    setStorage(STORAGE_KEYS.ATTENDANCE, allAttendance);
  },

  getMonthlyReport: (messId: string, year: number, month: number): MonthlyBill[] => {
    const mess = messService.getMessById(messId);
    if (!mess) return [];

    const students = messService.getStudents(messId);
    const allAttendance = getStorage<DailyAttendance[]>(STORAGE_KEYS.ATTENDANCE, []);
    
    // Filter attendance for the month
    // month is 0-indexed (0 = Jan)
    const monthStr = (month + 1).toString().padStart(2, '0');
    const pattern = `${year}-${monthStr}`;
    
    const monthlyRecords = allAttendance.filter(a => a.messId === messId && a.date.startsWith(pattern));

    return students.map(student => {
      let mealCount = 0;
      monthlyRecords.forEach(day => {
        if (day.records[student.id]) mealCount++;
      });

      return {
        studentId: student.id,
        studentName: student.name,
        studentPhone: student.phone,
        totalMeals: mealCount,
        totalAmount: mealCount * mess.perMealRate
      };
    });
  }
};