import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  AlertTriangle, CheckCircle2, Clock, Users, Activity, Target, ShieldAlert
} from 'lucide-react';
import { Ticket, IncidentCluster, TeamInfo } from '../types';

interface OverviewDashboardProps {
  tickets: Ticket[];
  incidents: IncidentCluster[];
  teams: TeamInfo[];
  analytics: any;
  onNavigate: (tab: string) => void;
}

export default function OverviewDashboard({ 
  tickets, 
  incidents, 
  teams, 
  analytics,
  onNavigate 
}: OverviewDashboardProps) {
  const { metrics, dailyDistribution, categoryDistribution } = analytics;

  // Key performance cards
  const cards = [
    {
      id: 'metric-total',
      title: 'Total Tickets',
      value: metrics?.totalTickets || 0,
      description: 'Logged in cluster database',
      icon: Activity,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'metric-open',
      title: 'Active Tickets',
      value: metrics?.openTickets || 0,
      description: 'Awaiting SLA resolution',
      icon: Clock,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'metric-critical',
      title: 'Critical Outages',
      value: metrics?.criticalTickets || 0,
      description: 'Requires immediate triage',
      icon: AlertTriangle,
      color: (metrics?.criticalTickets || 0) > 0 
        ? 'text-red-500 bg-red-500/10 border-red-500/20 animate-pulse' 
        : 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    },
    {
      id: 'metric-incidents',
      title: 'Open Incident Clusters',
      value: metrics?.openIncidents || 0,
      description: 'AI correlated fault groups',
      icon: ShieldAlert,
      color: (metrics?.openIncidents || 0) > 0 
        ? 'text-purple-500 bg-purple-500/10 border-purple-500/20'
        : 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#10b981', '#6366f1', '#14b8a6', '#6b7280'];

  const criticalIncidentCount = incidents.filter(inc => inc.status !== 'resolved' && inc.priority === 'Critical').length;

  return (
    <div id="overview-dashboard-root" className="space-y-6">
      
      {/* Real-time SLA breach prediction alert */}
      {criticalIncidentCount > 0 && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3 text-left animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-red-955 dark:text-red-300 flex items-center gap-1.5">
              <span>SLA BREACH ALERT: Active High-Priority Service Degradations</span>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Autonomous triage agents isolated <strong>{criticalIncidentCount} active critical incident cluster(s)</strong> approaching breach thresholds. Directory services replication lag is threatening 140+ active remote staff SSO federations. Remediation runbooks have been dispatched to active queues.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Banner */}
      <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={card.id} 
              id={card.id}
              className={`p-5 rounded-xl border bg-card text-card-foreground shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md ${card.color.split(' ')[2]}`}
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{card.title}</span>
                <div className="text-3xl font-bold font-mono tracking-tight">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.color.split(' ')[1]}`}>
                <IconComponent className={`h-6 w-6 ${card.color.split(' ')[0]}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Graph Row */}
      <div id="analytics-charts-row" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Incident Traffic */}
        <div id="chart-traffic-card" className="lg:col-span-2 p-5 rounded-xl border bg-card text-card-foreground shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base">Incident & Resolution Traffic</h3>
              <p className="text-xs text-muted-foreground">Historical 7-day rolling performance metrics</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block"></span>Submitted</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span>Resolved</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradientResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
                <XAxis dataKey="date" tickLine={false} className="text-xs" stroke="#888888" />
                <YAxis tickLine={false} className="text-xs" stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  labelClassName="text-xs font-semibold text-foreground"
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="ticketsSubmitted" name="Tickets Logged" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#gradientSubmitted)" />
                <Area type="monotone" dataKey="incidentsResolved" name="Tickets Fixed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gradientResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div id="chart-categories-card" className="p-5 rounded-xl border bg-card text-card-foreground shadow-sm space-y-4">
          <div>
            <h3 className="font-semibold text-base">Fault Categories</h3>
            <p className="text-xs text-muted-foreground">Issue spread across enterprise taxonomy</p>
          </div>
          <div className="h-64 w-full flex flex-col justify-between">
            {categoryDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No active categorization data.
              </div>
            ) : (
              <>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
                      <XAxis dataKey="name" tickLine={false} className="text-xs" stroke="#888888" tickFormatter={(v) => v.slice(0, 5) + '...'} />
                      <YAxis tickLine={false} className="text-xs" stroke="#888888" allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Bar dataKey="value" name="Tickets">
                        {categoryDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legends list */}
                <div className="grid grid-cols-2 gap-1 text-[10px] pt-2 border-t border-muted/20">
                  {categoryDistribution.slice(0, 6).map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center gap-1.5 text-muted-foreground truncate">
                      <span className="h-2 w-2 rounded-full inline-block shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="truncate">{entry.name}: <strong className="text-foreground">{entry.value}</strong></span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Team Ownership and Target Action Grid */}
      <div id="team-analytics-row" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Critical Active Clusters Callout */}
        <div id="active-incidents-callout" className="md:col-span-2 p-5 rounded-xl border bg-card text-card-foreground shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-purple-500 shrink-0" />
                Active Correlated Outages
              </h3>
              <p className="text-xs text-muted-foreground">Aggregated incidents requiring cross-team intervention</p>
            </div>
            <button 
              id="view-all-incidents-btn"
              onClick={() => onNavigate('incidents')} 
              className="text-xs text-blue-500 hover:underline font-medium"
            >
              Resolve Clusters &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {incidents.filter(inc => inc.status !== 'resolved').length === 0 ? (
              <div className="border border-dashed border-muted/30 rounded-lg p-8 text-center text-muted-foreground space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                <p className="text-sm font-medium">All systems green.</p>
                <p className="text-xs text-muted-foreground">No active correlated incident clusters detected by the AI agent.</p>
              </div>
            ) : (
              incidents.filter(inc => inc.status !== 'resolved').slice(0, 3).map((inc) => (
                <div 
                  key={inc.id}
                  id={`cluster-${inc.id}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 border border-muted/40 transition-all gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-muted-foreground">{inc.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inc.priority === 'Critical' ? 'bg-red-500/10 text-red-500' :
                        inc.priority === 'High' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {inc.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">• Assigned to <strong className="text-foreground">{inc.assignedTeam}</strong></span>
                    </div>
                    <h4 className="font-semibold text-sm text-foreground">{inc.title}</h4>
                    <span className="text-xs text-muted-foreground line-clamp-1">{inc.summary}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">AI Confidence</span>
                      <strong className="text-sm text-purple-500 font-mono">{inc.rootCauseAnalysis?.confidence || 90}%</strong>
                    </div>
                    <button 
                      id={`inspect-cluster-${inc.id}`}
                      onClick={() => onNavigate('incidents')}
                      className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs font-semibold hover:opacity-80 transition"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Team Ownership Metrics */}
        <div id="team-workloads-card" className="p-5 rounded-xl border bg-card text-card-foreground shadow-sm space-y-4">
          <div>
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Team Resolution SLA
            </h3>
            <p className="text-xs text-muted-foreground">Active team workloads & speed indicators</p>
          </div>
          <div className="space-y-3 h-[250px] overflow-y-auto pr-1">
            {teams.map((t) => (
              <div 
                key={t.name}
                id={`team-${t.name.toLowerCase().replace(/\s+/g, '-')}`} 
                className="flex items-center justify-between p-2.5 rounded-lg border border-muted/20 hover:bg-muted/10 transition-colors"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold">{t.name}</h4>
                  <p className="text-[10px] text-muted-foreground">Lead: {t.lead}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Queue</span>
                    <strong className={`text-xs font-mono font-bold ${t.ticketCount > 0 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                      {t.ticketCount} active
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Avg SLA</span>
                    <strong className="text-xs font-mono block text-neutral-800 dark:text-white">{t.averageResponseHours}h</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
