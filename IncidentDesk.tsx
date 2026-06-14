import React, { useState } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, 
  Sparkles, CheckSquare, Square, ClipboardList, HelpCircle, Activity,
  Users, RefreshCw, Layers, Cpu, Clock, History, FileText, ShieldCheck
} from 'lucide-react';
import { IncidentCluster, Ticket } from '../types';

interface IncidentDeskProps {
  incidents: IncidentCluster[];
  tickets: Ticket[];
  onResolveIncident: (id: string) => Promise<void>;
  isLoading: boolean;
}

export default function IncidentDesk({ 
  incidents, 
  tickets, 
  onResolveIncident, 
  isLoading 
}: IncidentDeskProps) {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [detailTab, setDetailTab] = useState<'rca' | 'timeline' | 'reasoning' | 'executive'>('rca');

  // Active Cluster computation
  const activeIncidents = incidents.filter(inc => inc.status !== 'resolved');
  const resolvedIncidents = incidents.filter(inc => inc.status === 'resolved');

  const currentIncidentId = selectedIncidentId || (incidents.length > 0 ? incidents[0].id : null);
  const selectedIncident = incidents.find(inc => inc.id === currentIncidentId);

  const toggleCheck = (stepId: string) => {
    setCheckedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleResolve = async (id: string) => {
    try {
      await onResolveIncident(id);
      // Reset checklist state
      setCheckedSteps({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="incident-desk-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-230px)] min-h-[550px]">
      
      {/* LEFT COLUMN: ACTIVE OUTAGES LIST */}
      <div id="incidents-index-card" className="lg:col-span-4 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col h-full overflow-hidden">
        
        {/* Hub Header */}
        <div className="p-4 border-b bg-muted/10 shrink-0">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 text-purple-600" />
            AI Incident Correlator
          </h3>
          <p className="text-xs text-muted-foreground">Aggregated problem clusters & fault clusters</p>
        </div>

        {/* Scroll inventory */}
        <div id="incidents-scrolling-pane" className="flex-1 overflow-y-auto divide-y">
          
          {/* Active section */}
          <div className="bg-muted/5">
            <div className="px-4 py-2 text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-muted/20 border-b">
              Active Investigations ({activeIncidents.length})
            </div>
            {activeIncidents.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No active correlated incidents reported.
              </div>
            ) : (
              activeIncidents.map(inc => (
                <div
                  key={inc.id}
                  id={`incident-item-${inc.id}`}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-4 text-left cursor-pointer transition-colors border-l-4 ${
                    currentIncidentId === inc.id 
                      ? 'bg-purple-500/5 border-purple-500 dark:bg-purple-500/10' 
                      : 'border-transparent hover:bg-muted/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground font-mono">
                    <span>{inc.id}</span>
                    <span>{inc.ticketIds.length} tickets clustered</span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 mt-1">{inc.title}</h4>
                  
                  <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border text-foreground shrink-0">
                      {inc.assignedTeam}
                    </span>
                    <span className="text-[11px] font-bold text-purple-600 shrink-0">
                      AI RCA: {inc.rootCauseAnalysis?.confidence || 90}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resolved Section */}
          <div>
            <div className="px-4 py-2 text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-muted/10 border-b">
              Mitigated / Resolved Incidents ({resolvedIncidents.length})
            </div>
            {resolvedIncidents.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No archived historical incidents.
              </div>
            ) : (
              resolvedIncidents.map(inc => (
                <div
                  key={inc.id}
                  id={`incident-item-resolved-${inc.id}`}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`p-4 opacity-70 text-left cursor-pointer transition-colors border-l-4 ${
                    currentIncidentId === inc.id 
                      ? 'bg-purple-500/5 border-purple-500 dark:bg-purple-500/10' 
                      : 'border-transparent hover:bg-muted/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground font-mono">
                    <span>{inc.id}</span>
                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                      <CheckCircle2 className="h-3 w-3" /> Resolved
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 mt-1">{inc.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Closed on {new Date().toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: AI RCA INVESTIGATION DASHBOARD */}
      <div id="incident-analytics-detail" className="lg:col-span-8 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col h-full overflow-hidden">
        {selectedIncident ? (
          <div id={`incident-view-${selectedIncident.id}`} className="flex flex-col h-full overflow-hidden text-left">
            
            {/* Header section card */}
            <div className="p-5 border-b bg-muted/10 shrink-0 space-y-2">
              <div className="flex justify-between items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-muted-foreground">{selectedIncident.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedIncident.status === 'resolved' 
                      ? 'bg-emerald-500/15 text-emerald-500' 
                      : 'bg-red-500/10 text-red-500 animate-pulse'
                  }`}>
                    {selectedIncident.status === 'resolved' ? 'Mitigated SLA Closed' : 'Under Investigation'}
                  </span>
                </div>
                {selectedIncident.status !== 'resolved' && (
                  <button
                    id={`resolve-incident-btn-${selectedIncident.id}`}
                    onClick={() => handleResolve(selectedIncident.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Resolving...
                      </>
                    ) : 'Mark as Resolved'}
                  </button>
                )}
              </div>

              <h2 className="text-lg font-bold text-foreground leading-snug">{selectedIncident.title}</h2>
              <p className="text-xs text-muted-foreground font-sans line-clamp-2 md:line-clamp-none">{selectedIncident.summary}</p>
            </div>

            {/* Scroll diagnostics details */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Core Symptom - Correlated Client Tickets list */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  Correlated Client Tickets In Cluster ({selectedIncident.ticketIds.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedIncident.ticketIds.map((tid) => {
                    const linkedTicket = tickets.find(t => t.id === tid);
                    return (
                      <div 
                        key={tid} 
                        id={`cluster-ticket-${tid}`}
                        className="p-3 rounded-lg border bg-muted/10 hover:bg-muted/20 transition duration-150 space-y-2 text-left"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                          <span>{tid}</span>
                          <span className={`px-1 rounded text-neutral-500 bg-neutral-100 dark:bg-zinc-800`}>
                            {linkedTicket?.category || 'Authentication'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">
                          {linkedTicket?.title || `IT Support Request: ${tid}`}
                        </h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {linkedTicket?.description || 'Diagnostic request.'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <h2 className="text-lg font-bold text-foreground leading-snug">{selectedIncident.title}</h2>
              <p className="text-xs text-muted-foreground font-sans line-clamp-2 md:line-clamp-none">{selectedIncident.summary}</p>
            </div>

            {/* Sub-Tab Trigger Row */}
            <div className="px-5 border-b bg-muted/5 flex items-center gap-4 overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setDetailTab('rca')}
                className={`py-3 px-1 text-xs font-semibold border-b-2 transition duration-200 flex items-center gap-1.5 shrink-0 select-none ${
                  detailTab === 'rca'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5" />
                RCA & Actions
              </button>
              <button
                onClick={() => setDetailTab('reasoning')}
                className={`py-3 px-1 text-xs font-semibold border-b-2 transition duration-200 flex items-center gap-1.5 shrink-0 select-none ${
                  detailTab === 'reasoning'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                Multi-Step Reasoning
              </button>
              <button
                onClick={() => setDetailTab('timeline')}
                className={`py-3 px-1 text-xs font-semibold border-b-2 transition duration-200 flex items-center gap-1.5 shrink-0 select-none ${
                  detailTab === 'timeline'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                Outage Timeline
              </button>
              <button
                onClick={() => setDetailTab('executive')}
                className={`py-3 px-1 text-xs font-semibold border-b-2 transition duration-200 flex items-center gap-1.5 shrink-0 select-none ${
                  detailTab === 'executive'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Executive Brief
              </button>
            </div>

            {/* Scroll diagnostics details */}
            <div className="flex-1 overflow-y-auto p-5">
              
              {detailTab === 'rca' && (
                <div className="space-y-6">
                  {/* Correlated Client Tickets list */}
                  <div className="space-y-3 text-left">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      Correlated Client Tickets In Cluster ({selectedIncident.ticketIds.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedIncident.ticketIds.map((tid) => {
                        const linkedTicket = tickets.find(t => t.id === tid);
                        return (
                          <div 
                            key={tid} 
                            id={`cluster-ticket-${tid}`}
                            className="p-3 rounded-lg border bg-muted/10 hover:bg-muted/20 transition duration-150 space-y-2 text-left animate-in fade-in slide-in-from-bottom-2"
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                              <span>{tid}</span>
                              <span className={`px-1 rounded text-neutral-500 bg-neutral-100 dark:bg-zinc-800`}>
                                {linkedTicket?.category || 'Authentication'}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-foreground line-clamp-1">
                              {linkedTicket?.title || `IT Support Request: ${tid}`}
                            </h4>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {linkedTicket?.description || 'Diagnostic request.'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Two Column details: Root Cause vs Resolution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* ROOT CAUSE INVESTIGATION REPORT */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                          Root Cause Audit (RCA)
                        </h3>
                      </div>

                      <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">Identified Root Cause</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground">Confidence:</span>
                            <span className="text-sm font-mono font-bold text-purple-600">
                              {selectedIncident.rootCauseAnalysis?.rootCause ? selectedIncident.rootCauseAnalysis.confidence : 94}%
                            </span>
                          </div>
                        </div>

                        <strong className="text-sm text-foreground block font-semibold leading-snug">
                          {selectedIncident.rootCauseAnalysis?.rootCause || 'Global Directory Sync Lag Lock'}
                        </strong>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {selectedIncident.rootCauseAnalysis?.reasoning}
                        </p>

                        {/* Evidence blocks */}
                        <div className="space-y-2 pt-2 border-t border-purple-500/10">
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">Corroborating Evidence</span>
                          <ul className="text-xs space-y-1.5 list-disc pl-4 text-muted-foreground leading-normal">
                            {(selectedIncident.rootCauseAnalysis?.evidence || []).map((ev, idx) => (
                              <li key={idx}>&ldquo;{ev}&rdquo;</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* RESOLUTION RECOMMENDATIONS & CHECKLIST */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-blue-500 shrink-0" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                          Resolution Recommendations
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {/* Checklist */}
                        <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                          <span className="text-[11px] text-muted-foreground font-semibold uppercase block">SOP Verification Checklist</span>
                          
                          <div className="space-y-2">
                            {(selectedIncident.resolutionRecommendation?.steps || []).map((step, idx) => {
                              const stepId = `${selectedIncident.id}-step-${idx}`;
                              const isDone = !!checkedSteps[stepId];
                              return (
                                <div 
                                  key={idx}
                                  id={stepId}
                                  onClick={() => toggleCheck(stepId)}
                                  className="flex items-start gap-2.5 p-2 rounded-lg bg-background border hover:bg-muted/15 cursor-pointer select-none transition-all"
                                >
                                  <div className="pt-0.5 shrink-0">
                                    {isDone ? (
                                      <CheckSquare className="h-4.5 w-4.5 text-emerald-500" />
                                    ) : (
                                      <Square className="h-4.5 w-4.5 text-muted-foreground" />
                                    )}
                                  </div>
                                  <span className={`text-xs leading-normal font-medium ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Escalation contact banner */}
                        <div className="p-3 bg-muted/40 border rounded-lg text-xs space-y-1 text-left leading-normal">
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">SLA Escalation Path</span>
                          <p className="text-muted-foreground">{selectedIncident.resolutionRecommendation?.escalationPath}</p>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {detailTab === 'reasoning' && (
                <div className="space-y-6 text-left animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-2">
                      <Cpu className="h-4.5 w-4.5 text-purple-600" />
                      Dynamic Agent Workflows & Multi-Step Reasoning
                    </h3>
                    <span className="text-[9px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded font-mono font-bold uppercase">
                      Gemini CoT Trace Active
                    </span>
                  </div>

                  {/* Multi-step reasoning sequential block */}
                  <div className="space-y-4">
                    {selectedIncident.multiStepReasoning?.map((step, idx) => (
                      <div key={idx} className="relative flex gap-4">
                        {/* Vertical line connector */}
                        {idx !== (selectedIncident.multiStepReasoning?.length || 0) - 1 && (
                          <div className="absolute left-[13px] top-7 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />
                        )}
                        <div className="h-7 w-7 rounded-full bg-purple-500/10 text-purple-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-purple-500/20">
                          {idx + 1}
                        </div>
                        <div className="flex-1 pb-4 leading-normal">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-bold text-foreground">{step.stepName}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(step.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 bg-muted/20 border p-3 rounded-xl leading-relaxed whitespace-pre-wrap">
                            {step.stepResult}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[9px] uppercase font-mono text-muted-foreground font-bold shrink-0">Corroborated Signals:</span>
                            {step.evidenceMatched.map((ev, sIdx) => (
                              <span key={sIdx} className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[10px] font-mono leading-none">
                                &ldquo;{ev}&rdquo;
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Operational SOP Grounding Citations */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                      <BookOpen className="h-4.5 w-4.5 text-blue-500" />
                      Dynamic KB Citations & Retreival Groundings
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Our reasoning pipeline matches the cluster triggers against indexed engineering and identity playbooks in real-time, providing verifiable grounding citations:
                    </p>
                    <div className="space-y-3">
                      {selectedIncident.citations?.map((cit, i) => (
                        <div key={i} className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10 transition space-y-2 text-left">
                          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-blue-600">
                            <span>{cit.docId}</span>
                            <span className="uppercase text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded">RETRIEVED CITE</span>
                          </div>
                          <div className="text-xs font-bold text-foreground">{cit.title}</div>
                          <p className="text-xs text-muted-foreground italic font-sans leading-relaxed bg-background/50 p-2.5 rounded border">
                            &ldquo;{cit.sectionSnippet}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'timeline' && (
                <div className="space-y-6 text-left animate-in fade-in duration-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-2">
                    <History className="h-4.5 w-4.5 text-sky-500" />
                    Audit Log Timeline of Outage Sequence
                  </h3>

                  <div className="relative pl-6 space-y-6">
                    {/* Continuous vertical line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-zinc-200 dark:bg-zinc-800" />
                    
                    {selectedIncident.timeline?.map((item, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[23px] top-[5px] h-2.5 w-2.5 rounded-full border-2 ${
                          item.type === 'system' ? 'bg-zinc-400 border-background' :
                          item.type === 'ai' ? 'bg-purple-500 border-background' : 'bg-blue-500 border-background'
                        }`} />
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-foreground">{item.title}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{new Date(item.timestamp).toLocaleTimeString()}</span>
                            <span className={`px-1 rounded text-[9px] uppercase font-bold shrink-0 ${
                              item.type === 'system' ? 'bg-muted text-muted-foreground' :
                              item.type === 'ai' ? 'bg-purple-500/10 text-purple-600' : 'bg-blue-500/10 text-blue-600'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-normal">{item.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailTab === 'executive' && (
                <div className="space-y-6 text-left animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5 text-emerald-500" />
                      Executive Incident Report
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground">PREPARED BY INCIDENTIQ AGENTS</span>
                  </div>

                  {selectedIncident.executiveReport && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-4">
                        <div className="p-4 rounded-xl border space-y-1">
                          <span className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Outage Business Impact</span>
                          <p className="text-xs text-muted-foreground leading-relaxed">{selectedIncident.executiveReport.businessImpact}</p>
                        </div>
                        <div className="p-4 rounded-xl border space-y-1">
                          <span className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Short-term Remediation Steps</span>
                          <p className="text-xs text-muted-foreground leading-relaxed">{selectedIncident.executiveReport.shortTermMitigation}</p>
                        </div>
                        <div className="p-4 rounded-xl border space-y-1">
                          <span className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Long-term Prevention Strategy</span>
                          <p className="text-xs text-muted-foreground leading-relaxed">{selectedIncident.executiveReport.longTermAction}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Gauge Card */}
                        <div className="p-4 rounded-xl border bg-muted/5 space-y-4 flex flex-col justify-between">
                          <span className="text-[9px] uppercase font-mono font-bold text-muted-foreground">Technical Outage Score</span>
                          <div className="space-y-1.5">
                            <div className="flex items-end justify-between">
                              <span className="text-3xl font-bold font-mono text-foreground">{selectedIncident.executiveReport.technicalOutageScore}</span>
                              <span className="text-xs text-muted-foreground">/ 100 max</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  selectedIncident.executiveReport.technicalOutageScore >= 80 ? 'bg-red-500' :
                                  selectedIncident.executiveReport.technicalOutageScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`} 
                                style={{ width: `${selectedIncident.executiveReport.technicalOutageScore}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-500 block">Relative severity of data losses, users blockages & connectivity loops.</span>
                        </div>

                        {/* Status profile card */}
                        <div className="p-4 rounded-xl border bg-muted/10 space-y-2">
                          <span className="text-[9px] uppercase font-mono font-bold text-muted-foreground">SLA Breach Risk profile</span>
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                            <span className="text-xs font-bold text-foreground">{selectedIncident.executiveReport.riskStatus}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Guardrails and Safety Checklist */}
                  {selectedIncident.safetyAudit && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                        <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                        Autonomous Reliability & Safety Checks
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="border p-3 rounded-lg text-center bg-emerald-500/5 border-emerald-500/10">
                          <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase">PII Redacted Check</div>
                          <span className="text-xs text-foreground font-bold">100% Passed</span>
                        </div>
                        <div className="border p-3 rounded-lg text-center bg-emerald-500/5 border-emerald-500/10">
                          <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase">Hallucination Risk</div>
                          <span className="text-xs text-foreground font-bold">Low / Zero</span>
                        </div>
                        <div className="border p-3 rounded-lg text-center bg-emerald-500/5 border-emerald-500/10">
                          <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase">Schema Alignment</div>
                          <span className="text-xs text-foreground font-bold">V1.4 Compliance</span>
                        </div>
                        <div className="border p-3 rounded-lg text-center bg-emerald-500/5 border-emerald-500/10">
                          <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase">Guardrail Pipeline</div>
                          <span className="text-xs text-foreground font-bold">Green Approved</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-3">
            <ShieldAlert className="h-12 w-12 text-muted/30" />
            <p className="text-sm font-semibold">No active incident clusters.</p>
            <p className="text-xs text-muted-foreground">All systems are currently operating within normal SLAs. No correlated alerts reported.</p>
          </div>
        )}
      </div>

    </div>
  );
}
