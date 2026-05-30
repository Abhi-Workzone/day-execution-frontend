import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, Activity, Calendar, 
  CheckSquare, Repeat, BarChart3, 
  Zap, Sparkles, ArrowUpRight, ChevronRight
} from 'lucide-react';

const DayExecutionProLanding = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Repeat className="w-6 h-6 text-blue-500" />,
      title: "Routine Module",
      description: "Define weekly repeating routines (e.g., Morning Meds, Mon/Wed/Fri Gym, Evening Reading). Anchor your day around core habits and build consistent streaks.",
      details: ["Day-of-week recurrence mapping", "Custom start times and durations", "Auto-populated into daily schedules"]
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-purple-500" />,
      title: "Todo Pool Module",
      description: "A high-speed capture system for one-off tasks, errands, and notes. Drag them into your timeline only when you are ready to execute.",
      details: ["Frictionless quick-capture entry", "Flexible backlog management", "Estimated time allocations"]
    },
    {
      icon: <Calendar className="w-6 h-6 text-amber-500" />,
      title: "Planning Engine",
      description: "The core synthesizer. Wake up to a plan where routines are pre-selected, and easily drag and drop backlog todos into remaining slots with precise timings.",
      details: ["Intelligent routine pre-selection", "Time-block slotting interface", "One-click plan finalization"]
    },
    {
      icon: <Activity className="w-6 h-6 text-emerald-500" />,
      title: "Execution & Analytics",
      description: "A chronological timeline visualization of your day. Log tasks as Done, Partial, or Missed, specify reasons for deviation, and review deep behavioral stats.",
      details: ["Chronological execution view", "Reasons tracking for accountability", "Peak focus hours & consistency stats"]
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Set Up Your Core Habits",
      description: "Input your repeating routines and the days they occur. They act as anchors for your weekly planner."
    },
    {
      number: "02",
      title: "Log Incoming Tasks",
      description: "Dump random todos, bills, calls, and meetings into your backlog. No need to assign dates yet."
    },
    {
      number: "03",
      title: "Synthesize the Daily Plan",
      description: "Each morning, choose which routines to run, time-block your todos, and lock in your daily roadmap."
    },
    {
      number: "04",
      title: "Execute & Measure Progress",
      description: "Follow your timeline. Log status and review automatically generated productivity graphs."
    }
  ];

  const faqs = [
    {
      question: "How is Day Execution Pro different from standard task managers?",
      answer: "Standard todo managers treat repeating routines and one-time tasks identically, which creates cognitive fatigue. Day Execution Pro segregates routines (habit loops) from todos (backlog items), enabling you to dynamically combine them only during your morning planning session."
    },
    {
      question: "Can I skip routines if my schedule changes?",
      answer: "Yes! During the planning phase, all routines for the day are pre-selected. You can easily uncheck any routine that doesn't fit your day without deleting it from your weekly template."
    },
    {
      question: "Does it support offline access?",
      answer: "Our mobile app (built with React Native) fully supports offline caching, allowing you to track execution and mark tasks done even without internet access. Data is synced to the cloud once you reconnect."
    },
    {
      question: "How do analytics help me perform better?",
      answer: "By requiring you to note if a task was Completed, Partially Completed, or Missed, the app captures behavioral insights. You get reports on consistency, reasons for deviation (e.g. low energy), and your most productive hours."
    }
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`border-b border-gray-200 backdrop-blur-md fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-gray-900 via-gray-700 to-blue-600 bg-clip-text text-transparent">
              Day Execution Pro
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#showcase" className="hover:text-blue-600 transition-colors">Showcase</a>
            <a href="#faqs" className="hover:text-blue-600 transition-colors">FAQs</a>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="https://product-docs-two.vercel.app/day-execution-pro" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-xl transition-all"
            >
              Docs Portal
            </Link>
            <Link 
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#eff6ff,transparent_60%)] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-600 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Re-engineer Your Productivity Systems
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Stop listing tasks.<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Start executing plans.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The intelligent daily planning software that dynamically synthesizes your repeating routines and one-time tasks into a locked chronological execution roadmap. Build consistency through analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link 
              to="/login"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-base font-bold bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-600/20"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/day-execution-pro/docs"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-base font-semibold bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl transition-all border border-gray-300 hover:border-gray-400 shadow-sm"
            >
              Read Documentation
            </Link>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="pt-16 max-w-5xl mx-auto">
            <div className="relative p-3 rounded-2xl bg-gray-900/95 border border-gray-800 shadow-2xl shadow-blue-500/5">
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-blue-500/20 blur-sm" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-indigo-500/20 blur-sm" />
              <div className="flex items-center gap-2 px-3 pb-3 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="text-xs text-gray-400 font-medium ml-4">day-execution-pro-v1.0.web</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 text-left overflow-x-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-700">
                  <div>
                    <h3 className="font-bold text-lg text-gray-100">Execution Timeline</h3>
                    <p className="text-xs text-gray-400">Friday, May 29th</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-300 bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-600">75% Target Achieved</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-1.5 shadow-md">
                      <Check className="w-3.5 h-3.5" /> Finalize Day
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  {/* Timeline Row 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="text-xs text-gray-400 font-semibold w-12 pt-2">08:00</div>
                    <div className="flex-1 bg-gray-700/40 border border-gray-600/60 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">Routine</span>
                          <span className="text-xs text-gray-300">30 mins</span>
                        </div>
                        <h4 className="font-bold text-gray-100 mt-1">Morning Meditation & Reflection</h4>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Timeline Row 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="text-xs text-gray-400 font-semibold w-12 pt-2">09:30</div>
                    <div className="flex-1 bg-gray-700/40 border border-gray-600/60 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">Todo</span>
                          <span className="text-xs text-gray-300">90 mins</span>
                        </div>
                        <h4 className="font-bold text-gray-100 mt-1">Refactor SaaS Landing Page Components</h4>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Timeline Row 3 */}
                  <div className="flex gap-4 items-start">
                    <div className="text-xs text-gray-400 font-semibold w-12 pt-2">13:00</div>
                    <div className="flex-1 bg-gray-700/40 border border-gray-600/60 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">Routine</span>
                          <span className="text-xs text-gray-300">60 mins</span>
                        </div>
                        <h4 className="font-bold text-gray-100 mt-1">Gym Workout Session</h4>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                        <span className="text-[10px] font-bold text-yellow-400">P</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Row 4 */}
                  <div className="flex gap-4 items-start opacity-60">
                    <div className="text-xs text-gray-400 font-semibold w-12 pt-2">16:30</div>
                    <div className="flex-1 bg-gray-700/20 border border-gray-600/50 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">Todo</span>
                          <span className="text-xs text-gray-300">45 mins</span>
                        </div>
                        <h4 className="font-bold text-gray-200 mt-1">Review team pull requests</h4>
                      </div>
                      <div className="w-6 h-6 rounded-full border border-gray-600" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3.5 py-1.5 rounded-full">System Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Structured workflow for high execution</h2>
            <p className="text-gray-600">
              Four robust components interacting seamlessly to ensure you hit targets consistently with zero planning friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group relative bg-white border border-gray-200 p-8 rounded-2xl hover:border-blue-300 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-blue-500/[0.1]"
              >
                <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6 border border-gray-200 group-hover:border-blue-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{feature.description}</p>
                <ul className="space-y-2.5">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <Check className="w-4 h-4 text-blue-600" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="workflow" className="py-24 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3.5 py-1.5 rounded-full">Step-by-step System</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How Day Execution Pro works</h2>
            <p className="text-gray-600">
              A clean flow engineered to take you from a chaotic backlog to flawless calendar execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <div className="text-5xl font-black bg-gradient-to-b from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  {step.number}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{step.title}</h3>
                <p className="text-xs leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section: Daily Planning Staging */}
      <section id="showcase" className="py-24 px-6 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1.5 rounded-full">Module 03</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Daily Planning Showcase</h2>
            <p className="text-gray-600 leading-relaxed">
              Every morning or night before, configure your staging screen. The app automatically fetches your active routines for that day of the week. Uncheck the ones you don't need, grab one-off items from the Todo Pool, allocate times, and click finalise.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">1</div>
                <p className="text-sm font-medium text-gray-700">Routines prepopulate automatically based on active days</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">2</div>
                <p className="text-sm font-medium text-gray-700">Drag/Select items from todo backlog into scheduling slots</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">3</div>
                <p className="text-sm font-medium text-gray-700">Calculate total planned duration instantly to avoid overallocation</p>
              </div>
            </div>
          </div>

          {/* Interactive Staging Stencil */}
          <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-100 flex items-center justify-between">
              <span>Day Planner Interface</span>
              <span className="text-xs font-semibold text-purple-400">Staging Area</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column: Routines list */}
              <div className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Suggested Routines</h4>
                <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-between border border-blue-500/30">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-500 bg-gray-800 border-gray-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-100">Morning Reading</p>
                      <p className="text-[10px] text-gray-400">07:00 • 30 mins</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">Auto</span>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-between border border-blue-500/30">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-500 bg-gray-800 border-gray-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-100">Workout Gym</p>
                      <p className="text-[10px] text-gray-400">18:00 • 60 mins</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">Auto</span>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-between border border-gray-600/80 opacity-50">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-500 bg-gray-800 border-gray-600" />
                    <div>
                      <p className="text-xs font-bold text-gray-400">Meditation</p>
                      <p className="text-[10px] text-gray-400">22:00 • 15 mins</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500">Skipped</span>
                </div>
              </div>

              {/* Right Column: Todo Pool */}
              <div className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Todo Pool Backlog</h4>
                <div className="p-3 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-between hover:border-gray-500 cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-gray-200">Grocery Shopping</p>
                    <p className="text-[10px] text-gray-400">Est. 30 mins</p>
                  </div>
                  <PlusButton />
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg border border-purple-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-purple-400">Refactor landing page</p>
                    <p className="text-[10px] text-gray-400">Scheduled: 09:30</p>
                  </div>
                  <span className="text-[10px] font-bold text-purple-400">Selected</span>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-between hover:border-gray-500 cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-gray-200">Pay Electric Bill</p>
                    <p className="text-[10px] text-gray-400">Est. 10 mins</p>
                  </div>
                  <PlusButton />
                </div>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Planned duration: <span className="font-bold text-white">120 mins</span></p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-md">
                Finalize & Execute <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Showcase */}
      <section className="py-24 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Analytics Visual Stencil */}
          <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:order-1 order-2 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <h3 className="font-bold text-lg text-gray-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                Performance Dashboard
              </h3>
              <span className="text-xs font-semibold text-gray-400 bg-gray-800 px-2 py-1 rounded">Weekly View</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Consistency Rate</p>
                <p className="text-2xl font-black text-emerald-400">89.4%</p>
                <p className="text-[10px] text-gray-400 mt-1">+3.2% vs last week</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Total Minutes</p>
                <p className="text-2xl font-black text-blue-400">1,480m</p>
                <p className="text-[10px] text-gray-400 mt-1">24.6 hrs tracked</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Missed routines</p>
                <p className="text-2xl font-black text-red-400">3</p>
                <p className="text-[10px] text-gray-400 mt-1">Reason: Low Energy</p>
              </div>
            </div>

            {/* Simulated bar chart */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Daily Completion Trends</h4>
              <div className="flex justify-between items-end h-28 pt-2 px-4 gap-2">
                {[60, 80, 45, 95, 85, 90, 75].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      style={{ height: `${val}%` }} 
                      className={`w-full rounded-t ${idx === 3 ? 'bg-gradient-to-t from-blue-600 to-indigo-500' : 'bg-gray-700'}`}
                    />
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:order-2 order-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">Module 04</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Analytics & Insights</h2>
            <p className="text-gray-600 leading-relaxed">
              Execution is useless without reflection. Day Execution Pro tracks your plan deviation, logs missed statuses, and builds consistency analytics. Find out what reasons derail you (e.g. meetings overrunning, exhaustion) and dynamically adjust your daily workload.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-700">Habit consistency tracking for reading, exercise, and hydration</p>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-700">Detailed logs specifying deviation reasons for accountability</p>
              </div>
              <div className="flex gap-3">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-700">Peak performance graphs analyzing task types and timings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3.5 py-1.5 rounded-full">User Feedback</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Loved by high-agency operators</h2>
            <p className="text-gray-600">
              See how executives, developers, and founders are using Day Execution Pro to reclaim control of their schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "Day Execution Pro has completely replaced my messy Todoist template. By separating my routines from one-off tasks, I no longer have planning anxiety when waking up. The staging flow is pure genius."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-blue-600">AR</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Amara Rodriguez</h4>
                  <p className="text-[10px] text-gray-500">Lead Frontend Engineer</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "I was skeptical about another planner. But tracking the reasons why I missed my gym workouts or meditation sessions allowed me to adjust my work hours. My habit consistency increased from 50% to 85% in a month."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-purple-600">MB</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Marcus Vance</h4>
                  <p className="text-[10px] text-gray-500">SaaS Founder</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "The analytics dashboard is a game-changer. I discovered that my peak productivity hours are 9-11 AM, so I rescheduled all my deep work tasks to that window. My output has doubled."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-emerald-600">SK</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Sarah Kim</h4>
                  <p className="text-[10px] text-gray-500">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-24 px-6 border-t border-gray-200">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3.5 py-1.5 rounded-full">FAQs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Everything you need to know about Day Execution Pro.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-bold text-gray-900">{faq.question}</span>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to execute your plans?</h2>
          <p className="text-gray-600 text-lg">
            Join thousands of high-agency operators who have transformed their productivity systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link 
              to="/login"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-base font-bold bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-600/20"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/day-execution-pro/docs"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-base font-semibold bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl transition-all border border-gray-300 hover:border-gray-400 shadow-sm"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Day Execution Pro</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 Day Execution Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Helper component for the plus button
const PlusButton = () => (
  <button className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
    <ArrowUpRight className="w-3 h-3 text-gray-300" />
  </button>
);

export default DayExecutionProLanding;
