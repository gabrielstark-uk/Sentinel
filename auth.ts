import { Request, Response, NextFunction, Express } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
import { User } from '../shared/schema';
import { log } from './vite';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'sonic-protection-secret-key';
const SESSION_SECRET = process.env.SESSION_SECRET || 'sonic-protection-session-secret';

// JWT Configuration
const EXPIRES_IN = '7d';

// For type augmentation with Express
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      name: string | null;
      department: string | null;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}

// Define UserWithoutPassword and other needed enums
export type UserWithoutPassword = Omit<User, 'password'>;

// Define UserRole enum
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// Define SubscriptionPlan enum
export enum SubscriptionPlan {
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  PROFESSIONAL = 'PROFESSIONAL',
  ADVANCED = 'ADVANCED',
  ENTERPRISE = 'ENTERPRISE'
}

// Define PlanFeatures
export const PlanFeatures = {
  TRIAL: {
    allowsMeshNetwork: false,
    maxMeshDevices: 0
  },
  BASIC: {
    allowsMeshNetwork: true,
    maxMeshDevices: 3
  },
  STANDARD: {
    allowsMeshNetwork: true,
    maxMeshDevices: 5
  },
  PREMIUM: {
    allowsMeshNetwork: true,
    maxMeshDevices: 10
  },
  PROFESSIONAL: {
    allowsMeshNetwork: true,
    maxMeshDevices: 15
  },
  ADVANCED: {
    allowsMeshNetwork: true,
    maxMeshDevices: 25
  },
  ENTERPRISE: {
    allowsMeshNetwork: true,
    maxMeshDevices: -1 // unlimited
  }
};

// User information without password
export function sanitizeUser(user: User): UserWithoutPassword {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT utilities
export function generateToken(user: UserWithoutPassword): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): UserWithoutPassword | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserWithoutPassword;
  } catch (error) {
    return null;
  }
}

// Default admin user (no authentication required)
const defaultUser = {
  id: 999,
  username: 'Admin',
  email: 'admin@sentinel.local',
  name: 'System Administrator',
  department: 'SENTINEL Command',
  role: 'admin'
};

// No authentication required - always allow access
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Always set a default admin user
  req.user = defaultUser as Express.User;
  return next();
}

// No role restrictions - always allow access
export function hasRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Always set a default admin user
    req.user = defaultUser as Express.User;
    return next();
  };
}

// No subscription checks - always allow access
export async function hasSubscriptionAccess(req: Request, res: Response, next: NextFunction) {
  // Always set a default admin user
  req.user = defaultUser as Express.User;
  return next();
}

// No mesh network restrictions - always allow access
export async function hasMeshNetworkAccess(req: Request, res: Response, next: NextFunction) {
  // Always set a default admin user
  req.user = defaultUser as Express.User;
  return next();
}

// Setup authentication (minimal setup, no actual authentication)
export function setupAuth(app: Express) {
  // Use cookie parser
  app.use(cookieParser());

  // Session configuration (minimal)
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  }));

  // Initialize Passport (minimal)
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize and deserialize user (always use default user)
  passport.serializeUser((user, done) => {
    done(null, defaultUser.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    return done(null, defaultUser);
  });

  // Authentication routes (always return default user)

  // Register - always succeed with default user
  app.post('/api/register', async (req: Request, res: Response, next: NextFunction) => {
    const token = generateToken(defaultUser);
    return res.status(201).json({
      user: defaultUser,
      token
    });
  });

  // Login - always succeed with default user
  app.post('/api/login', async (req: Request, res: Response, next: NextFunction) => {
    const token = generateToken(defaultUser);
    log(`Auto-login activated for: ${defaultUser.username}`, 'auth');

    return res.json({
      user: defaultUser,
      token
    });
  });

  // Logout - always succeed
  app.post('/api/logout', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Logged out successfully' });
  });

  // Get current user - always return default user
  app.get('/api/user', async (req: Request, res: Response) => {
    res.json(defaultUser);
  });

  // Original user endpoint - always return default user
  app.get('/api/user-original', async (req: Request, res: Response) => {
    // Create a fake subscription for the default user
    const subscription = {
      id: 1,
      userId: defaultUser.id,
      plan: SubscriptionPlan.ENTERPRISE,
      active: true,
      startDate: new Date(),
      endDate: null,
      trialUsed: false,
      trialStartDate: null,
      trialEndDate: null,
      paymentStatus: 'active',
      autoRenew: true
    };

    return res.json({
      user: defaultUser,
      subscription
    });
  });
}