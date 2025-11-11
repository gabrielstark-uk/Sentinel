import { spawn, ChildProcess } from 'child_process';
import path from 'path';

export interface SonicTarget {
  frequency: number;
  location: [number, number]; // [latitude, longitude]
  intensity: number;
  threatType: string;
  timestamp: number;
}

export interface SonicDeployment {
  deploymentId: string;
  targetFrequency: number;
  disruptorFrequency: number;
  powerLevel: number;
  modulationType: string;
  effectiveness: number;
  status: string;
  deploymentTime: number;
  location: [number, number];
  threatType: string;
}

export interface SonicAnalysisResult {
  targetFrequency: number;
  optimalDisruptorFrequency: number;
  recommendedPower: number;
  modulationType: string;
  interferencePattern: string;
  bandwidth: number;
  analysisTimestamp: number;
  fallbackMode?: boolean;
}

export interface SonicSystemStatus {
  systemActive: boolean;
  activeDeployments: number;
  weaponSystems: number;
  juliaAvailable: boolean;
  lastDeployment: number | null;
  systemTimestamp: number;
}

class SonicDisruptorIntegration {
  private pythonProcess: ChildProcess | null = null;
  private isInitialized: boolean = false;
  private activeDeployments: Map<string, SonicDeployment> = new Map();

  constructor() {
    this.initializePythonWrapper();
  }

  private async initializePythonWrapper(): Promise<void> {
    try {
      console.log('[SONIC INTEGRATION] Initializing Python wrapper for Julia sonic disruptor...');

      // Test Python availability
      const testResult = await this.executePythonScript(`
import sys
import subprocess
print("PYTHON_WRAPPER_READY")
print(f"Python version: {sys.version}")
`);

      if (testResult.includes('PYTHON_WRAPPER_READY')) {
        this.isInitialized = true;
        console.log('[SONIC INTEGRATION] Python wrapper initialized successfully');
      } else {
        console.log('[SONIC INTEGRATION] Python wrapper initialization failed');
      }
    } catch (error) {
      console.error('[SONIC INTEGRATION] Error initializing Python wrapper:', error);
    }
  }

