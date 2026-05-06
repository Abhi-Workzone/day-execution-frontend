import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, ClipboardList, RefreshCw, BarChart3, Clock, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Execution', icon: <Clock size={20} /> },
    { path: '/plan', label: 'Plan Day', icon: <Calendar size={20} /> },
    { path: '/tasks', label: 'Todo Pool', icon: <ClipboardList size={20} /> },
    { path: '/routines', label: 'Routines', icon: <RefreshCw size={20} /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
            <LayoutDashboard /> Day Execution
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-primary-600">Day Execution</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
