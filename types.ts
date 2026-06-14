export type TicketStatus = 'open' | 'investigating' | 'resolved' | 'closed';

export type TicketCategory =
  | 'Authentication'
  | 'VPN'
  | 'Network'
  | 'Database'
  | 'Application Support'
  | 'Hardware'
  | 'Cloud Infrastructure'
  | 'Security'
  | 'Unassigned';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type AssignmentTeam =
  | 'IAM Team'
  | 'Network Team'
  | 'Desktop Support'
  | 'Database Team'
  | 'Application Support Team'
  | 'Cloud Operations Team'
  | 'Security Team'
  | 'Unassigned';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  category: TicketCategory;
  priority: TicketPriority;
  priorityReasoning: string;
  assignedTeam: AssignmentTeam;
  affectedSystems: string[];
  intent: string;
  issueType: string;
  createdAt: string;
  resolvedAt?: string;
  incidentId?: string; // Links ticket to an Incident Cluster
  createdBy: string;
  
  // Advanced Triage & Hackathon Additions
  slaBreachTime?: string;
  slaRiskProfile?: 'Low' | 'Medium' | 'High' | 'Critical';
  semanticSimilarityScore?: number;
  auditTrail?: { timestamp: string; action: string; actor: string; details: string }[];
}

export interface RootCauseAnalysisRef {
  rootCause: string;
  confidence: number; // e.g. 94 for 94%
  evidence: string[];
  reasoning: string;
}

export interface ResolutionRecommendationRef {
  steps: string[];
  escalationPath: string;
  recoveryChecklist: string[];
}

// Visual timeline item for incidents
export interface IncidentTimelineItem {
  timestamp: string;
  title: string;
  body: string;
  type: 'system' | 'ai' | 'human';
}

// Multi-step reasoning schema
export interface ReasoningStep {
  stepName: string;
  stepResult: string;
  timestamp: string;
  evidenceMatched: string[];
}

// Executive report structure
export interface ExecutiveIncidentReport {
  preparedAt: string;
  businessImpact: string;
  shortTermMitigation: string;
  longTermAction: string;
  technicalOutageScore: number; // 1-100 rating
  riskStatus: string;
}

// Knowledge Base Citation
export interface KnowledgeCitation {
  docId: string;
  title: string;
  sectionSnippet: string;
}

// Guardrails & Safety Audit
export interface SafetyAuditCheck {
  piiChecked: boolean;
  hallucinationRisk: 'Low' | 'None';
  pipelinePassed: boolean;
  rulePassed: boolean;
  apiSchemaVersion: string;
  complianceTag: string;
}

export interface IncidentCluster {
  id: string;
  title: string;
  summary: string;
  priority: TicketPriority;
  status: 'active' | 'investigating' | 'mitigated' | 'resolved';
  ticketIds: string[];
  assignedTeam: AssignmentTeam;
  rootCauseAnalysis?: RootCauseAnalysisRef;
  resolutionRecommendation?: ResolutionRecommendationRef;
  createdAt: string;
  resolvedAt?: string;

  // Advanced Core Telemetry & Hackathon Additions
  incidentSummaryMarkdown?: string;
  timeline?: IncidentTimelineItem[];
  multiStepReasoning?: ReasoningStep[];
  executiveReport?: ExecutiveIncidentReport;
  citations?: KnowledgeCitation[];
  safetyAudit?: SafetyAuditCheck;
}

export type KnowledgeBaseDocType =
  | 'SOP'
  | 'Troubleshooting Guide'
  | 'Runbook'
  | 'Team Ownership Matrix'
  | 'Incident Playbook';

export interface KnowledgeBaseDoc {
  id: string;
  title: string;
  type: KnowledgeBaseDocType;
  content: string;
  lastUpdated: string;
  tags: string[];
}

export interface TeamInfo {
  name: AssignmentTeam;
  lead: string;
  activeMembersCount: number;
  ticketCount: number;
  averageResponseHours: number;
  icon?: string;
}

export interface DashboardMetrics {
  totalTickets: number;
  openTickets: number;
  criticalTickets: number;
  openIncidents: number;
  resolutionRate: number; // e.g. 85 for 85%
  avgResolutionTimeHours: number;
}
