import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, PlusCircle, LogOut, Users, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const role = (user?.role || '').trim().toLowerCase();

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Change Requests', path: '/crs', icon: <FileText size={20} /> },
    ];

    if (user && (role === 'change requester' || role === 'admin')) {
        navItems.push({
            label: 'Submit CR',
            path: '/crs/new',
            icon: <PlusCircle size={20} />,
        });
    }

    if (user && role === 'admin') {
        navItems.push({
            label: 'User Management',
            path: '/users',
            icon: <Users size={20} />,
        });
    }

    return (
        <div className="flex h-screen bg-gray-100">

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <aside
                className={`
          bg-blue-900 text-white shadow-xl flex flex-col
          transition-all duration-300 ease-in-out flex-shrink-0
          ${collapsed ? 'w-16' : 'w-64'}
        `}
            >
                {/* Logo + Toggle button */}
                <div className={`
          border-b border-blue-800 flex items-center
          ${collapsed ? 'justify-center py-4 px-2' : 'p-4 gap-3 justify-between'}
        `}>
                    {/* Logo + text (hidden when collapsed) */}
                    {!collapsed && (
                        <div className="flex items-center gap-3 min-w-0">
                            <img
                                src="/aai-logo.png"
                                alt="AAI Logo"
                                className="h-10 w-auto object-contain flex-shrink-0"
                            />
                            <div className="min-w-0">
                                <h1 className="font-bold text-lg leading-tight">AAI</h1>
                                <p className="text-xs text-blue-200 truncate">Change Management</p>
                            </div>
                        </div>
                    )}

                    {/* Collapsed: show only logo */}
                    {collapsed && (
                        <img
                            src="/aai-logo.png"
                            alt="AAI Logo"
                            className="h-8 w-auto object-contain"
                        />
                    )}

                    {/* Toggle button */}
                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            className="text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg p-1 flex-shrink-0 transition"
                            title="Collapse sidebar"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}
                </div>

                {/* Expand button when collapsed */}
                {collapsed && (
                    <div className="flex justify-center py-2 border-b border-blue-800">
                        <button
                            onClick={() => setCollapsed(false)}
                            className="text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg p-1 transition"
                            title="Expand sidebar"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}

                {/* Logged in user */}
                {!collapsed && (
                    <div className="px-4 py-3 border-b border-blue-800">
                        <p className="text-xs uppercase text-blue-300 font-semibold mb-1">
                            Logged in as
                        </p>
                        <p className="font-semibold text-sm text-white truncate">{user?.username}</p>
                        <p className="text-xs text-blue-200 truncate">{user?.role}</p>
                    </div>
                )}

                {/* Collapsed: user avatar */}
                {collapsed && (
                    <div className="flex justify-center py-3 border-b border-blue-800">
                        <div
                            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold uppercase"
                            title={`${user?.username} — ${user?.role}`}
                        >
                            {user?.username?.charAt(0)}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 mt-3 overflow-y-auto">
                    <ul className={`space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
                        {navItems.map((item) => {
                            const active = location.pathname.startsWith(item.path);
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        title={collapsed ? item.label : ''}
                                        className={`
                      flex items-center rounded-lg text-sm font-medium transition-all
                      ${collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                      ${active
                                                ? 'bg-blue-700 text-white shadow'
                                                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                            }
                    `}
                                    >
                                        <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
                                        {!collapsed && item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className={`border-t border-blue-800 ${collapsed ? 'p-2' : 'p-3'}`}>
                    <button
                        onClick={handleLogout}
                        title={collapsed ? 'Logout' : ''}
                        className={`
              flex items-center text-sm font-medium text-blue-100
              hover:bg-blue-800 rounded-lg transition w-full
              ${collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}
            `}
                    >
                        <LogOut size={20} className={collapsed ? '' : 'mr-3'} />
                        {!collapsed && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────── */}
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Header */}
                <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 flex-shrink-0">
                    {/* Mobile hamburger (optional — for small screens) */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-gray-500 hover:text-blue-900 transition md:hidden"
                    >
                        <Menu size={22} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 truncate">
                        Airport Authority of India – Change Management System
                    </h2>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