  private async executePythonScript(script: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', ['-c', script], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Python script failed with code ${code}: ${errorOutput}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(error);
      });

      // Set timeout
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Python script execution timeout'));
      }, 30000); // 30 second timeout
    });
  }

  async createWeaponSystem(weaponId: string, baseFrequency: number = 1000, powerLevel: number = 0.8): Promise<any> {
    try {
      console.log(`[SONIC INTEGRATION] Creating weapon system: ${weaponId}`);

      const pythonScript = `
import sys
sys.path.append('server')
from sonicDisruptorController import sonic_disruptor_controller
import json

result = sonic_disruptor_controller.create_weapon_system("${weaponId}", ${baseFrequency}, ${powerLevel})
print(json.dumps(result))
`;

      const output = await this.executePythonScript(pythonScript);
      const result = JSON.parse(output);

      console.log(`[SONIC INTEGRATION] Weapon system ${weaponId} created successfully`);
      return result;
    } catch (error) {
      console.error(`[SONIC INTEGRATION] Error creating weapon system: ${error}`);
      return this.createFallbackWeaponSystem(weaponId, baseFrequency, powerLevel);
    }
  }

  async deploySonicCountermeasure(target: SonicTarget, powerOverride?: number): Promise<SonicDeployment> {
    try {
      console.log(`[SONIC INTEGRATION] DEPLOYING SONIC COUNTERMEASURE: ${target.frequency}Hz`);

      const pythonScript = `
import sys
sys.path.append('server')
from sonicDisruptorController import sonic_disruptor_controller
import json

deployment = sonic_disruptor_controller.deploy_sonic_countermeasure(
    ${target.frequency}, 
    (${target.location[0]}, ${target.location[1]}),
    "${target.threatType}",
    ${powerOverride || 'None'}
)

result = {
    "target_frequency": deployment.target_frequency,
    "disruptor_frequency": deployment.disruptor_frequency,
    "power_level": deployment.power_level,
    "modulation_type": deployment.modulation_type,
    "effectiveness": deployment.effectiveness,
    "status": deployment.status,
    "deployment_time": deployment.deployment_time
}

print(json.dumps(result))
`;

      const output = await this.executePythonScript(pythonScript);
      const deploymentData = JSON.parse(output);

      const deployment: SonicDeployment = {
        deploymentId: `sonic_${target.frequency}_${Date.now()}`,
        targetFrequency: deploymentData.target_frequency,
        disruptorFrequency: deploymentData.disruptor_frequency,
        powerLevel: deploymentData.power_level,
        modulationType: deploymentData.modulation_type,
        effectiveness: deploymentData.effectiveness,
        status: deploymentData.status,
        deploymentTime: deploymentData.deployment_time,
        location: target.location,
        threatType: target.threatType
      };

      this.activeDeployments.set(deployment.deploymentId, deployment);

      console.log(`[SONIC INTEGRATION] Countermeasure deployed with ${deployment.effectiveness}% effectiveness`);
      return deployment;
    } catch (error) {
      console.error(`[SONIC INTEGRATION] Error deploying countermeasure: ${error}`);
      return this.deployFallbackCountermeasure(target, powerOverride);
    }
  }

  async analyzeTargetFrequency(frequency: number, bandwidth: number = 200): Promise<SonicAnalysisResult> {
    try {
      const pythonScript = `
import sys
sys.path.append('server')
from sonicDisruptorController import sonic_disruptor_controller
import json

analysis = sonic_disruptor_controller.analyze_target_frequency(${frequency}, ${bandwidth})
print(json.dumps(analysis))
`;

      const output = await this.executePythonScript(pythonScript);
      const result = JSON.parse(output);

      return {
        targetFrequency: result.target_frequency,
        optimalDisruptorFrequency: result.optimal_disruptor_frequency,
        recommendedPower: result.recommended_power,
        modulationType: result.modulation_type,
        interferencePattern: result.interference_pattern,
        bandwidth: result.bandwidth,
        analysisTimestamp: result.analysis_timestamp,
        fallbackMode: result.fallback_mode || false
      };
    } catch (error) {
      console.error(`[SONIC INTEGRATION] Error analyzing frequency: ${error}`);
      return this.analyzeFallback(frequency, bandwidth);
    }
  }

  async getActiveDeployments(): Promise<SonicDeployment[]> {
    try {
      const pythonScript = `
import sys
sys.path.append('server')
from sonicDisruptorController import sonic_disruptor_controller
import json

deployments = sonic_disruptor_controller.get_active_deployments()
print(json.dumps(deployments))
`;

      const output = await this.executePythonScript(pythonScript);
      const deployments = JSON.parse(output);

      // Convert to our format
      return deployments.map((d: any) => ({
        deploymentId: d.deployment_id,
        targetFrequency: d.target_frequency,
        disruptorFrequency: d.disruptor_frequency,
        powerLevel: d.power_level,
        modulationType: d.modulation_type,
        effectiveness: d.effectiveness,
        status: d.status,
        deploymentTime: d.deployment_time,
        location: [0, 0], // Default location
        threatType: 'unknown'
      }));
    } catch (error) {
      console.error(`[SONIC INTEGRATION] Error getting deployments: ${error}`);
      return Array.from(this.activeDeployments.values());
    }
  }

  async deactivateCountermeasure(deploymentId: string): Promise<boolean> {
    try {
      const pythonScript = `
import sys
sys.path.append('server')
from sonicDisruptorController import sonic_disruptor_controller

result = sonic_disruptor_controller.deactivate_countermeasure("${deploymentId}")
print("SUCCESS" if result else "FAILED")
`;

      const output = await this.executePythonScript(pythonScript);
      const success = output.includes('SUCCESS');

      if (success) {
        this.activeDeployments.delete(deploymentId);
        console.log(`[SONIC INTEGRATION] Deactivated countermeasure: ${deploymentId}`);
      }

      return success;
    } catch (error) {
      console.error(`[SONIC INTEGRATION] Error deactivating countermeasure: ${error}`);
      return false;
    }
  }

  async emergencyStopAll(): Promise<boolean> {
    try {
      const pythonScript = `
import sys
sys.path.append('server')
from sonicDisruptorController import sonic_disruptor_controller

result = sonic_disruptor_controller.emergency_stop_all()
print("SUCCESS" if result else "FAILED")
`;

      const output = await this.executePythonScript(pythonScript);
      const success = output.includes('SUCCESS');

      if (success) {
        this.activeDeployments.clear();
        console.log('[SONIC INTEGRATION] EMERGENCY STOP: All countermeasures deactivated');
      }

      return success;
    } catch (error) {
      console.error('[SONIC INTEGRATION] Error during emergency stop:', error);
      return false;
    }
  }

  async getSystemStatus(): Promise<SonicSystemStatus> {
    try {
      const pythonScript = `
import sys
sys.path.append('server')
from sonicDisruptorController import sonic_disruptor_controller
import json

status = sonic_disruptor_controller.get_system_status()
print(json.dumps(status))
`;

      const output = await this.executePythonScript(pythonScript);
      const status = JSON.parse(output);

      return {
        systemActive: status.system_active,
        activeDeployments: status.active_deployments,
        weaponSystems: status.weapon_systems,
        juliaAvailable: status.julia_available,
        lastDeployment: status.last_deployment,
        systemTimestamp: status.system_timestamp
      };
    } catch (error) {
      console.error('[SONIC INTEGRATION] Error getting system status:', error);
      return this.getFallbackStatus();
    }
  }

  // Fallback implementations
  private createFallbackWeaponSystem(weaponId: string, baseFrequency: number, powerLevel: number): any {
    return {
      weapon_id: weaponId,
      base_frequency: baseFrequency,
      power_level: powerLevel,
      status: 'initialized_fallback',
      timestamp: Date.now() / 1000
    };
  }

  private deployFallbackCountermeasure(target: SonicTarget, powerOverride?: number): SonicDeployment {
    const power = powerOverride || 0.8;
    const disruptorFreq = target.frequency + (target.frequency * 0.05);
    const effectiveness = Math.min(power * 85, 95);

    const deployment: SonicDeployment = {
      deploymentId: `sonic_fallback_${target.frequency}_${Date.now()}`,
      targetFrequency: target.frequency,
      disruptorFrequency: disruptorFreq,
      powerLevel: power,
      modulationType: 'frequency',
      effectiveness,
      status: 'deployed_fallback',
      deploymentTime: Date.now() / 1000,
      location: target.location,
      threatType: target.threatType
    };

    this.activeDeployments.set(deployment.deploymentId, deployment);
    console.log(`[SONIC INTEGRATION FALLBACK] Countermeasure deployed with ${effectiveness}% effectiveness`);
    return deployment;
  }

  private analyzeFallback(frequency: number, bandwidth: number): SonicAnalysisResult {
    const optimalFreq = frequency + (bandwidth * 0.1);
    const power = frequency < 1000 ? 0.9 : frequency < 10000 ? 0.7 : 0.5;
    const modulation = frequency < 500 ? 'amplitude' : frequency < 5000 ? 'frequency' : 'chaos';

    return {
      targetFrequency: frequency,
      optimalDisruptorFrequency: optimalFreq,
      recommendedPower: power,
      modulationType: modulation,
      interferencePattern: 'destructive',
      bandwidth,
      analysisTimestamp: Date.now() / 1000,
      fallbackMode: true
    };
  }

  private getFallbackStatus(): SonicSystemStatus {
    return {
      systemActive: this.isInitialized,
      activeDeployments: this.activeDeployments.size,
      weaponSystems: 0,
      juliaAvailable: false,
      lastDeployment: null,
      systemTimestamp: Date.now() / 1000
    };
  }
}

export const sonicDisruptorIntegration = new SonicDisruptorIntegration();