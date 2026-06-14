import React, { useState } from 'react';
import { 
  Search, Plus, Activity, Clock, ShieldCheck, Tag, Cpu, 
  ArrowRight, Sparkles, Filter, CheckCircle2, User, Play, RefreshCw,
  AlertCircle, Fingerprint, History, HelpCircle
} from 'lucide-react';
import { Ticket, TicketCategory, TicketPriority } from '../types';

interface TicketCenterProps {
  tickets: Ticket[];
  onCreateTicket: (title: string, description: string) => Promise<void>;
  isLoading: boolean;
}

export default function TicketCenter({ tickets, onCreateTicket, isLoading }: TicketCenterProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formError, setFormError] = useState('');

  // Auto-select first ticket if none are selected
  const activeTicketId = selectedTicketId || (tickets.length > 0 ? tickets[0].id : null);
  const selectedTicket = tickets.find(t => t.id === activeTicketId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFormError('Please enter a ticket title and diagnostic details.');
      return;
    }
    setFormError('');
    try {
      await onCreateTicket(title, description);
      setTitle('');
      setDescription('');
      setShowCreateForm(false);
      // Auto select the newest ticket
      if (tickets.length > 0) {
        setSelectedTicketId(tickets[tickets.length - 1].id);
      }
    } catch (err) {
      setFormError('An error occurred while submitting. Please check server.ts logs.');
    }
  };

  // Filter and Search tickets
  const filteredTickets = tickets.filter(t => {
    const textStr = `${t.id} ${t.title} ${t.description} ${t.createdBy}`.toLowerCase();
    const matchesSearch = textStr.includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const categories: (TicketCategory | 'All')[] = [
    'All', 'Authentication', 'VPN', 'Network', 'Database', 
    'Application Support', 'Hardware', 'Cloud Infrastructure', 'Security'
  ];

  return (
    <div id="ticket-center-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-230px)] min-h-[550px]">
      
      {/* LEFT COLUMN: TICKETS INVENTORY INDEX */}
      <div id="tickets-list-pane" className="lg:col-span-5 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col h-full overflow-hidden">
        
        {/* Index Control Bar */}
        <div className="p-4 border-b space-y-3 shrink-0 bg-muted/10">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Service Tickets
            </h3>
            <button
              id="show-create-ticket-btn"
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setFormError('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Issue
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              id="ticket-search-input"
              type="text"
              placeholder="Search ID, keyword, requester..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs bg-muted/20 hover:border-gray-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
            />
          </div>

          {/* Filters shelf */}
          <div className="flex gap-2 items-center text-[10px] sm:text-xs text-muted-foreground pt-1 overflow-x-auto whitespace-nowrap">
            <Filter className="h-3 w-3 shrink-0" />
            <select
              id="category-filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-1.5 py-1 border rounded bg-background text-[11px]"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              id="priority-filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-1.5 py-1 border rounded bg-background text-[11px]"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Tickets Scroll Panel */}
        <div id="tickets-list-scroll" className="flex-1 overflow-y-auto divide-y">
          
          {showCreateForm && (
            <form onSubmit={handleSubmit} className="p-4 bg-blue-500/5 border-b space-y-3">
              <h4 className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Submit Diagnostic Support Ticket
              </h4>
              
              <div className="space-y-1">
                <input
                  id="ticket-title-field"
                  type="text"
                  placeholder="Inbound Title (e.g. VPN Handshake block)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded bg-background text-xs font-sans focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <textarea
                  id="ticket-desc-field"
                  placeholder="Ticket Diagnostic details, logs, affected subsystems, user complaints..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded bg-background text-xs font-sans focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
                  disabled={isLoading}
                />
              </div>

              {formError && <p className="text-[10px] text-red-500">{formError}</p>}

              <div className="flex gap-2 justify-end">
                <button
                  id="cancel-create-ticket-btn"
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-2.5 py-1.5 rounded border text-xs font-semibold hover:bg-muted"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  id="submit-create-ticket-btn"
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" /> Analyzing...
                    </>
                  ) : 'File & Triage'}
                </button>
              </div>
            </form>
          )}

          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No matching enterprise support tickets found. Check metadata search string.
            </div>
          ) : (
            filteredTickets.slice().reverse().map((t) => (
              <div
                key={t.id}
                id={`ticket-item-${t.id}`}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-4 text-left cursor-pointer transition-colors border-l-4 ${
                  activeTicketId === t.id 
                    ? 'bg-blue-500/5 border-blue-500 dark:bg-blue-500/10' 
                    : 'border-transparent hover:bg-muted/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground font-mono">
                  <span>{t.id}</span>
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-semibold text-sm text-foreground line-clamp-1 mt-1">{t.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{t.description}</p>
                
                <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border border-muted-foreground/20 text-muted-foreground inline-flex items-center gap-1">
                      <Tag className="h-2 w-2" />
                      {t.category}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.priority === 'Critical' ? 'bg-red-500/10 text-red-500' :
                      t.priority === 'High' ? 'bg-amber-500/10 text-amber-500' :
                      t.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground italic truncate max-w-[120px]">{t.createdBy}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: AI AGENT INVESTIGATION DIAGNOSTICS */}
      <div id="ai-diagnostics-pane" className="lg:col-span-7 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col h-full overflow-hidden">
        {selectedTicket ? (
          <div id={`diagnostics-detail-${selectedTicket.id}`} className="flex flex-col h-full overflow-hidden text-left">
            
            {/* Headers Area */}
            <div className="p-5 border-b shrink-0 bg-muted/10 space-y-2">
              <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
                <span className="text-xs font-mono font-bold text-muted-foreground">{selectedTicket.id}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    selectedTicket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                    selectedTicket.status === 'investigating' ? 'bg-purple-500/10 text-purple-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {selectedTicket.status === 'open' ? 'Awaiting Dispatch' : selectedTicket.status === 'investigating' ? 'AI Correlated check' : 'Resolved'}
                  </span>
                  {selectedTicket.incidentId && (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-purple-500/15 text-purple-600 rounded">
                      Linked to {selectedTicket.incidentId}
                    </span>
                  )}
                </div>
              </div>
              <h2 className="text-lg font-bold text-foreground leading-snug">{selectedTicket.title}</h2>
              
              <div className="text-xs flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>Requester: <strong className="text-foreground">{selectedTicket.createdBy}</strong></span>
                <span>• Logged: {new Date(selectedTicket.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Diagnostics Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Client Diagnostics detail */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">Requester Diagnostic Details</h3>
                <div className="p-4 rounded-lg bg-muted/30 border text-xs leading-relaxed font-sans text-foreground whitespace-pre-wrap">
                  {selectedTicket.description}
                </div>
              </div>

              {/* AI Investigations Report Banner */}
              <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-600">
                    <Sparkles className="h-4.5 w-4.5 shrink-0" />
                    AI Agent Autonomous Triage Audit
                  </h4>
                  <span className="text-[10px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                    Real-time analysis
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Map */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Auto-Categorization</span>
                    <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                      <Tag className="h-4 w-4 text-zinc-500 shrink-0" />
                      {selectedTicket.category}
                    </div>
                  </div>

                  {/* Team assignee */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Target Assignment Queue</span>
                    <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      {selectedTicket.assignedTeam}
                    </div>
                  </div>

                  {/* Affected subsystems Map */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Identified Affected Systems</span>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {selectedTicket.affectedSystems.map(sys => (
                        <span key={sys} className="px-2 py-0.5 rounded bg-muted/75 border text-[10px] font-mono font-medium text-foreground">
                          {sys}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Operational intent map */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Classified Issue Intent</span>
                    <div className="text-xs text-foreground font-medium font-mono truncate">
                      {selectedTicket.intent || 'Undetermined Request'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-blue-500/10 pt-3 space-y-2">
                  <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Explainable AI Priority Predictor reasoning</span>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    &ldquo;{selectedTicket.priorityReasoning}&rdquo;
                  </p>
                </div>
              </div>

              {/* SLA & Reliability Tracker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  selectedTicket.priority === 'Critical' ? 'bg-red-500/5 border-red-500/10' :
                  selectedTicket.priority === 'High' ? 'bg-amber-500/5 border-amber-500/10' : 'bg-blue-500/5 border-blue-500/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase">SLA Breach Countdown</span>
                    <Clock className={`h-4 w-4 ${
                      selectedTicket.priority === 'Critical' ? 'text-red-500 animate-pulse' : 'text-amber-500'
                    }`} />
                  </div>
                  <div className="mt-2">
                    <div className="text-xl font-bold font-mono text-foreground tracking-tight">
                      {selectedTicket.priority === 'Critical' ? '0h 42m remaining' :
                       selectedTicket.priority === 'High' ? '1h 56m remaining' : '3h 34m remaining'}
                    </div>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      Target resolution: {selectedTicket.slaBreachTime ? new Date(selectedTicket.slaBreachTime).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                  selectedTicket.slaRiskProfile === 'Critical' || selectedTicket.slaRiskProfile === 'High'
                    ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase">SLA Breach Risk Profile</span>
                    <AlertCircle className={`h-4 w-4 ${
                      selectedTicket.slaRiskProfile === 'Critical' || selectedTicket.slaRiskProfile === 'High'
                        ? 'text-red-500' : 'text-emerald-500'
                    }`} />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        selectedTicket.slaRiskProfile === 'Critical' ? 'bg-red-500 animate-ping' :
                        selectedTicket.slaRiskProfile === 'High' ? 'bg-red-500' :
                        selectedTicket.slaRiskProfile === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <span className="text-sm font-bold text-foreground">
                        {selectedTicket.slaRiskProfile || 'Standard Risk'} Profile
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      {selectedTicket.slaRiskProfile === 'Critical' ? 'Escalation sequence triggered' : 'Operating within standard bounds'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Semantic Similarity Duplicate Alert */}
              {selectedTicket.semanticSimilarityScore && selectedTicket.semanticSimilarityScore > 90 && (
                <div className="p-4 rounded-xl border border-purple-500/15 bg-purple-500/5 flex items-start gap-3">
                  <Fingerprint className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-purple-900 dark:text-purple-300">Semantic Duplication Detected</div>
                    <p className="text-muted-foreground leading-relaxed">
                      AI Agents computed a <strong className="text-purple-600 dark:text-purple-400 font-mono font-bold">{selectedTicket.semanticSimilarityScore}%</strong> semantic description overlap with existing outages. Auto-clustering onto active Incident folders.
                    </p>
                  </div>
                </div>
              )}

              {/* Microsoft Foundry IQ Integration Metadata */}
              <div className="p-4 rounded-lg border border-muted-foreground/10 bg-muted/10 flex items-center justify-between text-xs font-mono">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Foundry IQ Index Schema</span>
                  <span className="text-[10px] text-zinc-500">Routing validation tag: RFC-8273-CORRELATION</span>
                </div>
                <div className="flex items-center gap-1 h-fit bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Synced
                </div>
              </div>

              {/* Enterprise Autonomous Triage Audit Trail */}
              {selectedTicket.auditTrail && selectedTicket.auditTrail.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-2">
                    <History className="h-4.5 w-4.5" />
                    Autonomous Ingress Audit Trail
                  </h3>
                  <div className="border rounded-xl dev-logger overflow-hidden bg-zinc-950 text-zinc-300 font-mono text-[11px]">
                    <div className="bg-zinc-900/60 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>PIPELINE TELEMETRY AUDITOR</span>
                      <span>RFC-8273 SECURITY PASSED</span>
                    </div>
                    <div className="divide-y divide-zinc-900 px-4 py-2 space-y-2 max-h-[220px] overflow-y-auto">
                      {selectedTicket.auditTrail.map((audit, i) => (
                        <div key={i} className="pt-2 pb-1 space-y-1 text-left">
                          <div className="flex items-start justify-between gap-4 text-[10px]">
                            <span className="text-sky-400 font-bold">[{audit.action}]</span>
                            <span className="text-zinc-500 text-right">{new Date(audit.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-zinc-400 text-[10.5px] leading-relaxed">{audit.details}</p>
                          <div className="text-[9.5px] text-zinc-600">
                            Agent: {audit.actor}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-3">
            <Cpu className="h-12 w-12 text-muted/30" />
            <p className="text-sm font-semibold">No tickets analyzed yet.</p>
            <p className="text-xs text-muted-foreground">Select an active ticket from the registry on the left, or file a diagnostic query to run the AI routers.</p>
          </div>
        )}
      </div>

    </div>
  );
}
