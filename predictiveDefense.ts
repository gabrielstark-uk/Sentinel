import { AttackPattern } from '@shared/schema';
import { storage } from './storage';

class PredictiveDefense {
  private isAnalyzing: boolean = false;

  async analyzePattern(frequencyData: number[], timestamp: Date): Promise<{
    prediction: string;
    confidence: number;
    suggestedActions: string[];
  }> {
    if (this.isAnalyzing) return {
      prediction: "Analysis already in progress",
      confidence: 0,
      suggestedActions: []
    };

    try {
      this.isAnalyzing = true;
      
      // Analyze frequency patterns
      const patterns = await this.detectPatterns(frequencyData);
      
      // Calculate threat probability
      const confidence = this.calculateThreatProbability(patterns);
      
      // Generate suggested actions
      const actions = this.generateCountermeasures(confidence);

      return {
        prediction: this.generatePrediction(patterns, confidence),
        confidence,
        suggestedActions: actions
      };
    } finally {
      this.isAnalyzing = false;
    }
  }

  private async detectPatterns(frequencies: number[]): Promise<AttackPattern[]> {
    const allPatterns = await storage.getAttackPatterns();
    return allPatterns.filter(pattern => 
      this.matchesPattern(frequencies, pattern.frequencySignature)
    );
  }

  private matchesPattern(frequencies: number[], signature: number[]): boolean {
    return frequencies.some(freq => 
      signature.some(sigFreq => Math.abs(freq - sigFreq) < 10)
    );
  }

  private calculateThreatProbability(patterns: AttackPattern[]): number {
    if (patterns.length === 0) return 0;
    
    return patterns.reduce((acc, pattern) => 
      acc + (pattern.confidence || 0), 0) / patterns.length;
  }

  private generatePrediction(patterns: AttackPattern[], confidence: number): string {
    if (patterns.length === 0) {
      return "No known attack patterns detected";
    }

    return `Potential ${patterns.length} attack pattern(s) detected with ${confidence.toFixed(2)}% confidence`;
  }

  private generateCountermeasures(confidence: number): string[] {
    const actions = [];
    
    if (confidence > 80) {
      actions.push("Activate emergency defense protocols");
      actions.push("Alert law enforcement");
      actions.push("Enable maximum shielding");
    } else if (confidence > 60) {
      actions.push("Increase monitoring sensitivity");
      actions.push("Enable selective frequency blocking");
    } else if (confidence > 40) {
      actions.push("Monitor situation closely");
      actions.push("Prepare defensive measures");
    }
    
    return actions;
  }
}

export const predictiveDefense = new PredictiveDefense();