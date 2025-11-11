#!/usr/bin/env python3
"""
Sonic Sound Gun Disruptor Controller
Python wrapper for Julia-based sonic disruption system
"""

import subprocess
import json
import time
import numpy as np
from typing import Dict, List, Optional, Tuple
import tempfile
import os
import threading
from dataclasses import dataclass

@dataclass
class DisruptorTarget:
    frequency: float
    location: Tuple[float, float]  # (latitude, longitude)
    intensity: float
    threat_type: str
    timestamp: float

@dataclass
class DisruptorDeployment:
    target_frequency: float
    disruptor_frequency: float
    power_level: float
    modulation_type: str
    effectiveness: float
    status: str
    deployment_time: float
    signal_data: Optional[List[float]] = None

class SonicDisruptorController:
    """Python controller for Julia-based sonic disruptor system"""
    
    def __init__(self):
        self.julia_script_path = "backend-julia/src/SonicDisruptor.jl"
        self.active_deployments: Dict[str, DisruptorDeployment] = {}
        self.julia_process = None
        self.is_active = False
        self.weapon_systems = {}
        
        # Initialize Julia environment
        self._initialize_julia_environment()
    
    def _initialize_julia_environment(self) -> bool:
        """Initialize Julia environment and test basic functionality"""
        try:
            print("[PYTHON WRAPPER] Initializing Julia sonic disruptor environment...")
            
            # Test Julia availability
            result = subprocess.run(['julia', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode != 0:
                print("[PYTHON WRAPPER] WARNING: Julia not available, using Python fallback")
                return False
            
            print(f"[PYTHON WRAPPER] Julia detected: {result.stdout.strip()}")
            
            # Test Julia script loading
            test_script = '''
            push!(LOAD_PATH, "backend-julia/src")
            try
                using SonicDisruptor
                println("JULIA_INIT_SUCCESS")
            catch e
                println("JULIA_INIT_ERROR: ", e)
            end
            '''
            
            result = subprocess.run(['julia', '-e', test_script],
                                  capture_output=True, text=True, timeout=15)
            
            if "JULIA_INIT_SUCCESS" in result.stdout:
                print("[PYTHON WRAPPER] Julia SonicDisruptor module loaded successfully")
                return True
            else:
                print(f"[PYTHON WRAPPER] Julia initialization failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"[PYTHON WRAPPER] Julia initialization error: {e}")
            return False
    
    def create_weapon_system(self, weapon_id: str, base_frequency: float = 1000.0, 
                           power_level: float = 0.8) -> Dict[str, any]:
        """Create a new sonic weapon system"""
        try:
            julia_script = f'''
            push!(LOAD_PATH, "backend-julia/src")
            using SonicDisruptor
            using JSON
            
            weapon = create_sonic_weapon({base_frequency}, {power_level})
            
            result = Dict(
                "weapon_id" => "{weapon_id}",
                "base_frequency" => {base_frequency},
                "power_level" => {power_level},
                "status" => "initialized",
                "timestamp" => time()
            )
            
            println(JSON.json(result))
            '''
            
            result = subprocess.run(['julia', '-e', julia_script],
                                  capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0 and result.stdout.strip():
                weapon_data = json.loads(result.stdout.strip())
                self.weapon_systems[weapon_id] = weapon_data
                print(f"[PYTHON WRAPPER] Weapon system {weapon_id} created")
                return weapon_data
            else:
                # Fallback to Python implementation
                return self._create_python_weapon_fallback(weapon_id, base_frequency, power_level)
                
        except Exception as e:
            print(f"[PYTHON WRAPPER] Error creating weapon system: {e}")
            return self._create_python_weapon_fallback(weapon_id, base_frequency, power_level)
    
    def deploy_sonic_countermeasure(self, target_frequency: float, 
                                  location: Tuple[float, float],
                                  threat_type: str = "unknown",
                                  power_override: Optional[float] = None) -> DisruptorDeployment:
        """Deploy sonic countermeasure against target frequency"""
        try:
            print(f"[PYTHON WRAPPER] DEPLOYING SONIC COUNTERMEASURE: {target_frequency}Hz")
            
            # Use power override if provided
            power_level = power_override if power_override else 0.8
            
            julia_script = f'''
            push!(LOAD_PATH, "backend-julia/src")
            using SonicDisruptor
            using JSON
            
            # Create weapon for this deployment
            weapon = create_sonic_weapon({target_frequency}, {power_level})
            
            # Deploy countermeasure
            deployment_result = deploy_countermeasure(weapon, {target_frequency})
            
            # Add location and threat info
            deployment_result["location"] = [{location[0]}, {location[1]}]
            deployment_result["threat_type"] = "{threat_type}"
            deployment_result["python_timestamp"] = time()
            
            println(JSON.json(deployment_result))
            '''
            
            result = subprocess.run(['julia', '-e', julia_script],
                                  capture_output=True, text=True, timeout=15)
            
            if result.returncode == 0 and result.stdout.strip():
                deployment_data = json.loads(result.stdout.strip())
                
                deployment = DisruptorDeployment(
                    target_frequency=deployment_data["target_frequency"],
                    disruptor_frequency=deployment_data["disruptor_frequency"],
                    power_level=deployment_data["power_level"],
                    modulation_type=deployment_data["modulation"],
                    effectiveness=deployment_data["effectiveness"],
                    status=deployment_data["status"],
                    deployment_time=deployment_data["deployment_time"]
                )
                
                # Store deployment
                deployment_key = f"{target_frequency}_{int(time.time())}"
                self.active_deployments[deployment_key] = deployment
                
                print(f"[PYTHON WRAPPER] Countermeasure deployed with {deployment.effectiveness}% effectiveness")
                return deployment
            else:
                # Fallback to Python implementation
                return self._deploy_python_fallback(target_frequency, location, threat_type, power_level)
                
        except Exception as e:
            print(f"[PYTHON WRAPPER] Error deploying countermeasure: {e}")
            return self._deploy_python_fallback(target_frequency, location, threat_type, power_level or 0.8)
    
    def analyze_target_frequency(self, target_frequency: float, 
                               bandwidth: float = 200.0) -> Dict[str, any]:
        """Analyze target frequency and return optimal disruption parameters"""
        try:
            julia_script = f'''
            push!(LOAD_PATH, "backend-julia/src")
            using SonicDisruptor
            using JSON
            
            config = analyze_target_frequency({target_frequency}, {bandwidth})
            
            result = Dict(
                "target_frequency" => {target_frequency},
                "optimal_disruptor_frequency" => config.base_frequency,
                "recommended_power" => config.power_level,
                "modulation_type" => config.modulation_type,
                "interference_pattern" => config.interference_pattern,
                "bandwidth" => config.target_bandwidth,
                "analysis_timestamp" => time()
            )
            
            println(JSON.json(result))
            '''
            
            result = subprocess.run(['julia', '-e', julia_script],
                                  capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0 and result.stdout.strip():
                return json.loads(result.stdout.strip())
            else:
                return self._analyze_python_fallback(target_frequency, bandwidth)
                
        except Exception as e:
            print(f"[PYTHON WRAPPER] Error analyzing frequency: {e}")
            return self._analyze_python_fallback(target_frequency, bandwidth)
    
    def get_active_deployments(self) -> List[Dict[str, any]]:
        """Get list of all active sonic countermeasure deployments"""
        deployments = []
        for key, deployment in self.active_deployments.items():
            deployments.append({
                "deployment_id": key,
                "target_frequency": deployment.target_frequency,
                "disruptor_frequency": deployment.disruptor_frequency,
                "power_level": deployment.power_level,
                "modulation_type": deployment.modulation_type,
                "effectiveness": deployment.effectiveness,
                "status": deployment.status,
                "deployment_time": deployment.deployment_time,
                "duration": time.time() - deployment.deployment_time
            })
        return deployments
    
    def deactivate_countermeasure(self, deployment_id: str) -> bool:
        """Deactivate specific sonic countermeasure"""
        if deployment_id in self.active_deployments:
            del self.active_deployments[deployment_id]
            print(f"[PYTHON WRAPPER] Deactivated countermeasure: {deployment_id}")
            return True
        return False
    
    def emergency_stop_all(self) -> bool:
        """Emergency stop all sonic countermeasures"""
        try:
            self.active_deployments.clear()
            self.weapon_systems.clear()
            print("[PYTHON WRAPPER] EMERGENCY STOP: All sonic countermeasures deactivated")
            return True
        except Exception as e:
            print(f"[PYTHON WRAPPER] Error during emergency stop: {e}")
            return False
    
    def get_system_status(self) -> Dict[str, any]:
        """Get overall system status"""
        return {
            "system_active": self.is_active,
            "active_deployments": len(self.active_deployments),
            "weapon_systems": len(self.weapon_systems),
            "julia_available": self._test_julia_availability(),
            "last_deployment": max([d.deployment_time for d in self.active_deployments.values()]) if self.active_deployments else None,
            "system_timestamp": time.time()
        }
    
    # Python fallback implementations
    def _create_python_weapon_fallback(self, weapon_id: str, base_frequency: float, power_level: float) -> Dict[str, any]:
        """Python fallback for weapon creation"""
        weapon_data = {
            "weapon_id": weapon_id,
            "base_frequency": base_frequency,
            "power_level": power_level,
            "status": "initialized_python_fallback",
            "timestamp": time.time()
        }
        self.weapon_systems[weapon_id] = weapon_data
        print(f"[PYTHON FALLBACK] Weapon system {weapon_id} created")
        return weapon_data
    
    def _deploy_python_fallback(self, target_frequency: float, location: Tuple[float, float], 
                              threat_type: str, power_level: float) -> DisruptorDeployment:
        """Python fallback for countermeasure deployment"""
        # Calculate basic disruption parameters
        disruptor_frequency = target_frequency + (target_frequency * 0.05)  # 5% offset
        effectiveness = min(power_level * 85, 95)  # Simulate effectiveness
        
        deployment = DisruptorDeployment(
            target_frequency=target_frequency,
            disruptor_frequency=disruptor_frequency,
            power_level=power_level,
            modulation_type="frequency",
            effectiveness=effectiveness,
            status="deployed_python_fallback",
            deployment_time=time.time()
        )
        
        deployment_key = f"{target_frequency}_{int(time.time())}"
        self.active_deployments[deployment_key] = deployment
        
        print(f"[PYTHON FALLBACK] Countermeasure deployed with {effectiveness}% effectiveness")
        return deployment
    
    def _analyze_python_fallback(self, target_frequency: float, bandwidth: float) -> Dict[str, any]:
        """Python fallback for frequency analysis"""
        # Basic analysis logic
        optimal_freq = target_frequency + (bandwidth * 0.1)
        power = 0.9 if target_frequency < 1000 else 0.7 if target_frequency < 10000 else 0.5
        modulation = "amplitude" if target_frequency < 500 else "frequency" if target_frequency < 5000 else "chaos"
        
        return {
            "target_frequency": target_frequency,
            "optimal_disruptor_frequency": optimal_freq,
            "recommended_power": power,
            "modulation_type": modulation,
            "interference_pattern": "destructive",
            "bandwidth": bandwidth,
            "analysis_timestamp": time.time(),
            "fallback_mode": True
        }
    
    def _test_julia_availability(self) -> bool:
        """Test if Julia is available"""
        try:
            result = subprocess.run(['julia', '--version'], 
                                  capture_output=True, text=True, timeout=5)
            return result.returncode == 0
        except:
            return False

# Global instance
sonic_disruptor_controller = SonicDisruptorController()