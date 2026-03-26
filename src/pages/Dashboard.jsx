import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock, Users, Database } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [priorityData, setPriorityData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/reports/dashboard-stats');
                setStats(res.data.stats || {});
                const formattedData = (res.data.priorityBreakdown || []).map(item => ({
                    name: item.priority || 'Unassigned',
                    value: parseInt(item.count)
                }));
                setPriorityData(formattedData);
            } catch (err) {
                console.error('Failed to load dashboard', err);
                setError(err.response?.data?.error || err.message || "Failed to load dashboard");
                setStats({});
            }
        };
        fetchDashboardData();
    }, []);

    const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

    if (error) return <div className="p-6 text-lg font-medium text-red-600">Error: {error}</div>;
    if (!stats) return <div className="p-6 text-lg font-medium text-gray-700">Loading Dashboard...</div>;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Welcome, {user.username}
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                    Here is the latest overview of the Change Management System.
                </p>
            </div>

            {/* Stat Cards - 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">

                {stats.totalCrs !== undefined && (
                    <StatCard title="Total CRs" value={stats.totalCrs} icon={<Database size={22} className="text-blue-700" />} />
                )}
                {stats.totalUsers !== undefined && (
                    <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={22} className="text-green-600" />} />
                )}
                {stats.myCrs !== undefined && (
                    <StatCard title="My CRs" value={stats.myCrs} icon={<Activity size={22} className="text-indigo-600" />} />
                )}
                {stats.pendingCrs !== undefined && (
                    <StatCard title="Pending CRs" value={stats.pendingCrs} icon={<Clock size={22} className="text-yellow-500" />} />
                )}
                {stats.pendingActions !== undefined && (
                    <StatCard title="Pending Review" value={stats.pendingActions} icon={<Activity size={22} className="text-red-600" />} />
                )}

            </div>

            {/* Charts - stacked on mobile, side by side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

                {/* Pie Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
                        CR Priority Breakdown
                    </h3>
                    <div className="h-[240px] md:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
                        CRs by Priority
                    </h3>
                    <div className="h-[240px] md:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                                <Bar dataKey="value" fill="#1e3a8a" radius={[6, 6, 0, 0]} barSize={35} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all">
        <div>
            <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900">{value}</h4>
        </div>
        <div className="p-2 md:p-3 bg-gray-50 rounded-full flex-shrink-0">
            {icon}
        </div>
    </div>
);

export default Dashboard;
