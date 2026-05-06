import React, { useState, useEffect } from 'react';
import { routineApi } from '../api';
import { Plus, Trash2, Clock, Calendar, Loader2, Pencil } from 'lucide-react';

const Routines = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newRoutine, setNewRoutine] = useState({
    title: '',
    startTime: '08:00',
    duration: 60,
    daysOfWeek: []
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const response = await routineApi.getRoutines();
      // Sort routines by start time in ascending order
      const sortedRoutines = response.data.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setRoutines(sortedRoutines);
    } catch (error) {
      console.error('Error fetching routines:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (index) => {
    const current = [...newRoutine.daysOfWeek];
    if (current.includes(index)) {
      setNewRoutine({...newRoutine, daysOfWeek: current.filter(d => d !== index)});
    } else {
      setNewRoutine({...newRoutine, daysOfWeek: [...current, index]});
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newRoutine.daysOfWeek.length === 0) return alert('Select at least one day');
    try {
      if (editingId) {
        await routineApi.updateRoutine(editingId, newRoutine);
      } else {
        await routineApi.createRoutine(newRoutine);
      }
      handleCloseModal();
      fetchRoutines();
    } catch (error) {
      console.error('Error saving routine:', error);
    }
  };

  const handleEdit = (routine) => {
    setEditingId(routine._id);
    setNewRoutine({
      title: routine.title,
      startTime: routine.startTime,
      duration: routine.duration,
      daysOfWeek: routine.daysOfWeek
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNewRoutine({ title: '', startTime: '08:00', duration: 60, daysOfWeek: [] });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this routine?')) return;
    try {
      await routineApi.deleteRoutine(id);
      fetchRoutines();
    } catch (error) {
      console.error('Error deleting routine:', error);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Weekly Routines</h2>
          <p className="text-slate-500 text-sm sm:text-base">Recurring patterns for your days</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-primary-600 text-white px-4 sm:px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all font-bold shadow-lg text-sm sm:text-base"
        >
          <Plus size={18} sm:size={20} /> Create Routine
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {routines.map(routine => (
          <div key={routine._id} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 sm:gap-4">
            <div className="flex justify-between items-start">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 truncate pr-2">{routine.title}</h3>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(routine)} className="text-slate-300 hover:text-primary-500 transition-colors p-1">
                  <Pencil size={16} sm:size={18} />
                </button>
                <button onClick={() => handleDelete(routine._id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                  <Trash2 size={16} sm:size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
              <span className="flex items-center gap-1 font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded text-xs sm:text-sm">
                <Clock size={12} sm:size={14} /> {routine.startTime}
              </span>
              {routine.duration > 0 && <span className="text-xs sm:text-sm">{routine.duration} mins</span>}
            </div>

            <div className="flex gap-1 flex-wrap">
              {days.map((day, i) => (
                <span 
                  key={day}
                  className={`text-[10px] w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold border ${
                    routine.daysOfWeek.includes(i) 
                    ? 'bg-slate-800 text-white border-slate-800' 
                    : 'bg-white text-slate-300 border-slate-100'
                  }`}
                >
                  {day[0]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{editingId ? 'Edit Routine' : 'New Routine'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm sm:text-base"
                  value={newRoutine.title}
                  onChange={e => setNewRoutine({...newRoutine, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Start Time</label>
                  <input 
                    type="time" required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm sm:text-base"
                    value={newRoutine.startTime}
                    onChange={e => setNewRoutine({...newRoutine, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (min)</label>
                  <input 
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm sm:text-base"
                    value={newRoutine.duration}
                    onChange={e => setNewRoutine({...newRoutine, duration: e.target.value === '' ? '' : parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Repeating Days</label>
                <div className="flex justify-between gap-1 mt-2">
                  {days.map((day, i) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-bold text-xs transition-all ${
                        newRoutine.daysOfWeek.includes(i)
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm sm:text-base">
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors text-sm sm:text-base">
                Save Routine
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Routines;
