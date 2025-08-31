import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Wrench, 
  Filter, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  User, 
  Search,
  Activity,
  TrendingUp 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    description: "Vue d'ensemble",
  },
  {
    title: "Engins",
    url: "/engins",
    icon: Wrench,
    description: "Machines et équipements",
  },
  {
    title: "Filtres",
    url: "/filtres", 
    icon: Filter,
    description: "Catalogue des filtres",
  },
  {
    title: "Configuration",
    url: "/config",
    icon: Settings,
    description: "Paramètres système",
  },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    FilterPro
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Gestion des Filtres</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1 ml-8">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              {/* Search Bar - Hidden on mobile */}
              <div className="hidden lg:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-10 w-64 bg-gray-50/80 border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg h-9"
                />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <User className="h-4 w-4 text-white" />
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive 
                        ? "bg-gradient-to-br from-blue-100 to-purple-100" 
                        : "bg-gray-100"
                    }`}>
                      <item.icon className={`h-5 w-5 ${
                        isActive ? "text-blue-600" : "text-gray-500"
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}