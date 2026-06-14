import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Activity, Clock, ShieldAlert, BookOpen, Sliders, Sun, Moon, 
  HelpCircle, RefreshCw, Sparkles, CheckCircle2, User, Globe
} from 'lucide-react';
import { Ticket, IncidentCluster, TeamInfo, DashboardMetrics } from './types';

// Importing sub-views
import OverviewDashboard from './components/OverviewDashboard';
import TicketCenter from './components/TicketCenter';
import IncidentDesk from './components/IncidentDesk';
import KnowledgeHub from './components/KnowledgeHub';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [incidents, setIncidents] = useState<IncidentCluster[]>([]);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    metrics: { totalTickets: 0, openTickets: 0, criticalTickets: 0, openIncidents: 0, resolutionRate: 100, avgResolutionTimeHours: 1.4 },
    dailyDistribution: [],
    categoryDistribution: [],
    teamWorkloads: []
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  // Synchronize data from the Express Rest API
  const fetchData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [ticketsRes, incidentsRes, teamsRes, analyticsRes, kbRes] = await Promise.all([
        fetch('/api/v1/tickets'),
        fetch('/api/v1/incidents'),
        fetch('/api/v1/teams'),
        fetch('/api/v1/analytics'),
        fetch('/api/v1/knowledge-base')
      ]);

      if (ticketsRes.ok && incidentsRes.ok && teamsRes.ok && analyticsRes.ok && kbRes.ok) {
        const ticketsData = await ticketsRes.json();
        const incidentsData = await incidentsRes.json();
        const teamsData = await teamsRes.json();
        const analyticsData = await analyticsRes.json();
        const kbData = await kbRes.json();

        setTickets(ticketsData);
        setIncidents(incidentsData);
        setTeams(teamsData);
        setAnalytics(analyticsData);
        setKnowledgeBase(kbData);
      }
    } catch (err) {
      console.error('Error fetching API core parameters:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh SLA tallies silently every 10 seconds
    const interval = setInterval(() => fetchData(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Submit Ticket Action
  const handleCreateTicket = async (title: string, description: string) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/v1/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, createdBy: 'akhil@enterprise.com' })
      });
      if (response.ok) {
        const newTicket = await response.json();
        triggerToast(`Ticket ${newTicket.id} Auto-Routed to ${newTicket.assignedTeam}!`, 'success');
        await fetchData(true);
      } else {
        triggerToast('Failed to analyze and route support request.', 'alert');
      }
    } catch (err) {
      triggerToast('Server Connection Outage during routing.', 'alert');
    } finally {
      setActionLoading(false);
    }
  };

  // Resolve Incident Action
  const handleResolveIncident = async (id: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/v1/incidents/${id}/resolve`, {
        method: 'POST'
      });
      if (response.ok) {
        triggerToast(`Incident Cluster ${id} successfully mitigated & closed!`, 'success');
        await fetchData(true);
      } else {
        triggerToast('Failed to resolve cluster incident.', 'alert');
      }
    } catch (err) {
      triggerToast('Server connection error.', 'alert');
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger Demo Scenario Action
  const handleTriggerDemoScenario = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/v1/demo/trigger', {
        method: 'POST'
      });
      if (response.ok) {
        triggerToast('9-Step Hackathon Scenario Seeding Initiated!', 'success');
        await fetchData();
      } else {
        triggerToast('Error loading walkthough scenario parameters.', 'alert');
      }
    } catch (err) {
      triggerToast('Server offline.', 'alert');
    } finally {
      setActionLoading(false);
    }
  };

  // Search Knowledge Base Action
  const handleSearchKnowledgeBase = async (query: string) => {
    try {
      const response = await fetch('/api/v1/knowledge-base/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'tickets', label: 'Ticketing Portal', icon: Clock },
    { id: 'incidents', label: 'Incident Clusters', icon: ShieldAlert },
    { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
    { id: 'admin', label: 'Admin Center', icon: Sliders }
  ];

  return (
    <div id="master-container" className={`${isDark ? 'dark' : ''} min-h-screen flex flex-col font-sans transition-colors duration-200 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50`}>
      
      {/* ENTERPRISE APP HEADER BAR */}
      <header id="enterprise-header" className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 backdrop-blur-md px-6 py-4 shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">IncidentIQ</h1>
            <span className="text-[10px] text-muted-foreground font-mono leading-none tracking-wider block uppercase">IT Operations Agent Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Action Trigger */}
          <button 
            id="global-refresh-btn"
            onClick={() => fetchData()}
            className="p-2 border rounded-lg hover:bg-muted text-muted-foreground transition duration-150"
            title="Refresh System Workspace State"
            disabled={isLoading || actionLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Theme Shift Switch */}
          <button 
            id="theme-toggler"
            onClick={() => setIsDark(!isDark)}
            className="p-2 border rounded-lg hover:bg-muted text-muted-foreground transition duration-150"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-blue-600" />
            )}
          </button>

          {/* User profile identifier mock */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
            <div className="h-8 w-8 rounded-full bg-muted border flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold leading-tight text-foreground">A. Mishra</p>
              <p className="text-[9px] text-muted-foreground font-mono leading-tight">Tier 3 Lead Engineer</p>
            </div>
          </div>
        </div>
      </header>

      {/* CORE FRAMEWORK GRID AREA */}
      <div id="workspace-layout" className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden">
        
        {/* SIDEBAR NAVIGATION RAIL */}
        <aside id="sidebar-rail" className="border-b md:border-b-0 md:border-r bg-background w-full md:w-56 shrink-0 flex flex-row md:flex-col p-2 md:p-3 gap-1 md:gap-1.5 overflow-x-auto md:overflow-x-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all duration-150 select-none shrink-0 text-left ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.label}</span>
                {item.id === 'incidents' && incidents.filter(i => i.status !== 'resolved').length > 0 && (
                  <span className={`ml-auto shrink-0 flex h-2 w-2 rounded-full ${isActive ? 'bg-white' : 'bg-red-500'}`} />
                )}
              </button>
            );
          })}
          
          <div className="hidden md:block mt-auto border-t pt-4 p-2 space-y-2">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-wider">
              <Globe className="h-3.5 w-3.5" />
              SLA Compliance
            </div>
            <div className="text-xs font-semibold text-foreground">98.4% On-Target</div>
            <div className="w-full bg-muted rounded-full h-1">
              <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '98.4%' }}></div>
            </div>
          </div>
        </aside>

        {/* WORKSPACE APPLET SURFACE */}
        <main id="applet-viewport" className="flex-1 overflow-hidden p-6 bg-slate-50/50 dark:bg-zinc-950/20">
          
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <p className="text-xs font-mono text-muted-foreground">Contacting PostgreSQL DB clusters...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {activeTab === 'overview' && (
                  <OverviewDashboard 
                    tickets={tickets} 
                    incidents={incidents} 
                    teams={teams}
                    analytics={analytics} 
                    onNavigate={setActiveTab}
                  />
                )}
                
                {activeTab === 'tickets' && (
                  <TicketCenter 
                    tickets={tickets} 
                    onCreateTicket={handleCreateTicket}
                    isLoading={actionLoading}
                  />
                )}

                {activeTab === 'incidents' && (
                  <IncidentDesk 
                    incidents={incidents} 
                    tickets={tickets}
                    onResolveIncident={handleResolveIncident}
                    isLoading={actionLoading}
                  />
                )}

                {activeTab === 'knowledge' && (
                  <KnowledgeHub 
                    documents={knowledgeBase} 
                    onSearch={handleSearchKnowledgeBase}
                  />
                )}

                {activeTab === 'admin' && (
                  <AdminPanel 
                    teams={teams} 
                    tickets={tickets} 
                    incidents={incidents} 
                    onTriggerDemoScenario={handleTriggerDemoScenario}
                    isLoading={actionLoading}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}

        </main>
      </div>

      {/* TOAST NOTIFIER FLOATER */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="toast-notifier"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 border rounded-xl shadow-lg bg-background text-foreground shrink-0 max-w-sm"
          >
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
