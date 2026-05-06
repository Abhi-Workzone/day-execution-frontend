import React, { useState, useEffect } from 'react';
import { planApi, summaryApi } from '../api';
import { Play, Square, CheckCircle, XCircle, AlertCircle, Loader2, MinusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const Execution = () => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null); // { id, status }
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchPlan();
  }, [currentDate]);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const dateStr = currentDate.toISOString().split('T')[0];
      const response = await planApi.getTodayPlan(dateStr);
      if (response.data.exists) {
        // Sort tasks by plannedStart time in ascending order
        const sortedTasks = response.data.plan.tasks.sort((a, b) => {
          const timeA = a.plannedStart || '00:00';
          const timeB = b.plannedStart || '00:00';
          return timeA.localeCompare(timeB);
        });
        setPlan({ ...response.data.plan, tasks: sortedTasks });
      } else {
        // Fallback to routines only if no plan
        const routines = response.data.suggestions.routines.map(r => ({
          _id: r._id,
          title: r.title,
          type: 'routine',
          plannedStart: r.startTime,
          plannedEnd: r.startTime,
          status: 'pending'
        }));
        // Sort routines by start time
        const sortedRoutines = routines.sort((a, b) => a.plannedStart.localeCompare(b.plannedStart));
        setPlan({ tasks: sortedRoutines, isFallback: true });
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (days) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + days);
    setCurrentDate(nextDate);
  };

  const updateStatus = async (taskId, status) => {
    if (status === 'missed' || status === 'partial') {
      setPendingStatusUpdate({ id: taskId, status });
      setShowReasonModal(true);
      return;
    }
    
    performStatusUpdate(taskId, status, '');
  };

  const performStatusUpdate = async (taskId, status, reasonText) => {
    setUpdatingId(taskId);
    try {
      const data = {
        status,
        actualTime: status === 'done' ? 30 : (status === 'partial' ? 15 : 0), // Placeholder
        reason: reasonText || ''
      };

      await planApi.updateExecution(plan._id, taskId, data);
      await fetchPlan(); 
    } catch (error) {
      console.error('Error updating execution:', error);
    } finally {
      setUpdatingId(null);
      setShowReasonModal(false);
      setReason('');
      setPendingStatusUpdate(null);
    }
  };

  const handleReasonSubmit = (e) => {
    e.preventDefault();
    if (!pendingStatusUpdate) return;
    performStatusUpdate(pendingStatusUpdate.id, pendingStatusUpdate.status, reason);
  };

  const finalizeDay = async () => {
    setLoading(true);
    try {
      await summaryApi.createSummary({
        date: currentDate,
        notes: 'End of day review.'
      });
      window.location.href = '/analytics';
    } catch (error) {
      console.error('Error finalizing day:', error);
      alert('Failed to finalize day. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWarningMessage = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(currentDate);
    selected.setHours(0, 0, 0, 0);

    if (selected.getTime() === today.getTime()) return 'today';
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (selected.getTime() === tomorrow.getTime()) return 'tomorrow';

    return format(currentDate, 'MMM do');
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;

  if (!plan) return (
    <div className="bg-red-50 p-6 sm:p-8 rounded-3xl border border-red-100 text-center space-y-4">
      <AlertCircle className="mx-auto text-red-500" size={40} sm:size={48} />
      <h3 className="text-lg sm:text-xl font-bold text-red-800">Connection Error</h3>
      <p className="text-sm sm:text-base text-red-600">Unable to connect to server. Please ensure backend is running on port 5000.</p>
      <button onClick={fetchPlan} className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-xl text-sm sm:text-base font-bold">Retry</button>
    </div>
  );

  return (
    <div className="space-y-8">
      {plan?.isFallback && (
        <div className="bg-amber-50 border border-amber-200 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4">
          <div className="flex items-start sm:items-center gap-3 text-amber-800">
            <AlertCircle size={20} className="flex-shrink-0 mt-1 sm:mt-0" />
            <div>
              <p className="font-bold text-amber-900 text-sm sm:text-base">No plan submitted for {getWarningMessage()}</p>
              <p className="text-xs sm:text-sm text-amber-700">Showing default routines. Tracking is limited until you create a plan.</p>
            </div>
          </div>
          <button onClick={() => window.location.href = '/plan'} className="bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap">
            Create Plan
          </button>
        </div>
      )}
      
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <button 
            onClick={() => navigateDate(-1)}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <ChevronLeft size={20} sm:size={24} />
          </button>
          <div className="text-center min-w-[150px] sm:min-w-[200px] flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              {format(currentDate, 'EEEE, MMM do')}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {format(currentDate, 'yyyy')}
            </p>
          </div>
          <button 
            onClick={() => navigateDate(1)}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <ChevronRight size={20} sm:size={24} />
          </button>
        </div>
        {!plan?.isFallback && (
          <button 
            onClick={finalizeDay}
            className="w-full sm:w-auto bg-primary-600 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-primary-700 transition-all font-bold shadow-lg shadow-primary-100 text-sm sm:text-base"
          >
            Finalize Day
          </button>
        )}
      </header>

      <div className="relative pl-4 sm:pl-8 space-y-4 sm:space-y-6 timeline-line">
        {plan.tasks?.map((task, idx) => (
          <div key={task._id} className="relative bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-md transition-all">
            <div className="absolute -left-[19px] sm:-left-[23px] w-3 h-3 sm:w-4 sm:h-4 rounded-full border-4 border-white bg-primary-500 z-10"></div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase whitespace-nowrap ${
                  task.type === 'routine' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  {task.type}
                </span>
                <span className="text-slate-400 text-xs sm:text-sm">
                  {task.plannedStart}
                  {task.plannedEnd && task.plannedEnd !== task.plannedStart && ` - ${task.plannedEnd}`}
                </span>
              </div>
              <h3 className={`text-base sm:text-lg font-bold break-words ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {task.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {updatingId === task._id ? (
                <Loader2 className="animate-spin text-primary-500" size={20} sm:size={24} />
              ) : (
                <>
                  <button 
                    onClick={() => updateStatus(task._id, 'done')}
                    disabled={plan?.isFallback}
                    className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                      task.status === 'done' ? 'bg-green-100 text-green-600' : 'text-slate-300 hover:bg-green-50 hover:text-green-600'
                    } ${plan?.isFallback ? 'opacity-20 cursor-not-allowed' : ''}`}
                    title="Mark Done"
                  >
                    <CheckCircle size={18} sm:size={24} />
                  </button>
                  <button 
                    onClick={() => updateStatus(task._id, 'partial')}
                    disabled={plan?.isFallback}
                    className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                      task.status === 'partial' ? 'bg-yellow-100 text-yellow-600' : 'text-slate-300 hover:bg-yellow-50 hover:text-yellow-600'
                    } ${plan?.isFallback ? 'opacity-20 cursor-not-allowed' : ''}`}
                    title="Mark Partial"
                  >
                    <MinusCircle size={18} sm:size={24} />
                  </button>
                  <button 
                    onClick={() => updateStatus(task._id, 'missed')}
                    disabled={plan?.isFallback}
                    className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                      task.status === 'missed' ? 'bg-red-100 text-red-600' : 'text-slate-300 hover:bg-red-50 hover:text-red-600'
                    } ${plan?.isFallback ? 'opacity-20 cursor-not-allowed' : ''}`}
                    title="Mark Missed"
                  >
                    <XCircle size={18} sm:size={24} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <form onSubmit={handleReasonSubmit} className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="space-y-2 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} sm:size={32} />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-slate-800">Why was this {pendingStatusUpdate?.status}?</h3>
              <p className="text-slate-500 text-xs sm:text-sm">Logging reason helps improve your future planning accuracy.</p>
            </div>
            
            <textarea 
              autoFocus
              required
              placeholder="e.g., Unexpected meeting, Low energy, etc."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none h-32 resize-none text-slate-700 text-sm sm:text-base"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setShowReasonModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm sm:text-base"
              >
                Skip
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100 text-sm sm:text-base"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Execution;
