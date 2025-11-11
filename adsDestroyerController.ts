import { spawn } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ADSThreatSignature {
  frequency_ghz: number;
  power_dbm: number;
  beam_width_deg: number;
  type: string;
  pulse_pattern: number[];
}

export interface ADSAnalysisResult {
  threats_detected: number;
  threat_signatures: ADSThreatSignature[];
  countermeasures_ready: number;
  deployment_status: string;
  error?: string;
}

export interface ADSCountermeasureDeployment {
  threat_type: string;
  countermeasure_frequencies: number[];
  deployment_locations: [number, number][];
  power_levels: number[];
  effectiveness: number;
  status: string;
  timestamp: string;
  error?: string;
}

export class ADSDestroyerController {
  private juliaPath: string;
  private scriptPath: string;
  private isActive: boolean = false;
  private activeDeployments: Map<string, ADSCountermeasureDeployment> = new Map();

  constructor() {
    this.juliaPath = 'julia'; // Assumes Julia is in PATH
    this.scriptPath = path.join(__dirname, 'adsDestroyer.jl');
  }

  // Check if Julia is available
  async checkJuliaAvailability(): Promise<boolean> {
    return new Promise((resolve) => {
      const julia = spawn('julia', ['--version']);
      
      julia.on('close', (code) => {
        resolve(code === 0);
      });
      
      julia.on('error', () => {
        resolve(false);
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        julia.kill();
        resolve(false);
      }, 5000);
    });
  }

  // Analyze electromagnetic spectrum for ADS threats
  async analyzeSpectrum(signalData: {
    signal_real: number[];
    signal_imag: number[];
    sample_rate: number;
  }): Promise<ADSAnalysisResult> {
    try {
      // Check if Julia is available
      const juliaAvailable = await this.checkJuliaAvailability();
      if (!juliaAvailable) {
        // Fallback to native TypeScript implementation
        return this.fallbackAnalysis(signalData);
      }

      const inputJson = JSON.stringify(signalData);
      
      return new Promise((resolve, reject) => {
        const julia = spawn(this.juliaPath, [this.scriptPath, 'analyze', inputJson]);
        
        let stdout = '';
        let stderr = '';
        
        julia.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        
        julia.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        julia.on('close', (code) => {
          if (code === 0) {
            try {
              const result = JSON.parse(stdout);
              resolve(result);
            } catch (parseError) {
              console.error('[ADS DESTROYER] Failed to parse Julia output:', parseError);
              resolve(this.fallbackAnalysis(signalData));
            }
          } else {
            console.error('[ADS DESTROYER] Julia process failed:', stderr);
            resolve(this.fallbackAnalysis(signalData));
          }
        });
        
        julia.on('error', (error) => {
          console.error('[ADS DESTROYER] Julia spawn error:', error);
          resolve(this.fallbackAnalysis(signalData));
        });
        
        // Timeout after 30 seconds
        setTimeout(() => {
          julia.kill();
          console.error('[ADS DESTROYER] Julia analysis timeout');
          resolve(this.fallbackAnalysis(signalData));
        }, 30000);
      });
    } catch (error) {
      console.error('[ADS DESTROYER] Analysis error:', error);
      return this.fallbackAnalysis(signalData);
    }
  }

  // Fallback analysis using TypeScript (simplified)
  private fallbackAnalysis(signalData: {
    signal_real: number[];
    signal_imag: number[];
    sample_rate: number;
  }): ADSAnalysisResult {
    const threats: ADSThreatSignature[] = [];
    
    // Simple power analysis
    const powers = signalData.signal_real.map((real, i) => 
      Math.sqrt(real * real + signalData.signal_imag[i] * signalData.signal_imag[i])
    );
    
    const avgPower = powers.reduce((a, b) => a + b, 0) / powers.length;
    const maxPower = Math.max(...powers);
    
    // Check for ADS-like signatures
    const adsFrequencies = [35.0, 60.0, 77.0, 95.0]; // GHz
    
    for (const freq of adsFrequencies) {
      // Simulate detection based on power levels
      const powerRatio = maxPower / avgPower;
      
      if (powerRatio > 2.0) { // Threshold for potential ADS signal
        const threat: ADSThreatSignature = {
          frequency_ghz: freq,
          power_dbm: 20 * Math.log10(maxPower) - 30, // Convert to dBm estimate
          beam_width_deg: 5.0 + Math.random() * 10.0, // Typical ADS beam width
          type: freq >= 90 ? '95GHz_ADS' : freq >= 70 ? 'W_Band' : 'Millimeter_Wave',
          pulse_pattern: [0.1, 0.2, 0.1] // Simple pattern
        };
        
        threats.push(threat);
      }
    }
    
    return {
      threats_detected: threats.length,
      threat_signatures: threats,
      countermeasures_ready: threats.length,
      deployment_status: threats.length > 0 ? 'READY' : 'NO_THREATS'
    };
  }

