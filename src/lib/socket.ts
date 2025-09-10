import { Server } from 'socket.io';

// Alert types
export interface AlertEvent {
  id: string;
  type: 'NEAR_EXPIRY' | 'DONATION_READY' | 'EXPIRED' | 'LOW_STOCK';
  title: string;
  message: string;
  productId?: string;
  batchId?: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join alerts room for real-time notifications
    socket.join('alerts');
    
    // Handle alert creation
    socket.on('create_alert', (alert: AlertEvent) => {
      // Broadcast to all clients in alerts room
      io.to('alerts').emit('new_alert', alert);
      console.log('New alert broadcasted:', alert);
    });

    // Handle alert resolution
    socket.on('resolve_alert', (alertId: string) => {
      // Broadcast to all clients in alerts room
      io.to('alerts').emit('alert_resolved', alertId);
      console.log('Alert resolved:', alertId);
    });

    // Handle alert dismissal
    socket.on('dismiss_alert', (alertId: string) => {
      // Broadcast to all clients in alerts room
      io.to('alerts').emit('alert_dismissed', alertId);
      console.log('Alert dismissed:', alertId);
    });

    // Handle expiry check requests
    socket.on('check_expiry', async () => {
      try {
        // This would trigger expiry check logic
        // For now, we'll just acknowledge the request
        socket.emit('expiry_check_started', { timestamp: new Date().toISOString() });
        
        // Simulate expiry check completion
        setTimeout(() => {
          socket.emit('expiry_check_completed', { 
            timestamp: new Date().toISOString(),
            newAlerts: Math.floor(Math.random() * 5) // Mock new alerts count
          });
        }, 2000);
      } catch (error) {
        socket.emit('expiry_check_error', { 
          error: 'Failed to check expiry',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle manual alert creation
    socket.on('manual_alert', (data: { type: string; title: string; message: string }) => {
      const alert: AlertEvent = {
        id: `manual_${Date.now()}`,
        type: data.type as any,
        title: data.title,
        message: data.message,
        severity: data.type === 'EXPIRED' ? 'error' : data.type === 'NEAR_EXPIRY' ? 'warning' : 'info',
        timestamp: new Date().toISOString()
      };
      
      // Broadcast to all clients
      io.to('alerts').emit('new_alert', alert);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      socket.leave('alerts');
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to Expyra Alert System',
      timestamp: new Date().toISOString(),
    });

    // Send existing alerts count (in real implementation, this would fetch from database)
    socket.emit('alerts_status', {
      activeAlerts: Math.floor(Math.random() * 20) + 5,
      lastCheck: new Date().toISOString()
    });
  });
};