import React, { useState } from 'react';
import { 
  Sliders, Play, RefreshCw, CheckCircle2, ShieldAlert, Cpu, 
  Users, BookOpen, Clock, ArrowRight, Zap, Target
} from 'lucide-react';
import { TeamInfo, Ticket, IncidentCluster } from '../types';

interface AdminPanelProps {
  teams: TeamInfo[];
  tickets: Ticket[];
  incidents: IncidentCluster[];
  onTriggerDemoScenario: () => Promise<void>;
  isLoading: boolean;
}

export default function AdminPanel({ 
  teams, 
  tickets, 
  incidents, 
  onTriggerDemoScenario, 
  isLoading 
}: AdminPanelProps) {
  const [scenarioState, setScenarioState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // 9-Step Hackathon scenario timeline definitions
  const demoSteps = [
    { title: 'Submitting Incident Tickets', desc: 'Requester fires concurrent VPN & Teams authentications failures tickets' },
    { title: 'AI Taxonomy Classification', desc: 'IncidentIQ routes classifications & extracts diagnostic intents' },
    { title: 'Explainable AI Severity', desc: 'Predicting priority tiers (High/Critical) with contextual reasoning feedback' },
    { title: 'Algorithmic Correlation', desc: 'Cross-ticket examination; groups duplication tickets into a shared Fault Cluster' },
    { title: 'Deep Root Cause Analysis', desc: 'Executing multi-step reasoning models to analyze logs & identify the fault' },
    { title: 'Knowledge Base Retrieval', desc: 'Retrieving SOPs, AD Connector restart runbooks & ownership matrices context' },
    { title: 'Actionable Recovery Recs', desc: 'Generating recovery plan checklists & SLA operational escalation paths' },
    { title: 'IAM Team Target Routing', desc: 'Dispatching cluster to Sarah Jenkins (IAM Lead) with live thread triggers' },
    { title: 'Automatic Metrics Cascade', desc: 'Dashboard calculations, queue counts, and SLA metrics refresh instantly' }
  ];

  const handleRunCascade = async () => {
    setScenarioState('running');
    setCurrentStep(0);
    setLogs(['[SYSTEM] Initializing Hackathon Scenario sequence...', '[SQL] Flushing Active PostgreSQL mock schemas...']);

    // Step-by-step timing simulation
    const addLogWithDelay = (msg: string, stepNum: number, delay: number): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setLogs(prev => [...prev, msg]);
          if (stepNum > 0) {
            setCurrentStep(stepNum);
          }
          resolve();
        }, delay);
      });
    };

    await addLogWithDelay('[SQL] Database schema re-seeded back to safe baseline.', 0, 800);
    
    // Step 1
    await addLogWithDelay('[INGRESS] Submitting user tickets: Ticket-01 (VPN Access client failed), Ticket-02 (Teams Login Loop), Ticket-03 (Directory Connector sync error).', 1, 1000);
    
    // Call server to trigger scenario database insertion & actual Gemini analysis!
    try {
      await onTriggerDemoScenario();
    } catch (err) {
      console.error(err);
    }

    // Step 2
    await addLogWithDelay('[AI CLASSIFICATION] Ticket Understanding run: Detected key terms "AnyConnect", "SSO", "Directory". Mapping namespaces to (Authentication / VPN).', 2, 1000);
    
    // Step 3
    await addLogWithDelay('[AI SEVERITY] Predicting priority levels: Escalated VPN and login errors to Critical status. Reason: "Cascade authenticator failures blocked global workspaces concurrently".', 3, 1000);
    
    // Step 4
    await addLogWithDelay('[AI CORRELATOR] Inspecting token similarities... Duplicate matching identified overlapping symptoms. Clustered 3 alerts into unified incident folder: Identity Synchronization Failure Cascade.', 4, 1200);
    
    // Step 5
    await addLogWithDelay('[RCA AGENT] Performing multi-step causal chain check... Common denominator: Sync delay. Concluding incident: "Active Directory Identity Synchronization Queue Lock" (Confidence: 94%).', 5, 1200);
    
    // Step 6
    await addLogWithDelay('[KNOWLEDGE RAG] Matching tags [VPN, Sync, Connector] against active repo. Retrieved Guide KB-SOP-112 and Runbook RUN-501. Context injected.', 6, 1100);
    
    // Step 7
    await addLogWithDelay('[RECOMMENDER] Generated step-by-step recovery outline, including forced PowerShell Start-ADSyncConnector Runbook commands and VM checkpoints.', 7, 1100);
    
    // Step 8
    await addLogWithDelay('[ROUTING] Operational queue mapped. Moving issue to "IAM Team" queue state. Notified IAM Engineer Sarah Jenkins with diagnostics logs.', 8, 1000);
    
    // Step 9
    await addLogWithDelay('[METRICS MET] Cascade reload complete. Dash metrics refreshed: Critical tickets += 3, Incidents += 1, IAM Workloads Sync up.', 9, 800);
    
    setLogs(prev => [...prev, '[SYSTEM] End-to-end Demonstration completed successfully! Enterprise incident mitigated.']);
    setScenarioState('completed');
  };

  return (
    <div id="admin-panel-root" className="space-y-6 text-left">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Sliders className="h-6 w-6 text-blue-500" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Operational Admin Center</h2>
          <p className="text-xs text-muted-foreground">Manage support queues, trigger scenario debugging cascades, and audit system states</p>
        </div>
      </div>

      <div id="admin-analytics-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HACKATHON DEMO CONTROLLER */}
        <div id="hackathon-scenario-controller" className="lg:col-span-8 border rounded-xl bg-card text-card-foreground shadow-sm p-5 space-y-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500 animate-pulse" />
                Hackathon Demo Scenario Console
              </h3>
              <p className="text-xs text-muted-foreground">
                Run the end-to-end 9-step enterprise incident clustering, knowledge retrieval, and automated routing demonstration.
              </p>
            </div>

            <button
              id="trigger-scenario-button"
              onClick={handleRunCascade}
              disabled={scenarioState === 'running' || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-muted text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition"
            >
              {scenarioState === 'running' ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Cascade...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Trigger Demo Sequence
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
            
            {/* Visual Checklist timeline */}
            <div className="md:col-span-6 space-y-2.5">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Execution Stages Timeline</span>
              
              <div className="space-y-1.5 h-[340px] overflow-y-auto pr-1">
                {demoSteps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isPast = currentStep > stepNum;
                  const isCurrent = currentStep === stepNum;
                  const isFuture = currentStep < stepNum;

                  return (
                    <div 
                      key={idx}
                      id={`timeline-step-${stepNum}`}
                      className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all duration-200 ${
                        isCurrent ? 'bg-blue-500/10 border-blue-500' :
                        isPast ? 'bg-emerald-500/5 border-emerald-500/20 opacity-80' : 'bg-background opacity-60'
                      }`}
                    >
                      <div className="pt-0.5 shrink-0">
                        {isPast ? (
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                        ) : isCurrent ? (
                          <div className="h-4.5 w-4.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                        ) : (
                          <div className="h-4.5 w-4.5 rounded-full border-2 border-muted" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-bold leading-normal ${isCurrent ? 'text-blue-600' : isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                          Step {stepNum}: {step.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground leading-normal">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Live Audit Logs */}
            <div className="md:col-span-6 flex flex-col h-[360px] border rounded-lg bg-black text-emerald-400 p-4 font-mono text-[10px] overflow-hidden space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2 shrink-0">
                <span className="text-[9px] text-zinc-500 uppercase font-semibold">IncidentIQ Operational Logger Output</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div id="admin-log-scroller" className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 pr-1 text-left">
                {logs.length === 0 ? (
                  <span className="text-zinc-600 italic">Console idling. Click &ldquo;Trigger Demo Sequence&rdquo; above to run system diagnostics.</span>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      <span className="text-zinc-500 mr-1">&gt;</span>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* TEAM COMPOSITION DATA MATRIX */}
        <div id="admin-matrix-and-teams" className="lg:col-span-4 border rounded-xl bg-card text-card-foreground shadow-sm p-5 space-y-4">
          <div className="border-b pb-3 shrink-0">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-zinc-500" />
              Active SLA Rosters
            </h3>
            <p className="text-xs text-muted-foreground">Operational resources matrix on active duty shift</p>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {teams.map((t) => (
              <div 
                key={t.name}
                id={`admin-team-${t.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-3 bg-muted/10 border rounded-lg space-y-2 flex flex-col hover:bg-muted/20 transition-all text-left"
              >
                <div className="flex items-center justify-between text-xs font-semibold gap-2">
                  <span className="text-foreground">{t.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{t.activeMembersCount} Agents</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground border-t border-muted/35 pt-1.5">
                  <div>
                    <span>Lead Supervisor</span>
                    <strong className="text-foreground block">{t.lead}</strong>
                  </div>
                  <div className="text-right">
                    <span>Performance Rating</span>
                    <strong className="text-emerald-500 block">SLA Compliant</strong>
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