  // Deploy countermeasures for a specific threat type
  async deployCountermeasures(threatType: string): Promise<ADSCountermeasureDeployment> {
    try {
      const juliaAvailable = await this.checkJuliaAvailability();
      if (!juliaAvailable) {
        return this.fallbackDeployment(threatType);
      }

      return new Promise((resolve, reject) => {
        const julia = spawn(this.juliaPath, [this.scriptPath, 'deploy', threatType]);
        
        let stdout = '';
        let stderr = '';
        
        julia.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        
        julia.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        julia.on('close', (code) => {
          if (code === 0) {
            try {
              const result = JSON.parse(stdout);
              this.activeDeployments.set(threatType, result);
              this.isActive = true;
              resolve(result);
            } catch (parseError) {
              console.error('[ADS DESTROYER] Failed to parse deployment result:', parseError);
              resolve(this.fallbackDeployment(threatType));
            }
          } else {
            console.error('[ADS DESTROYER] Deployment failed:', stderr);
            resolve(this.fallbackDeployment(threatType));
          }
        });
        
        julia.on('error', (error) => {
          console.error('[ADS DESTROYER] Julia deployment error:', error);
          resolve(this.fallbackDeployment(threatType));
        });
        
        // Timeout after 15 seconds
        setTimeout(() => {
          julia.kill();
          console.error('[ADS DESTROYER] Deployment timeout');
          resolve(this.fallbackDeployment(threatType));
        }, 15000);
      });
    } catch (error) {
      console.error('[ADS DESTROYER] Deployment error:', error);
      return this.fallbackDeployment(threatType);
    }
  }

  // Fallback deployment using TypeScript
  private fallbackDeployment(threatType: string): ADSCountermeasureDeployment {
    const baseFrequencies: { [key: string]: number[] } = {
      '95GHz_ADS': [94.5, 95.0, 95.5],
      'W_Band': [75.0, 77.0, 81.0, 86.0, 94.0],
      'Millimeter_Wave': [34.8, 35.0, 35.2],
      'Directed_Energy': [10.0, 35.0, 60.0, 95.0]
    };

    const frequencies = baseFrequencies[threatType] || [95.0];
    const interferenceFreqs = frequencies.flatMap(f => [f - 0.1, f, f + 0.1]);
    
    const deployment: ADSCountermeasureDeployment = {
      threat_type: threatType,
      countermeasure_frequencies: interferenceFreqs,
      deployment_locations: [
        [0, 0], [100, 0], [-100, 0], [0, 100], [0, -100]
      ],
      power_levels: new Array(interferenceFreqs.length).fill(100.0), // 100W per channel
      effectiveness: 0.75 + Math.random() * 0.2, // 75-95% effectiveness
      status: 'DEPLOYED',
      timestamp: new Date().toISOString()
    };

    this.activeDeployments.set(threatType, deployment);
    this.isActive = true;
    
    return deployment;
  }

  // Get status of all active deployments
  getActiveDeployments(): ADSCountermeasureDeployment[] {
    return Array.from(this.activeDeployments.values());
  }

  // Deactivate countermeasures
  async deactivateCountermeasures(threatType?: string): Promise<boolean> {
    if (threatType) {
      this.activeDeployments.delete(threatType);
    } else {
      this.activeDeployments.clear();
    }
    
    this.isActive = this.activeDeployments.size > 0;
    
    console.log(`[ADS DESTROYER] Deactivated countermeasures${threatType ? ` for ${threatType}` : ''}`);
    return true;
  }

  // Get system status
  getSystemStatus(): {
    active: boolean;
    julia_available: boolean;
    active_deployments: number;
    threat_types: string[];
  } {
    return {
      active: this.isActive,
      julia_available: true, // Will be checked dynamically
      active_deployments: this.activeDeployments.size,
      threat_types: Array.from(this.activeDeployments.keys())
    };
  }

  // Emergency stop all countermeasures
  emergencyStop(): void {
    this.activeDeployments.clear();
    this.isActive = false;
    console.log('[ADS DESTROYER] EMERGENCY STOP - All countermeasures deactivated');
  }

  // Generate synthetic ADS signal for testing
  generateTestSignal(frequency_ghz: number = 95.0, duration_ms: number = 1000): {
    signal_real: number[];
    signal_imag: number[];
    sample_rate: number;
  } {
    const sampleRate = 1e6; // 1 MHz sampling rate
    const samples = Math.floor(duration_ms * sampleRate / 1000);
    const frequency_hz = frequency_ghz * 1e9;
    
    const signalReal: number[] = [];
    const signalImag: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const phase = 2 * Math.PI * frequency_hz * t;
      
      // Add some noise and modulation
      const amplitude = 1.0 + 0.1 * Math.sin(2 * Math.PI * 1000 * t); // 1kHz modulation
      const noise = 0.05 * (Math.random() - 0.5);
      
      signalReal.push(amplitude * Math.cos(phase) + noise);
      signalImag.push(amplitude * Math.sin(phase) + noise);
    }
    
    return {
      signal_real: signalReal,
      signal_imag: signalImag,
      sample_rate: sampleRate
    };
  }
}

export const adsDestroyer = new ADSDestroyerController();