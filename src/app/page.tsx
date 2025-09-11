"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Camera,
  Bell,
  Settings,
  BarChart3,
  ShoppingCart,
  Calendar,
  Users,
  Search,
  Plus,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";
import { useTheme } from "next-themes";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data for demonstration
  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Expiry Alerts",
      value: "23",
      change: "+5%",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Sales Prediction",
      value: "89%",
      change: "+3%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Scanned Today",
      value: "156",
      change: "+18%",
      icon: Camera,
      color: "text-purple-600",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "NEAR_EXPIRY",
      title: "Milk Batch #1234",
      message: "Expires in 2 days - Consider discount",
      time: "2 hours ago",
      severity: "warning",
    },
    {
      id: 2,
      type: "DONATION_READY",
      title: "Bread Batch #5678",
      message: "Ready for donation to local food bank",
      time: "4 hours ago",
      severity: "info",
    },
    {
      id: 3,
      type: "EXPIRED",
      title: "Yogurt Batch #9012",
      message: "Expired - Remove from inventory",
      time: "6 hours ago",
      severity: "error",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const navigationItems = [
    { href: "/products", icon: Package, label: "Products" },
    { href: "/scan", icon: Camera, label: "Scan Product" },
    { href: "/alerts", icon: AlertTriangle, label: "Alerts" },
    { href: "/alerts/analytics", icon: TrendingUp, label: "Analytics" },
    { href: "/prediction", icon: BarChart3, label: "Predictions" },
    { href: "/mock", icon: Settings, label: "Mock Services" },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <nav className="grid gap-2">
          <Button variant="secondary" className="w-full justify-start">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          {navigationItems.map((item) => (
            <Button key={item.href} variant="ghost" className="w-full justify-start" asChild>
              <a href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </a>
            </Button>
          ))}
        </nav>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="hidden md:flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Expyra</span>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {/* Search */}
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button
                variant="outline"
                className="relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
              >
                <Search className="mr-2 h-4 w-4" />
                Search products...
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  ⌘
                </kbd>
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-14 h-[calc(100vh-3.5rem)]">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor your food inventory and expiry alerts
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Camera className="mr-2 h-4 w-4" />
                  Scan Product
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> from last week
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-7">
                  {/* Recent Alerts */}
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Recent Alerts</CardTitle>
                      <CardDescription>
                        Latest expiry and inventory alerts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentAlerts.map((alert) => (
                        <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <div>
                                <div className="font-medium">{alert.title}</div>
                                <div className="text-sm">{alert.message}</div>
                              </div>
                              <div className="text-xs text-muted-foreground whitespace-nowrap">
                                {alert.time}
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>
                        Common tasks and shortcuts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start">
                        <Camera className="mr-2 h-4 w-4" />
                        Scan New Product
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="mr-2 h-4 w-4" />
                        Add Product Manually
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        View All Alerts
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All Alerts</CardTitle>
                    <CardDescription>
                      Manage and respond to system alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAlerts.map((alert) => (
                        <div key={alert.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                          <div className="flex items-start space-x-4">
                            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">{alert.title}</h4>
                              <p className="text-sm text-muted-foreground">{alert.message}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <Badge variant={alert.severity === "error" ? "destructive" : "secondary"}>
                              {alert.type.replace("_", " ")}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{alert.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Expiry Distribution</CardTitle>
                      <CardDescription>
                        Products by expiry status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-muted-foreground">
                        Charts will be displayed here
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sales Predictions</CardTitle>
                      <CardDescription>
                        AI-powered sales forecasting
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-muted-foreground">
                        Charts will be displayed here
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}