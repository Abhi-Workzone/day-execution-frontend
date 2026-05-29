import React, { useState, useEffect } from 'react';
import { planApi, taskApi } from '../api';
import { Plus, Check, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const PlanDay = () => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState({ routines: [], tasks: [] });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [alreadyPlanned, setAlreadyPlanned] = useState(false);
  const [schedulingTask, setSchedulingTask] = useState(null);
  const [planDate, setPlanDate] = useState('today'); // 'today' or 'tomorrow'

  useEffect(() => {
    fetchContext();
  }, [planDate]);

  const fetchContext = async () => {
    setLoading(true);
    try {
      const date = new Date();
      if (planDate === 'tomorrow') date.setDate(date.getDate() + 1);
      const dateStr = format(date, 'yyyy-MM-dd');

      const response = await planApi.getTodayPlan(dateStr);
      const suggs = response.data.suggestions || { routines: [], tasks: [] };
      setSuggestions(suggs);

      if (response.data.exists) {
        setAlreadyPlanned(true);
        // Load existing plan into selectedTasks
        const existingTasks = response.data.plan.tasks.map(t => ({
          id: t.taskId || t._id, // Routine tasks might not have taskId
          title: t.title,
          description: t.description || '',
          type: t.type,
          plannedStart: t.plannedStart,
          plannedEnd: t.plannedEnd,
          duration: t.plannedDuration || 0
        }));
        setSelectedTasks(existingTasks);
      } else {
        setAlreadyPlanned(false);
        // Auto-select routines for new plan
        const initialRoutines = suggs.routines.map(r => ({
          id: r._id,
          title: r.title,
          description: r.description || '',
          type: 'routine',
          plannedStart: r.startTime,
          plannedEnd: calculateEndTime(r.startTime, r.duration),
          duration: r.duration
        }));
        setSelectedTasks(initialRoutines);
      }
    } catch (error) {
      console.error('Error fetching context:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + (duration || 0), 0);
    return format(date, 'HH:mm');
  };

  const findNextAvailableSlot = (duration) => {
    // Sort current tasks by start time
    const sorted = [...selectedTasks].sort((a, b) => a.plannedStart.localeCompare(b.plannedStart));
    
    let lastEnd = "09:00"; // Start of day
    
    for (const task of sorted) {
      if (task.plannedStart > lastEnd) {
        // Check if gap is enough
        const gap = getGapInMinutes(lastEnd, task.plannedStart);
        if (gap >= duration) return lastEnd;
      }
      lastEnd = task.plannedEnd > lastEnd ? task.plannedEnd : lastEnd;
    }
    
    return lastEnd;
  };

  const getGapInMinutes = (start, end) => {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  const toggleTask = (task, type) => {
    const taskId = task._id;
    const exists = selectedTasks.find(t => t.id === taskId);
    
    if (exists) {
      setSelectedTasks(selectedTasks.filter(t => t.id !== taskId));
    } else {
      if (type === 'routine') {
        const startTime = task.startTime;
        const duration = task.duration || 0;
        const endTime = calculateEndTime(startTime, duration);
        setSelectedTasks([...selectedTasks, {
          id: taskId,
          title: task.title,
          description: task.description || '',
          type: type,
          plannedStart: startTime,
          plannedEnd: endTime,
          duration: duration
        }]);
      } else {
        // Open time picker for Todo
        setSchedulingTask({
          ...task,
          plannedStart: '09:00',
          plannedEnd: calculateEndTime('09:00', task.estimatedTime || 30)
        });
      }
    }
  };

  const confirmSchedule = () => {
    if (!schedulingTask) return;
    
    const duration = getGapInMinutes(schedulingTask.plannedStart, schedulingTask.plannedEnd);
    
    setSelectedTasks([...selectedTasks, {
      id: schedulingTask._id,
      title: schedulingTask.title,
      description: schedulingTask.description || '',
      type: 'todo',
      plannedStart: schedulingTask.plannedStart,
      plannedEnd: schedulingTask.plannedEnd,
      duration: Math.max(0, duration)
    }]);
    
    setSchedulingTask(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const date = new Date();
      if (planDate === 'tomorrow') date.setDate(date.getDate() + 1);

      const tasksToSave = selectedTasks.map(t => ({
        taskId: t.id,
        title: t.title,
        description: t.description || '',
        type: t.type,
        plannedStart: t.plannedStart,
        plannedEnd: t.plannedEnd,
        plannedDuration: t.duration,
        status: 'pending'
      }));

      const plannedTotalTime = selectedTasks.reduce((acc, t) => acc + (t.duration || 0), 0);

      await planApi.savePlan({
        date: format(date, 'yyyy-MM-dd'),
        tasks: tasksToSave,
        plannedTotalTime
      });
      
      window.location.href = '/';
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{alreadyPlanned ? 'Edit Plan' : 'Plan Your Day'}</h2>
            <p className="text-sm text-slate-500 font-medium">
              {format(planDate === 'today' ? new Date() : new Date(Date.now() + 86400000), 'EEEE, MMMM do')}
            </p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setPlanDate('today')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${planDate === 'today' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Today
            </button>
            <button 
              onClick={() => setPlanDate('tomorrow')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${planDate === 'tomorrow' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tomorrow
            </button>
          </div>
        </div>

        {alreadyPlanned && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-blue-100 w-full sm:w-auto justify-center">
            <AlertCircle size={16} /> Plan active for this date
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pb-32">
        {/* Routines */}
        <section className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-slate-700">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Suggested Routines
          </h3>
          <div className="space-y-2">
            {suggestions.routines.map(r => {
              const isSelected = selectedTasks.find(t => t.id === r._id);
              return (
                <div 
                  key={r._id} 
                  onClick={() => toggleTask(r, 'routine')}
                  className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center group ${
                    isSelected
                    ? 'bg-primary-50 border-primary-200' 
                    : 'bg-white border-slate-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {r.startTime}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-sm sm:text-base truncate">{r.title}</p>
                      <p className="text-xs text-slate-500">{r.duration} mins</p>
                    </div>
                  </div>
                  {isSelected ? <Check className="text-primary-600 flex-shrink-0" /> : <Plus className="text-slate-300 group-hover:text-primary-400 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </section>

        {/* Tasks */}
        <section className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-slate-700">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Todo Pool
          </h3>
          <div className="space-y-2">
            {suggestions.tasks.map(t => {
              const isSelected = selectedTasks.find(t_item => t_item.id === t._id);
              const selectedItem = selectedTasks.find(t_item => t_item.id === t._id);
              return (
                <div 
                  key={t._id} 
                  onClick={() => toggleTask(t, 'todo')}
                  className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center group ${
                    isSelected
                    ? 'bg-purple-50 border-purple-200' 
                    : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {isSelected ? selectedItem.plannedStart : <Plus size={14} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-sm sm:text-base truncate">{t.title}</p>
                      <p className="text-xs text-slate-500">{t.estimatedTime} mins</p>
                    </div>
                  </div>
                  {isSelected ? <Check className="text-purple-600 flex-shrink-0" /> : <Plus className="text-slate-300 group-hover:text-purple-400 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {selectedTasks.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-8 right-4 left-4 sm:left-72 lg:left-72 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 z-40">
          <div>
            <p className="text-sm text-slate-500">Proposed Timeline</p>
            <p className="text-base sm:text-lg font-bold text-slate-800">{selectedTasks.length} items scheduled</p>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 sm:px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-600 text-white px-4 sm:px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {saving ? <Loader2 className="animate-spin" /> : (alreadyPlanned ? 'Update Plan' : 'Finalize & Execute')}
            </button>
          </div>
        </div>
      )}
      {/* Scheduling Modal */}
      {schedulingTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Schedule Task</h3>
              <p className="text-slate-500 font-medium text-sm sm:text-base">{schedulingTask.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Start Time</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-700 text-sm sm:text-base"
                  value={schedulingTask.plannedStart}
                  onChange={e => setSchedulingTask({...schedulingTask, plannedStart: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">End Time</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-700 text-sm sm:text-base"
                  value={schedulingTask.plannedEnd}
                  onChange={e => setSchedulingTask({...schedulingTask, plannedEnd: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSchedulingTask(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSchedule}
                className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100 text-sm sm:text-base"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDay;
