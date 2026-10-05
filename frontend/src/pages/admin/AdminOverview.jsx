import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getStats } from '../../api/feeRecord.api.js';

const COLORS = ['#16a34a', '#dc2626']; // green = collected, red = outstanding

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <span className="loading loading-spinner"></span>;

  const pieData = [
    { name: 'Collected', value: stats.totalCollected },
    { name: 'Outstanding', value: stats.totalOutstanding },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Students</div>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Collected</div>
          <div className="stat-value text-success">₦{stats.totalCollected.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Outstanding</div>
          <div className="stat-value text-error">₦{stats.totalOutstanding.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow p-4">
          <h3 className="font-semibold mb-2">Collected vs Outstanding</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-base-100 shadow p-4">
          <h3 className="font-semibold mb-2">By Class</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.classBreakdown}>
              <XAxis dataKey="className" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="collected" fill="#16a34a" name="Collected" />
              <Bar dataKey="outstanding" fill="#dc2626" name="Outstanding" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;