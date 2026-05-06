import React, { useState, useEffect } from 'react';
import { taskApi } from '../api';
import { Plus, Trash2, Clock, Calendar, Check, Loader2, Pencil } from 'lucide-react';

const TodoPool = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'flexible',
    estimatedTime: 30,
    deadline: ''
  });

  useEffect(() => {
    if (activeTab === 'active') {
      fetchTasks();
    } else {
      fetchCompletedTasks();
    }
  }, [activeTab, filterMonth, filterYear]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskApi.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedTasks = async () => {
    setLoading(true);
    try {
      const response = await taskApi.getCompletedTasks(filterMonth, filterYear);
      setCompletedTasks(response.data);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await taskApi.updateTask(editingId, newTask);
      } else {
        await taskApi.createTask(newTask);
      }
      handleCloseModal();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setNewTask({
      title: task.title,
      description: task.description || '',
      type: task.type,
      estimatedTime: task.estimatedTime,
      deadline: task.deadline ? task.deadline.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNewTask({ title: '', description: '', type: 'flexible', estimatedTime: 30, deadline: '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await taskApi.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Todo Pool</h2>
            <p className="text-sm text-slate-500 font-medium">Manage your task backlog</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Completed
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          {activeTab === 'active' && (
            <button 
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto bg-primary-600 text-white px-4 sm:px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all font-bold shadow-lg shadow-primary-200 text-sm sm:text-base"
            >
              <Plus size={18} sm:size={20} /> Add Task
            </button>
          )}

          {activeTab === 'completed' && (
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                value={filterMonth}
                onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                className="bg-slate-50 border-none rounded-xl px-3 sm:px-4 py-2 text-sm font-bold text-slate-600 outline-none"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="bg-slate-50 border-none rounded-xl px-3 sm:px-4 py-2 text-sm font-bold text-slate-600 outline-none"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-500" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {(activeTab === 'active' ? tasks : completedTasks).map(task => (
            <div key={task._id} className={`bg-white p-4 sm:p-6 rounded-3xl border transition-all group ${task.status === 'completed' ? 'border-green-100 bg-green-50/10' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                  task.status === 'completed' ? 'bg-green-100 text-green-600' : 
                  (task.type === 'time-bound' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600')
                }`}>
                  {task.status === 'completed' ? 'Done' : task.type}
                </span>
                {activeTab === 'active' && (
                  <div className="flex gap-1 sm:gap-2">
                    <button onClick={() => handleEdit(task)} className="text-slate-300 hover:text-primary-500 transition-colors p-1">
                      <Pencil size={16} sm:size={18} />
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} sm:size={18} />
                    </button>
                  </div>
                )}
                {activeTab === 'completed' && (
                  <Check className="text-green-500 flex-shrink-0" size={16} sm:size={18} />
                )}
              </div>
              <h3 className={`text-base sm:text-lg font-bold mb-2 ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-3 sm:mb-4">{task.description || 'No description provided.'}</p>
              <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-400 flex-wrap">
                {task.estimatedTime > 0 && <span className="flex items-center gap-1"><Clock size={12} sm:size={14} /> {task.estimatedTime}m</span>}
                {task.status === 'completed' ? (
                  <span className="flex items-center gap-1"><Calendar size={12} sm:size={14} /> Done on {new Date(task.createdAt).toLocaleDateString()}</span>
                ) : (
                  task.deadline && <span className="flex items-center gap-1"><Calendar size={12} sm:size={14} /> {new Date(task.deadline).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'active' && tasks.length === 0 && !loading && (
        <div className="text-center py-12 sm:py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium text-sm sm:text-base">No active tasks in your pool. Add some to get started!</p>
        </div>
      )}

      {activeTab === 'completed' && completedTasks.length === 0 && !loading && (
        <div className="text-center py-12 sm:py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium text-sm sm:text-base">No completed tasks found for this month.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200" style={{ transform: 'scale(1)', transformOrigin: 'center' }}>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{editingId ? 'Edit Task' : 'New Task'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm sm:text-base"
                  style={{ fontSize: '16px' }}
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm sm:text-base"
                    style={{ fontSize: '16px' }}
                    value={newTask.type}
                    onChange={e => setNewTask({...newTask, type: e.target.value})}
                  >
                    <option value="flexible">Flexible</option>
                    <option value="time-bound">Time-bound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (min)</label>
                  <input 
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm sm:text-base"
                    style={{ fontSize: '16px' }}
                    value={newTask.estimatedTime}
                    onChange={e => setNewTask({...newTask, estimatedTime: e.target.value === '' ? '' : parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none h-24 text-sm sm:text-base"
                  style={{ fontSize: '16px', resize: 'none' }}
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm sm:text-base">
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors text-sm sm:text-base">
                {editingId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TodoPool;
