// Emergency Authentication Bypass Middleware
import { Request, Response, NextFunction } from 'express';

export function emergencyAuthBypass(req: Request, res: Response, next: NextFunction) {
  // Check for emergency override headers
  const overrideHeader = req.headers['x-emergency-override'] as string;
  const overrideAuthority = req.headers['x-override-authority'] as string;
  
  console.log('[EMERGENCY BYPASS] Checking headers:', {
    override: overrideHeader,
    authority: overrideAuthority,
    path: req.path
  });
  
  if (overrideHeader && overrideAuthority === 'SENTINEL_EMERGENCY_PROTOCOL') {
    console.log('[EMERGENCY BYPASS] Override detected, creating emergency user');
    
    // Create emergency user for override sessions
    req.user = {
      id: 999,
      username: 'Emergency_Admin',
      email: 'override@sentinel.emergency',
      name: 'Emergency Override Active',
      department: 'SENTINEL Command',
      role: 'admin'
    } as Express.User;
    
    console.log('[EMERGENCY BYPASS] Emergency authentication successful');
    return next();
  }
  
  // If no override, continue to normal authentication
  return next();
}

// Alternative simple bypass that just creates an emergency user
export function forceEmergencyAuth(req: Request, res: Response, next: NextFunction) {
  // Just create an emergency user for all requests - ultimate override
  req.user = {
    id: 999,
    username: 'Emergency_Admin',
    email: 'override@sentinel.emergency',
    name: 'Emergency Override Active',
    department: 'SENTINEL Command',
    role: 'admin'
  } as Express.User;
  
  console.log('[FORCE OVERRIDE] Emergency authentication applied');
  return next();
}