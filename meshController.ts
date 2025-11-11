
import { WebSocket } from 'ws';
import { MeshDevice } from '@shared/schema';
import { storage } from './storage';

class MeshController {
  private devices: Map<string, WebSocket> = new Map();
  
  registerDevice(deviceId: string, ws: WebSocket) {
    this.devices.set(deviceId, ws);
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch(data.type) {
          case 'THREAT_DETECTED':
            await this.broadcastThreat(deviceId, data.threat);
            break;
          case 'SYNC_REQUEST':
            await this.syncDeviceData(deviceId);
            break;
          case 'TRIANGULATION_DATA':
            await this.processTriangulationData(deviceId, data.coordinates);
            break;
        }
      } catch (error) {
        console.error('Error processing mesh message:', error);
      }
    });
  }

  private async broadcastThreat(sourceId: string, threat: any) {
    const message = JSON.stringify({
      type: 'THREAT_ALERT',
      sourceDevice: sourceId,
      threat
    });

    this.devices.forEach((ws, deviceId) => {
      if (deviceId !== sourceId && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  private async syncDeviceData(deviceId: string) {
    const device = await storage.getMeshDevice(parseInt(deviceId));
    if (device && this.devices.has(deviceId)) {
      const ws = this.devices.get(deviceId)!;
      ws.send(JSON.stringify({
        type: 'SYNC_DATA',
        data: device
      }));
    }
  }

  private async processTriangulationData(deviceId: string, coordinates: any) {
    await storage.updateMeshDevice(parseInt(deviceId), {
      coordinates: coordinates
    });
  }
}

export const meshController = new MeshController();
