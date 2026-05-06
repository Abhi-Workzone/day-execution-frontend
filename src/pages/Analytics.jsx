import React, { useState, useEffect } from 'react';
import { summaryApi } from '../api';
import { TrendingUp, CheckCircle, Clock, Target, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const Analytics = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await summaryApi.getAllSummaries();
      setSummaries(response.data);
    } catch (error) {
      console.error('Error fetching summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;

  const latest = summaries[0] || {
    completionRate: 0,
    accuracyScore: 0,
    plannedTime: 0,
    actualTime: 0
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Analytics</h2>
        <p className="text-slate-500 text-sm sm:text-base">Performance insights and execution history</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          icon={<CheckCircle className="text-green-600" />} 
          label="Avg Completion" 
          value={`${Math.round(latest.completionRate)}%`} 
          color="bg-green-50"
        />
        <StatCard 
          icon={<Target className="text-blue-600" />} 
          label="Accuracy Score" 
          value={`${Math.round(latest.accuracyScore)}%`} 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<Clock className="text-purple-600" />} 
          label="Planned Hours" 
          value={`${(latest.plannedTime / 60).toFixed(1)}h`} 
          color="bg-purple-50"
        />
        <StatCard 
          icon={<TrendingUp className="text-orange-600" />} 
          label="Actual Hours" 
          value={`${(latest.actualTime / 60).toFixed(1)}h`} 
          color="bg-orange-50"
        />
      </div>

      {/* History Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        <section className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base sm:text-lg">Execution History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Date</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Planned</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Actual</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Completion</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {summaries.map(s => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-slate-700 text-sm sm:text-base">{format(new Date(s.date), 'MMM dd, yyyy')}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base">{Math.round(s.plannedTime / 60)}h</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-600 text-sm sm:text-base">{Math.round(s.actualTime / 60)}h</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 sm:w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${s.completionRate}%` }}></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-700">{Math.round(s.completionRate)}%</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        s.accuracyScore > 80 ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {Math.round(s.accuracyScore)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base sm:text-lg">Miss Reasons Breakdown</h3>
          <div className="space-y-4">
            {latest.notes ? (
              <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs sm:text-sm text-slate-600 italic">"{latest.notes}"</p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-400">No specific reasons recorded for latest session.</p>
            )}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 uppercase font-bold mb-2">Key Insights</p>
              <ul className="space-y-2">
                <li className="text-xs sm:text-sm text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                  Planning accuracy: {latest.accuracyScore > 90 ? 'Excellent' : 'Needs improvement'}
                </li>
                <li className="text-xs sm:text-sm text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                  Execution rate: {latest.completionRate > 80 ? 'Consistent' : 'Varies'}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-4">
    <div className={`p-2 sm:p-3 rounded-2xl ${color}`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs sm:text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-lg sm:text-2xl font-bold text-slate-800 truncate">{value}</p>
    </div>
  </div>
);

export default Analytics;
