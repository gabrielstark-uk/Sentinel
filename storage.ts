import { eq, desc, and, or, gte, lte, count, sql } from 'drizzle-orm';
import { db } from './db';
import { 
  User, NewUser, 
  ForensicReport, NewForensicReport, 
  BlockedFrequency, NewBlockedFrequency,
  ChatbotSettings, NewChatbotSettings,
  MeshDevice, NewMeshDevice,
  MobileDevice, NewMobileDevice,
  MobileAlert, NewMobileAlert,
  Subscription, NewSubscription,
  LawEnforcementAgency, NewLawEnforcementAgency,
  LawEnforcementReport, NewLawEnforcementReport,
  ThreatIntelligence, NewThreatIntelligence,
  SonicDeployment, NewSonicDeployment,
  AnalyticsEvent, NewAnalyticsEvent,
  NeuralProtectionSession, NewNeuralProtectionSession,
  users, forensicReports, blockedFrequencies, subscriptions, chatbotSettings, meshDevices,
  mobileDevices, mobileAlerts, lawEnforcementAgencies, lawEnforcementReports,
  threatIntelligence, sonicDeployments, analyticsEvents, neuralProtectionSessions
} from '../shared/schema';

// Enhanced Storage interface with comprehensive SENTINEL Defense Platform capabilities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: NewUser): Promise<User>;
  updateUser(id: number, user: Partial<NewUser>): Promise<User | undefined>;

  // Subscription operations
  getUserSubscription(userId: number): Promise<Subscription | undefined>;
  getAllSubscriptions(): Promise<Subscription[]>;
  createSubscription(subscription: NewSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<NewSubscription>): Promise<Subscription | undefined>;
  updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined>;
  updateUserStripeInfo(userId: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<Subscription | undefined>;

  // Forensic report operations
  getReports(): Promise<ForensicReport[]>;
  getUserReports(userId: number): Promise<ForensicReport[]>;
  getReport(id: number): Promise<ForensicReport | undefined>;
  createReport(report: NewForensicReport): Promise<ForensicReport>;
  updateReport(id: number, report: Partial<NewForensicReport>): Promise<ForensicReport | undefined>;
  deleteReport(id: number): Promise<boolean>;

  // Blocked frequency operations
  getBlockedFrequencies(): Promise<BlockedFrequency[]>;
  getUserBlockedFrequencies(userId: number): Promise<BlockedFrequency[]>;
  getBlockedFrequency(id: number): Promise<BlockedFrequency | undefined>;
  createBlockedFrequency(frequency: NewBlockedFrequency): Promise<BlockedFrequency>;
  updateBlockedFrequency(id: number, frequency: Partial<NewBlockedFrequency>): Promise<BlockedFrequency | undefined>;
  deleteBlockedFrequency(id: number): Promise<boolean>;
  
  // Chatbot settings operations
  getChatbotSettings(): Promise<ChatbotSettings | undefined>;
  updateChatbotSettings(settings: Partial<NewChatbotSettings>): Promise<ChatbotSettings>;

  // Mesh device operations
  getMeshDevices(): Promise<MeshDevice[]>;
  getMeshDevice(id: number): Promise<MeshDevice | undefined>;
  getUserMeshDevices(userId: number): Promise<MeshDevice[]>;
  createMeshDevice(device: NewMeshDevice): Promise<MeshDevice>;
  updateMeshDevice(id: number, device: Partial<NewMeshDevice>): Promise<MeshDevice | undefined>;
  deleteMeshDevice(id: number): Promise<boolean>;
  
  // Mobile device operations
  getMobileDevices(): Promise<MobileDevice[]>;
  getMobileDevice(id: number): Promise<MobileDevice | undefined>;
  getUserMobileDevices(userId: number): Promise<MobileDevice[]>;
  createMobileDevice(device: NewMobileDevice): Promise<MobileDevice>;
  updateMobileDevice(id: number, device: Partial<NewMobileDevice>): Promise<MobileDevice | undefined>;
  deleteMobileDevice(id: number): Promise<boolean>;
  
  // Mobile alert operations
  getMobileAlerts(userId: number): Promise<MobileAlert[]>;
  getMobileAlert(id: number): Promise<MobileAlert | undefined>;
  createMobileAlert(alert: NewMobileAlert): Promise<MobileAlert>;
  updateMobileAlert(id: number, alert: Partial<NewMobileAlert>): Promise<MobileAlert | undefined>;
  deleteMobileAlert(id: number): Promise<boolean>;
  markMobileAlertAsRead(id: number): Promise<MobileAlert | undefined>;

  // Law Enforcement Integration operations
  getLawEnforcementAgencies(): Promise<LawEnforcementAgency[]>;
  getLawEnforcementAgency(id: number): Promise<LawEnforcementAgency | undefined>;
  createLawEnforcementAgency(agency: NewLawEnforcementAgency): Promise<LawEnforcementAgency>;
  updateLawEnforcementAgency(id: number, agency: Partial<NewLawEnforcementAgency>): Promise<LawEnforcementAgency | undefined>;
  deleteLawEnforcementAgency(id: number): Promise<boolean>;

  // Law Enforcement Report operations
  getLawEnforcementReports(): Promise<LawEnforcementReport[]>;
  getUserLawEnforcementReports(userId: number): Promise<LawEnforcementReport[]>;
  getAllLawEnforcementReports(): Promise<LawEnforcementReport[]>;
  getLawEnforcementReport(id: number): Promise<LawEnforcementReport | undefined>;
  createLawEnforcementReport(report: NewLawEnforcementReport): Promise<LawEnforcementReport>;
  updateLawEnforcementReport(id: number, report: Partial<NewLawEnforcementReport>): Promise<LawEnforcementReport | undefined>;
  deleteLawEnforcementReport(id: number): Promise<boolean>;

  // Threat Intelligence operations
  getThreatIntelligence(): Promise<ThreatIntelligence[]>;
  getThreatIntelligenceByType(type: string): Promise<ThreatIntelligence[]>;
  getThreatIntelligenceItem(id: number): Promise<ThreatIntelligence | undefined>;
  createThreatIntelligence(intel: NewThreatIntelligence): Promise<ThreatIntelligence>;
  updateThreatIntelligence(id: number, intel: Partial<NewThreatIntelligence>): Promise<ThreatIntelligence | undefined>;
  deleteThreatIntelligence(id: number): Promise<boolean>;

  // Sonic Disruptor operations
  getSonicDeployments(): Promise<SonicDeployment[]>;
  getUserSonicDeployments(userId: number): Promise<SonicDeployment[]>;
  getSonicDeployment(id: number): Promise<SonicDeployment | undefined>;
  createSonicDeployment(deployment: NewSonicDeployment): Promise<SonicDeployment>;
  updateSonicDeployment(id: number, deployment: Partial<NewSonicDeployment>): Promise<SonicDeployment | undefined>;
  deleteSonicDeployment(id: number): Promise<boolean>;

  // Analytics operations
  getAnalyticsEvents(): Promise<AnalyticsEvent[]>;
  getUserAnalyticsEvents(userId: number): Promise<AnalyticsEvent[]>;
  getAnalyticsEvent(id: number): Promise<AnalyticsEvent | undefined>;
  createAnalyticsEvent(event: NewAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsByTimeRange(startTime: Date, endTime: Date): Promise<AnalyticsEvent[]>;
  getAnalyticsByEventType(eventType: string): Promise<AnalyticsEvent[]>;

  // Neural Protection operations
  getNeuralProtectionSessions(): Promise<NeuralProtectionSession[]>;
  getUserNeuralProtectionSessions(userId: number): Promise<NeuralProtectionSession[]>;
  getNeuralProtectionSession(id: number): Promise<NeuralProtectionSession | undefined>;
  createNeuralProtectionSession(session: NewNeuralProtectionSession): Promise<NeuralProtectionSession>;
  updateNeuralProtectionSession(id: number, session: Partial<NewNeuralProtectionSession>): Promise<NeuralProtectionSession | undefined>;
  endNeuralProtectionSession(id: number): Promise<NeuralProtectionSession | undefined>;

  // Advanced Search and Analytics
  searchThreats(query: string, filters?: any): Promise<ThreatIntelligence[]>;
  getSystemStatistics(): Promise<any>;
  getThreatTrends(timeRange: string): Promise<any>;
  getFrequencyAnalysis(frequency: number, timeRange?: string): Promise<any>;
}

// In-memory storage implementation (for development/testing)
export class MemStorage implements IStorage {
  [x: string]: any;
  private users: Map<number, User>;
  private subscriptions: Map<number, Subscription>;
  private reports: Map<number, ForensicReport>;
  private blockedFrequencies: Map<number, BlockedFrequency>;
  private meshDevices: Map<number, MeshDevice>;
  private mobileDevices: Map<number, MobileDevice>;
  private mobileAlerts: Map<number, MobileAlert>;
  private chatbotSettings: ChatbotSettings | undefined;
  private userIdCounter: number;
  private subscriptionIdCounter: number;
  private reportIdCounter: number;
  private blockedFrequencyIdCounter: number;
  private meshDeviceIdCounter: number;
  private mobileDeviceIdCounter: number;
    getLawEnforcementAgencies: any;
  private mobileAlertIdCounter: number;

  constructor() {
    this.users = new Map();
    this.subscriptions = new Map();
    this.reports = new Map();
    this.blockedFrequencies = new Map();
    this.meshDevices = new Map();
    this.mobileDevices = new Map();
    this.mobileAlerts = new Map();
    this.userIdCounter = 1;
    this.subscriptionIdCounter = 1;
    this.reportIdCounter = 1;
    this.blockedFrequencyIdCounter = 1;
    this.meshDeviceIdCounter = 1;
    this.mobileDeviceIdCounter = 1;
    this.mobileAlertIdCounter = 1;

    // Add demo user (password: demo123)
    this.createUser({
      username: 'demo',
      password: '$2b$10$YVS3Bk5RBvCcKJmYymF2DeRWH.QzoNmF0N6hsU1v1pvfk2TpSTgHu',
      email: 'demo@example.com',
      name: 'Demo User',
      department: 'Law Enforcement',
      role: 'user'
    });

    // Add admin user (password: admin123)
    this.createUser({
      username: 'admin',
      password: '$2b$10$zGcBGU3zgYm5BRQnEP.J7OmwVJFdJG62qW3Qh/zCGX.vMH3IbcAZ2',
      email: 'admin@example.com',
      name: 'System Administrator',
      department: 'IT',
      role: 'admin'
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: NewUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { 
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name || null,
      department: insertUser.department || null,
      role: insertUser.role || 'user',
      id, 
      createdAt,
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<NewUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Subscription operations
  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(sub => sub.userId === userId);
  }
  
  async getAllSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values());
  }

  async createSubscription(subscription: NewSubscription): Promise<Subscription> {
    const id = this.subscriptionIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const newSubscription: Subscription = { 
      userId: subscription.userId,
      plan: subscription.plan,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate || null,
      paymentMethod: subscription.paymentMethod || null,
      paymentId: subscription.paymentId || null,
      features: subscription.features || null,
      trialUsed: subscription.trialUsed || false,
      id, 
      createdAt,
      updatedAt
    };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async updateSubscription(id: number, updateData: Partial<NewSubscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...updateData, updatedAt: new Date() };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    // Note: This method doesn't have a place to store stripeCustomerId in the User schema
    // but we're keeping the interface for compatibility
    return user;
  }
  
  async updateUserStripeInfo(userId: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<Subscription | undefined> {
    const subscription = await this.getUserSubscription(userId);
    
    if (subscription) {
      const updatedSubscription = { 
        ...subscription, 
        paymentId: stripeInfo.stripeSubscriptionId,
        updatedAt: new Date()
      };
      this.subscriptions.set(subscription.id, updatedSubscription);
      return updatedSubscription;
    }
    
    return undefined;
  }

  // Report operations
  async getReports(): Promise<ForensicReport[]> {
    return Array.from(this.reports.values());
  }

  async getUserReports(userId: number): Promise<ForensicReport[]> {
    return Array.from(this.reports.values()).filter(report => report.userId === userId);
  }

  async getReport(id: number): Promise<ForensicReport | undefined> {
    return this.reports.get(id);
  }

  async createReport(report: NewForensicReport): Promise<ForensicReport> {
    const id = this.reportIdCounter++;
    const createdAt = new Date();
    const timestamp = report.timestamp || new Date();
    const newReport: ForensicReport = {
      userId: report.userId,
      title: report.title,
      description: report.description || null,
      frequencyData: report.frequencyData || null,
      locationData: report.locationData || null,
      deviceData: report.deviceData || null,
      mlClassification: report.mlClassification || null,
      reportData: report.reportData || null,
      id,
      createdAt,
      timestamp
    };
    this.reports.set(id, newReport);
    return newReport;
  }

  async updateReport(id: number, updateData: Partial<NewForensicReport>): Promise<ForensicReport | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, ...updateData };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  async deleteReport(id: number): Promise<boolean> {
    return this.reports.delete(id);
  }

  // Blocked frequency operations
  async getBlockedFrequencies(): Promise<BlockedFrequency[]> {
    return Array.from(this.blockedFrequencies.values());
  }

  async getUserBlockedFrequencies(userId: number): Promise<BlockedFrequency[]> {
    return Array.from(this.blockedFrequencies.values()).filter(freq => freq.userId === userId);
  }

  async getBlockedFrequency(id: number): Promise<BlockedFrequency | undefined> {
    return this.blockedFrequencies.get(id);
  }

  async createBlockedFrequency(frequency: NewBlockedFrequency): Promise<BlockedFrequency> {
    const id = this.blockedFrequencyIdCounter++;
    const createdAt = new Date();
    const newFrequency: BlockedFrequency = { 
      userId: frequency.userId,
      frequency: frequency.frequency,
      bandwidth: frequency.bandwidth,
      name: frequency.name || null,
      description: frequency.description || null,
      isCustom: frequency.isCustom || false,
      id, 
      createdAt
    };
    this.blockedFrequencies.set(id, newFrequency);
    return newFrequency;
  }

  async updateBlockedFrequency(id: number, updateData: Partial<NewBlockedFrequency>): Promise<BlockedFrequency | undefined> {
    const frequency = this.blockedFrequencies.get(id);
    if (!frequency) return undefined;
    
    const updatedFrequency = { ...frequency, ...updateData };
    this.blockedFrequencies.set(id, updatedFrequency);
    return updatedFrequency;
  }

  async deleteBlockedFrequency(id: number): Promise<boolean> {
    return this.blockedFrequencies.delete(id);
  }

  // Chatbot settings operations
  async getChatbotSettings(): Promise<ChatbotSettings | undefined> {
    return this.chatbotSettings;
  }

  async updateChatbotSettings(settings: Partial<NewChatbotSettings>): Promise<ChatbotSettings> {
    const updatedAt = new Date();
    
    if (this.chatbotSettings) {
      this.chatbotSettings = { ...this.chatbotSettings, ...settings, updatedAt };
    } else {
      this.chatbotSettings = {
        id: 1,
        enabled: settings.enabled ?? true,
        welcomeMessage: settings.welcomeMessage ?? null,
        primaryColor: settings.primaryColor ?? null,
        secondaryColor: settings.secondaryColor ?? null,
        responseTime: settings.responseTime ?? 1000,
        knowledgeBase: settings.knowledgeBase ?? null,
        updatedAt
      };
    }
    
    return this.chatbotSettings;
  }

  // Mesh device operations
  async getMeshDevices(): Promise<MeshDevice[]> {
    return Array.from(this.meshDevices.values());
  }

  async getMeshDevice(id: number): Promise<MeshDevice | undefined> {
    return this.meshDevices.get(id);
  }

  async getUserMeshDevices(userId: number): Promise<MeshDevice[]> {
    return Array.from(this.meshDevices.values()).filter(device => device.userId === userId);
  }

  async createMeshDevice(device: NewMeshDevice): Promise<MeshDevice> {
    const id = this.meshDeviceIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const lastSeen = device.lastSeen || new Date();
    const newDevice: MeshDevice = { 
      userId: device.userId,
      deviceId: device.deviceId,
      name: device.name,
      type: device.type,
      active: device.active !== undefined ? device.active : true,
      ipAddress: device.ipAddress || null,
      macAddress: device.macAddress || null,
      batteryLevel: device.batteryLevel || null,
      firmwareVersion: device.firmwareVersion || null,
      signalStrength: device.signalStrength || null,
      capabilities: device.capabilities || null,
      meshSettings: device.meshSettings || null,
      id, 
      createdAt,
      updatedAt,
      lastSeen
    };
    this.meshDevices.set(id, newDevice);
    return newDevice;
  }

  async updateMeshDevice(id: number, updateData: Partial<NewMeshDevice>): Promise<MeshDevice | undefined> {
    const device = this.meshDevices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, ...updateData, updatedAt: new Date() };
    this.meshDevices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteMeshDevice(id: number): Promise<boolean> {
    return this.meshDevices.delete(id);
  }

  // Mobile device operations
  async getMobileDevices(): Promise<MobileDevice[]> {
    return Array.from(this.mobileDevices.values());
  }

  async getMobileDevice(id: number): Promise<MobileDevice | undefined> {
    return this.mobileDevices.get(id);
  }

  async getUserMobileDevices(userId: number): Promise<MobileDevice[]> {
    return Array.from(this.mobileDevices.values()).filter(device => device.userId === userId);
  }

  async createMobileDevice(device: NewMobileDevice): Promise<MobileDevice> {
    const id = this.mobileDeviceIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const lastConnected = device.lastConnected || new Date();
    const newDevice: MobileDevice = { 
      userId: device.userId,
      deviceId: device.deviceId,
      name: device.name,
      type: device.type,
      version: device.version || null,
      status: device.status,
      batteryLevel: device.batteryLevel || null,
      notifications: device.notifications !== undefined ? device.notifications : true,
      locationSharing: device.locationSharing !== undefined ? device.locationSharing : false,
      autoProtection: device.autoProtection !== undefined ? device.autoProtection : true,
      settings: device.settings || null,
      protectionStatus: device.protectionStatus || null,
      lastLocation: device.lastLocation || null,
      locationHistory: device.locationHistory || null,
      trackingEnabled: device.trackingEnabled !== undefined ? device.trackingEnabled : false,
      trackingInterval: device.trackingInterval !== undefined ? device.trackingInterval : 60,
      trackingPurpose: device.trackingPurpose || null,
      id, 
      createdAt,
      updatedAt,
      lastConnected
    };
    this.mobileDevices.set(id, newDevice);
    return newDevice;
  }

  async updateMobileDevice(id: number, updateData: Partial<NewMobileDevice>): Promise<MobileDevice | undefined> {
    const device = this.mobileDevices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, ...updateData, updatedAt: new Date() };
    this.mobileDevices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteMobileDevice(id: number): Promise<boolean> {
    return this.mobileDevices.delete(id);
  }

  // Mobile alert operations
  async getMobileAlerts(userId: number): Promise<MobileAlert[]> {
    // Note: MobileAlert doesn't have a userId field, so we need to join with mobile devices
    const userDevices = await this.getUserMobileDevices(userId);
    const deviceIds = userDevices.map(device => device.id);
    return Array.from(this.mobileAlerts.values()).filter(alert => 
      deviceIds.includes(alert.mobileDeviceId)
    );
  }

  async getMobileAlert(id: number): Promise<MobileAlert | undefined> {
    return this.mobileAlerts.get(id);
  }

  async createMobileAlert(alert: NewMobileAlert): Promise<MobileAlert> {
    const id = this.mobileAlertIdCounter++;
    const createdAt = new Date();
    const timestamp = alert.timestamp || new Date();
    const newAlert: MobileAlert = { 
      mobileDeviceId: alert.mobileDeviceId,
      title: alert.title,
      description: alert.description,
      type: alert.type,
      severity: alert.severity,
      location: alert.location || null,
      frequencyData: alert.frequencyData || null,
      read: alert.read !== undefined ? alert.read : false,
      acknowledged: alert.acknowledged !== undefined ? alert.acknowledged : false,
      id, 
      createdAt,
      timestamp
    };
    this.mobileAlerts.set(id, newAlert);
    return newAlert;
  }

  async updateMobileAlert(id: number, updateData: Partial<NewMobileAlert>): Promise<MobileAlert | undefined> {
    const alert = this.mobileAlerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, ...updateData };
    this.mobileAlerts.set(id, updatedAlert);
    return updatedAlert;
  }

  async deleteMobileAlert(id: number): Promise<boolean> {
    return this.mobileAlerts.delete(id);
  }

  async markMobileAlertAsRead(id: number): Promise<MobileAlert | undefined> {
    return this.updateMobileAlert(id, { read: true });
  }
}

// Database storage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: NewUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<NewUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Subscription operations
  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return subscription || undefined;
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions);
  }

  async createSubscription(subscription: NewSubscription): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }

  async updateSubscription(id: number, updateData: Partial<NewSubscription>): Promise<Subscription | undefined> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription || undefined;
  }

  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined> {
    // Note: This method doesn't have a place to store stripeCustomerId in the User schema
    // but we're keeping the interface for compatibility
    return this.getUser(userId);
  }

  async updateUserStripeInfo(userId: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<Subscription | undefined> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return undefined;

    return this.updateSubscription(subscription.id, {
      paymentId: stripeInfo.stripeSubscriptionId
    });
  }

  // Forensic report operations
  async getReports(): Promise<ForensicReport[]> {
    return await db.select().from(forensicReports);
  }

  async getUserReports(userId: number): Promise<ForensicReport[]> {
    return await db.select().from(forensicReports).where(eq(forensicReports.userId, userId));
  }

  async getReport(id: number): Promise<ForensicReport | undefined> {
    const [report] = await db.select().from(forensicReports).where(eq(forensicReports.id, id));
    return report || undefined;
  }

  async createReport(report: NewForensicReport): Promise<ForensicReport> {
    const [newReport] = await db
      .insert(forensicReports)
      .values(report)
      .returning();
    return newReport;
  }

  async updateReport(id: number, updateData: Partial<NewForensicReport>): Promise<ForensicReport | undefined> {
    const [report] = await db
      .update(forensicReports)
      .set(updateData)
      .where(eq(forensicReports.id, id))
      .returning();
    return report || undefined;
  }

  async deleteReport(id: number): Promise<boolean> {
    const result = await db.delete(forensicReports).where(eq(forensicReports.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Blocked frequency operations
  async getBlockedFrequencies(): Promise<BlockedFrequency[]> {
    return await db.select().from(blockedFrequencies);
  }

  async getUserBlockedFrequencies(userId: number): Promise<BlockedFrequency[]> {
    return await db.select().from(blockedFrequencies).where(eq(blockedFrequencies.userId, userId));
  }

  async getBlockedFrequency(id: number): Promise<BlockedFrequency | undefined> {
    const [frequency] = await db.select().from(blockedFrequencies).where(eq(blockedFrequencies.id, id));
    return frequency || undefined;
  }

  async createBlockedFrequency(frequency: NewBlockedFrequency): Promise<BlockedFrequency> {
    const [newFrequency] = await db
      .insert(blockedFrequencies)
      .values(frequency)
      .returning();
    return newFrequency;
  }

  async updateBlockedFrequency(id: number, updateData: Partial<NewBlockedFrequency>): Promise<BlockedFrequency | undefined> {
    const [frequency] = await db
      .update(blockedFrequencies)
      .set(updateData)
      .where(eq(blockedFrequencies.id, id))
      .returning();
    return frequency || undefined;
  }

  async deleteBlockedFrequency(id: number): Promise<boolean> {
    const result = await db.delete(blockedFrequencies).where(eq(blockedFrequencies.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Chatbot settings operations
  async getChatbotSettings(): Promise<ChatbotSettings | undefined> {
    const [settings] = await db.select().from(chatbotSettings).limit(1);
    return settings || undefined;
  }

  async updateChatbotSettings(settings: Partial<NewChatbotSettings>): Promise<ChatbotSettings> {
    const existing = await this.getChatbotSettings();
    
    if (existing) {
      const [updated] = await db
        .update(chatbotSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(chatbotSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(chatbotSettings)
        .values(settings)
        .returning();
      return created;
    }
  }

  // Mesh device operations
  async getMeshDevices(): Promise<MeshDevice[]> {
    return await db.select().from(meshDevices);
  }

  async getMeshDevice(id: number): Promise<MeshDevice | undefined> {
    const [device] = await db.select().from(meshDevices).where(eq(meshDevices.id, id));
    return device || undefined;
  }

  async getUserMeshDevices(userId: number): Promise<MeshDevice[]> {
    return await db.select().from(meshDevices).where(eq(meshDevices.userId, userId));
  }

  async createMeshDevice(device: NewMeshDevice): Promise<MeshDevice> {
    const [newDevice] = await db
      .insert(meshDevices)
      .values(device)
      .returning();
    return newDevice;
  }

  async updateMeshDevice(id: number, updateData: Partial<NewMeshDevice>): Promise<MeshDevice | undefined> {
    const [device] = await db
      .update(meshDevices)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(meshDevices.id, id))
      .returning();
    return device || undefined;
  }

  async deleteMeshDevice(id: number): Promise<boolean> {
    const result = await db.delete(meshDevices).where(eq(meshDevices.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Mobile device operations
  async getMobileDevices(): Promise<MobileDevice[]> {
    return await db.select().from(mobileDevices);
  }

  async getMobileDevice(id: number): Promise<MobileDevice | undefined> {
    const [device] = await db.select().from(mobileDevices).where(eq(mobileDevices.id, id));
    return device || undefined;
  }

  async getUserMobileDevices(userId: number): Promise<MobileDevice[]> {
    return await db.select().from(mobileDevices).where(eq(mobileDevices.userId, userId));
  }

  async createMobileDevice(device: NewMobileDevice): Promise<MobileDevice> {
    const [newDevice] = await db
      .insert(mobileDevices)
      .values(device)
      .returning();
    return newDevice;
  }

  async updateMobileDevice(id: number, updateData: Partial<NewMobileDevice>): Promise<MobileDevice | undefined> {
    const [device] = await db
      .update(mobileDevices)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(mobileDevices.id, id))
      .returning();
    return device || undefined;
  }

  async deleteMobileDevice(id: number): Promise<boolean> {
    const result = await db.delete(mobileDevices).where(eq(mobileDevices.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Mobile alert operations
  async getMobileAlerts(userId: number): Promise<MobileAlert[]> {
    // Join with mobile devices to get alerts for user's devices
    return await db
      .select()
      .from(mobileAlerts)
      .innerJoin(mobileDevices, eq(mobileAlerts.mobileDeviceId, mobileDevices.id))
      .where(eq(mobileDevices.userId, userId))
      .then(results => results.map(result => result.mobile_alerts));
  }

  async getMobileAlert(id: number): Promise<MobileAlert | undefined> {
    const [alert] = await db.select().from(mobileAlerts).where(eq(mobileAlerts.id, id));
    return alert || undefined;
  }

  async createMobileAlert(alert: NewMobileAlert): Promise<MobileAlert> {
    const [newAlert] = await db
      .insert(mobileAlerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async updateMobileAlert(id: number, updateData: Partial<NewMobileAlert>): Promise<MobileAlert | undefined> {
    const [alert] = await db
      .update(mobileAlerts)
      .set(updateData)
      .where(eq(mobileAlerts.id, id))
      .returning();
    return alert || undefined;
  }

  async deleteMobileAlert(id: number): Promise<boolean> {
    const result = await db.delete(mobileAlerts).where(eq(mobileAlerts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async markMobileAlertAsRead(id: number): Promise<MobileAlert | undefined> {
    return this.updateMobileAlert(id, { read: true });
  }

  // Law Enforcement Integration operations
  async getLawEnforcementAgencies(): Promise<LawEnforcementAgency[]> {
    return await db.select().from(lawEnforcementAgencies).where(eq(lawEnforcementAgencies.active, true));
  }

  async getLawEnforcementAgency(id: number): Promise<LawEnforcementAgency | undefined> {
    const [agency] = await db.select().from(lawEnforcementAgencies).where(eq(lawEnforcementAgencies.id, id));
    return agency || undefined;
  }

  async createLawEnforcementAgency(agency: NewLawEnforcementAgency): Promise<LawEnforcementAgency> {
    const [newAgency] = await db
      .insert(lawEnforcementAgencies)
      .values(agency)
      .returning();
    return newAgency;
  }

  async updateLawEnforcementAgency(id: number, updateData: Partial<NewLawEnforcementAgency>): Promise<LawEnforcementAgency | undefined> {
    const [agency] = await db
      .update(lawEnforcementAgencies)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(lawEnforcementAgencies.id, id))
      .returning();
    return agency || undefined;
  }

  async deleteLawEnforcementAgency(id: number): Promise<boolean> {
    const result = await db.delete(lawEnforcementAgencies).where(eq(lawEnforcementAgencies.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Law Enforcement Report operations
  async getLawEnforcementReports(): Promise<LawEnforcementReport[]> {
    return await db.select().from(lawEnforcementReports).orderBy(desc(lawEnforcementReports.createdAt));
  }

  async getUserLawEnforcementReports(userId: number): Promise<LawEnforcementReport[]> {
    return await db.select().from(lawEnforcementReports)
      .where(eq(lawEnforcementReports.userId, userId))
      .orderBy(desc(lawEnforcementReports.createdAt));
  }

  async getAllLawEnforcementReports(): Promise<LawEnforcementReport[]> {
    return await db.select().from(lawEnforcementReports).orderBy(desc(lawEnforcementReports.createdAt));
  }

  async getLawEnforcementReport(id: number): Promise<LawEnforcementReport | undefined> {
    const [report] = await db.select().from(lawEnforcementReports).where(eq(lawEnforcementReports.id, id));
    return report || undefined;
  }

  async createLawEnforcementReport(report: NewLawEnforcementReport): Promise<LawEnforcementReport> {
    const [newReport] = await db
      .insert(lawEnforcementReports)
      .values(report)
      .returning();
    return newReport;
  }

  async updateLawEnforcementReport(id: number, updateData: Partial<NewLawEnforcementReport>): Promise<LawEnforcementReport | undefined> {
    const [report] = await db
      .update(lawEnforcementReports)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(lawEnforcementReports.id, id))
      .returning();
    return report || undefined;
  }

  async deleteLawEnforcementReport(id: number): Promise<boolean> {
    const result = await db.delete(lawEnforcementReports).where(eq(lawEnforcementReports.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Threat Intelligence operations
  async getThreatIntelligence(): Promise<ThreatIntelligence[]> {
    return await db.select().from(threatIntelligence)
      .where(eq(threatIntelligence.active, true))
      .orderBy(desc(threatIntelligence.lastSeen));
  }

  async getThreatIntelligenceByType(type: string): Promise<ThreatIntelligence[]> {
    return await db.select().from(threatIntelligence)
      .where(and(eq(threatIntelligence.threatType, type), eq(threatIntelligence.active, true)))
      .orderBy(desc(threatIntelligence.lastSeen));
  }

  async getThreatIntelligenceItem(id: number): Promise<ThreatIntelligence | undefined> {
    const [intel] = await db.select().from(threatIntelligence).where(eq(threatIntelligence.id, id));
    return intel || undefined;
  }

  async createThreatIntelligence(intel: NewThreatIntelligence): Promise<ThreatIntelligence> {
    const [newIntel] = await db
      .insert(threatIntelligence)
      .values(intel)
      .returning();
    return newIntel;
  }

  async updateThreatIntelligence(id: number, updateData: Partial<NewThreatIntelligence>): Promise<ThreatIntelligence | undefined> {
    const [intel] = await db
      .update(threatIntelligence)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(threatIntelligence.id, id))
      .returning();
    return intel || undefined;
  }

  async deleteThreatIntelligence(id: number): Promise<boolean> {
    const result = await db.delete(threatIntelligence).where(eq(threatIntelligence.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Sonic Disruptor operations
  async getSonicDeployments(): Promise<SonicDeployment[]> {
    return await db.select().from(sonicDeployments).orderBy(desc(sonicDeployments.deploymentTime));
  }

  async getUserSonicDeployments(userId: number): Promise<SonicDeployment[]> {
    return await db.select().from(sonicDeployments)
      .where(eq(sonicDeployments.userId, userId))
      .orderBy(desc(sonicDeployments.deploymentTime));
  }

  async getSonicDeployment(id: number): Promise<SonicDeployment | undefined> {
    const [deployment] = await db.select().from(sonicDeployments).where(eq(sonicDeployments.id, id));
    return deployment || undefined;
  }

  async createSonicDeployment(deployment: NewSonicDeployment): Promise<SonicDeployment> {
    const [newDeployment] = await db
      .insert(sonicDeployments)
      .values(deployment)
      .returning();
    return newDeployment;
  }

  async updateSonicDeployment(id: number, updateData: Partial<NewSonicDeployment>): Promise<SonicDeployment | undefined> {
    const [deployment] = await db
      .update(sonicDeployments)
      .set(updateData)
      .where(eq(sonicDeployments.id, id))
      .returning();
    return deployment || undefined;
  }

  async deleteSonicDeployment(id: number): Promise<boolean> {
    const result = await db.delete(sonicDeployments).where(eq(sonicDeployments.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Analytics operations
  async getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
    return await db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.timestamp));
  }

  async getUserAnalyticsEvents(userId: number): Promise<AnalyticsEvent[]> {
    return await db.select().from(analyticsEvents)
      .where(eq(analyticsEvents.userId, userId))
      .orderBy(desc(analyticsEvents.timestamp));
  }

  async getAnalyticsEvent(id: number): Promise<AnalyticsEvent | undefined> {
    const [event] = await db.select().from(analyticsEvents).where(eq(analyticsEvents.id, id));
    return event || undefined;
  }

  async createAnalyticsEvent(event: NewAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db
      .insert(analyticsEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async getAnalyticsByTimeRange(startTime: Date, endTime: Date): Promise<AnalyticsEvent[]> {
    return await db.select().from(analyticsEvents)
      .where(and(gte(analyticsEvents.timestamp, startTime), lte(analyticsEvents.timestamp, endTime)))
      .orderBy(desc(analyticsEvents.timestamp));
  }

  async getAnalyticsByEventType(eventType: string): Promise<AnalyticsEvent[]> {
    return await db.select().from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, eventType))
      .orderBy(desc(analyticsEvents.timestamp));
  }

  // Neural Protection operations
  async getNeuralProtectionSessions(): Promise<NeuralProtectionSession[]> {
    return await db.select().from(neuralProtectionSessions).orderBy(desc(neuralProtectionSessions.startTime));
  }

  async getUserNeuralProtectionSessions(userId: number): Promise<NeuralProtectionSession[]> {
    return await db.select().from(neuralProtectionSessions)
      .where(eq(neuralProtectionSessions.userId, userId))
      .orderBy(desc(neuralProtectionSessions.startTime));
  }

  async getNeuralProtectionSession(id: number): Promise<NeuralProtectionSession | undefined> {
    const [session] = await db.select().from(neuralProtectionSessions).where(eq(neuralProtectionSessions.id, id));
    return session || undefined;
  }

  async createNeuralProtectionSession(session: NewNeuralProtectionSession): Promise<NeuralProtectionSession> {
    const [newSession] = await db
      .insert(neuralProtectionSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateNeuralProtectionSession(id: number, updateData: Partial<NewNeuralProtectionSession>): Promise<NeuralProtectionSession | undefined> {
    const [session] = await db
      .update(neuralProtectionSessions)
      .set(updateData)
      .where(eq(neuralProtectionSessions.id, id))
      .returning();
    return session || undefined;
  }

  async endNeuralProtectionSession(id: number): Promise<NeuralProtectionSession | undefined> {
    return this.updateNeuralProtectionSession(id, { 
      status: 'completed', 
      endTime: new Date()
    });
  }

  // Advanced Search and Analytics
  async searchThreats(query: string, filters?: any): Promise<ThreatIntelligence[]> {
    return await db.select().from(threatIntelligence)
      .where(and(
        eq(threatIntelligence.active, true),
        or(
          sql`${threatIntelligence.threatType} ILIKE ${`%${query}%`}`,
          sql`${threatIntelligence.signature} ILIKE ${`%${query}%`}`
        )
      ))
      .orderBy(desc(threatIntelligence.confidence));
  }

  async getSystemStatistics(): Promise<any> {
    const [threatCount] = await db.select({ count: count() }).from(threatIntelligence);
    const [deploymentCount] = await db.select({ count: count() }).from(sonicDeployments);
    const [reportCount] = await db.select({ count: count() }).from(forensicReports);
    const [userCount] = await db.select({ count: count() }).from(users);

    return {
      threats: threatCount.count || 0,
      deployments: deploymentCount.count || 0,
      reports: reportCount.count || 0,
      users: userCount.count || 0,
      timestamp: new Date()
    };
  }

  async getThreatTrends(timeRange: string): Promise<any> {
    const hoursBack = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720; // 30d
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    const threats = await db.select().from(threatIntelligence)
      .where(gte(threatIntelligence.lastSeen, since))
      .orderBy(desc(threatIntelligence.lastSeen));

    // Group by threat type for trend analysis
    const trends = threats.reduce((acc, threat) => {
      acc[threat.threatType] = (acc[threat.threatType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      timeRange,
      trends,
      total: threats.length,
      timestamp: new Date()
    };
  }

  async getFrequencyAnalysis(frequency: number, timeRange?: string): Promise<any> {
    const hoursBack = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    // Find threats with similar frequency profiles
    const relatedThreats = await db.select().from(threatIntelligence)
      .where(and(
        eq(threatIntelligence.active, true),
        gte(threatIntelligence.lastSeen, since)
      ));

    // Filter by frequency similarity (within 10% range)
    const frequencyRange = frequency * 0.1;
    const similarThreats = relatedThreats.filter(threat => {
      if (!threat.frequencyProfile) return false;
      const profile = threat.frequencyProfile as any;
      if (profile.mainFrequency) {
        return Math.abs(profile.mainFrequency - frequency) <= frequencyRange;
      }
      return false;
    });

    return {
      frequency,
      timeRange: timeRange || '30d',
      similarThreats: similarThreats.length,
      threats: similarThreats,
      analysis: {
        riskLevel: similarThreats.length > 5 ? 'high' : similarThreats.length > 2 ? 'medium' : 'low',
        confidence: Math.min(similarThreats.length / 10, 1.0)
      },
      timestamp: new Date()
    };
  }
}

// Choose the storage implementation based on environment
// Use in-memory storage temporarily due to database endpoint being disabled
export const storage = new MemStorage();