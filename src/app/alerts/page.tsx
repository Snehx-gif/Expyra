"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Bell,
  Filter,
  Clock,
  Package,
  Calendar,
  Plus
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface AlertData {
  id: string;
  type: 'NEAR_EXPIRY' | 'DONATION_READY' | 'EXPIRED' | 'LOW_STOCK';
  title: string;
  message: string;
  status: 'ACTIVE' | 'RESOLVED' | 'DISMISSED';
  productId?: string;
  batchId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  product?: {
    id: string;
    name: string;
    category: string;
    sku?: string;
  };
  batch?: {
    id: string;
    batchId: string;
    expiryDate: string;
    currentQuantity: number;
  };
}

interface SocketAlert {
  id: string;
  type: 'NEAR_EXPIRY' | 'DONATION_READY' | 'EXPIRED' | 'LOW_STOCK';
  title: string;
  message: string;
  productId?: string;
  batchId?: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ACTIVE");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeAlerts, setRealTimeAlerts] = useState<SocketAlert[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetchAlerts();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentPage, selectedType, selectedStatus]);

  const setupSocket = () => {
    try {
      const newSocket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000', {
        path: '/api/socketio',
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to alert system');
        toast.success('Connected to real-time alert system');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from alert system');
        toast.error('Disconnected from real-time alert system');
      });

      newSocket.on('new_alert', (alert: SocketAlert) => {
        setRealTimeAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10
        toast.error(`New Alert: ${alert.title}`, {
          description: alert.message,
        });
        fetchAlerts(); // Refresh alerts list
      });

      newSocket.on('alert_resolved', (alertId: string) => {
        toast.success(`Alert resolved: ${alertId}`);
        fetchAlerts(); // Refresh alerts list
      });

      newSocket.on('alert_dismissed', (alertId: string) => {
        toast.info(`Alert dismissed: ${alertId}`);
        fetchAlerts(); // Refresh alerts list
      });

      newSocket.on('expiry_check_completed', (data: any) => {
        if (data.newAlerts > 0) {
          toast.warning(`Expiry check completed: ${data.newAlerts} new alerts found`);
          fetchAlerts(); // Refresh alerts list
        }
      });

    } catch (error) {
      console.error('Failed to setup socket:', error);
      toast.error('Failed to connect to real-time alert system');
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockAlerts: AlertData[] = [
      {
        id: "1",
        type: "NEAR_EXPIRY",
        title: "Milk Batch #1234",
        message: "Expires in 2 days - Consider discount",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
          id: "prod-1",
          name: "Fresh Milk",
          category: "Dairy",
          sku: "FM-123",
        },
        batch: {
          id: "batch-1",
          batchId: "1234",
          expiryDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          currentQuantity: 50,
        }
      },
      {
        id: "2",
        type: "DONATION_READY",
        title: "Bread Batch #5678",
        message: "Ready for donation to local food bank",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
          id: "prod-2",
          name: "Whole Wheat Bread",
          category: "Bakery",
          sku: "WWB-567",
        },
        batch: {
          id: "batch-2",
          batchId: "5678",
          expiryDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          currentQuantity: 20,
        }
      },
      {
        id: "3",
        type: "EXPIRED",
        title: "Yogurt Batch #9012",
        message: "Expired - Remove from inventory",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
          id: "prod-3",
          name: "Greek Yogurt",
          category: "Dairy",
          sku: "GY-901",
        },
        batch: {
          id: "batch-3",
          batchId: "9012",
          expiryDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          currentQuantity: 10,
        }
      },
      {
        id: "4",
        type: "LOW_STOCK",
        title: "Chicken Breast",
        message: "Stock is low, reorder soon",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
          id: "prod-4",
          name: "Chicken Breast",
          category: "Meat & Poultry",
          sku: "CB-001",
        },
      }
    ];

    setAlerts(mockAlerts);
    setTotalPages(1);
    setLoading(false);
    toast.success("Mock alerts loaded successfully");
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'RESOLVED' }),
      });

      if (!response.ok) throw new Error("Failed to resolve alert");

      // Emit socket event
      if (socketRef.current) {
        socketRef.current.emit('resolve_alert', alertId);
      }

      toast.success("Alert resolved successfully");
      fetchAlerts();
    } catch (error) {
      toast.error("Failed to resolve alert");
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'DISMISSED' }),
      });

      if (!response.ok) throw new Error("Failed to dismiss alert");

      // Emit socket event
      if (socketRef.current) {
        socketRef.current.emit('dismiss_alert', alertId);
      }

      toast.success("Alert dismissed successfully");
      fetchAlerts();
    } catch (error) {
      toast.error("Failed to dismiss alert");
    }
  };

  const handleCheckExpiry = () => {
    if (socketRef.current) {
      socketRef.current.emit('check_expiry');
      toast.info("Expiry check started...");
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'NEAR_EXPIRY':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'DONATION_READY':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'LOW_STOCK':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'EXPIRED':
        return 'destructive';
      case 'NEAR_EXPIRY':
        return 'secondary';
      case 'DONATION_READY':
        return 'default';
      case 'LOW_STOCK':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'destructive';
      case 'RESOLVED':
        return 'default';
      case 'DISMISSED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and manage real-time expiry alerts and notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCheckExpiry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Expiry
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Alert className={isConnected ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
        <Bell className="h-4 w-4" />
        <AlertDescription>
          {isConnected
            ? "Connected to real-time alert system"
            : "Disconnected from real-time alert system"
          }
        </AlertDescription>
      </Alert>

      {/* Real-time Alerts */}
      {realTimeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Real-time Alerts
            </CardTitle>
            <CardDescription>
              Latest alerts from the real-time system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {realTimeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-muted-foreground">{alert.message}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getAlertBadgeColor(alert.type) as any}>
                      {alert.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-48">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All types</SelectItem>
                  <SelectItem value="NEAR_EXPIRY">Near Expiry</SelectItem>
                  <SelectItem value="DONATION_READY">Donation Ready</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                  <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="DISMISSED">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Management</CardTitle>
          <CardDescription>
            View and manage all system alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading alerts...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getAlertIcon(alert.type)}
                          <Badge variant={getAlertBadgeColor(alert.type) as any}>
                            {alert.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{alert.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{alert.message}</div>
                      </TableCell>
                      <TableCell>
                        {alert.product ? (
                          <div>
                            <div className="font-medium">{alert.product.name}</div>
                            {alert.product.sku && (
                              <div className="text-sm text-muted-foreground">
                                SKU: {alert.product.sku}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeColor(alert.status) as any}>
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(alert.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {alert.status === 'ACTIVE' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResolveAlert(alert.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDismissAlert(alert.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}