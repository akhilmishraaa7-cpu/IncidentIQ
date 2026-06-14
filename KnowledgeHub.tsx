import React, { useState } from 'react';
import { 
  BookOpen, Search, Tag, FileText, Check, Copy, ChevronRight, Compass,
  Layers, Database, Cpu, ShieldCheck
} from 'lucide-react';
import { KnowledgeBaseDoc } from '../types';

interface KnowledgeHubProps {
  documents: KnowledgeBaseDoc[];
  onSearch: (query: string) => Promise<KnowledgeBaseDoc[]>;
}

export default function KnowledgeHub({ documents, onSearch }: KnowledgeHubProps) {
  const [query, setQuery] = useState('');
  const [searchedDocs, setSearchedDocs] = useState<KnowledgeBaseDoc[] | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Combine query actions
  const displayedDocs = searchedDocs !== null ? searchedDocs : documents;
  const currentDocId = selectedDocId || (displayedDocs.length > 0 ? displayedDocs[0].id : null);
  const selectedDoc = displayedDocs.find(d => d.id === currentDocId);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await onSearch(query);
      setSearchedDocs(results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Icon selector based on guide parameters
  const selectTypeStyles = (type: string) => {
    switch (type) {
      case 'SOP':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Troubleshooting Guide':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Runbook':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Team Ownership Matrix':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Incident Playbook':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <div id="knowledge-hub-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-230px)] min-h-[550px] text-left">
      
      {/* LEFT COLUMN: GUIDES AND SOP LISTINGS */}
      <div id="guides-index-card" className="lg:col-span-4 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col h-full overflow-hidden">
        
        {/* Knowledge Header */}
        <div className="p-4 border-b bg-muted/10 shrink-0 space-y-3">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-blue-500" />
            Enterprise SOPs & Knowledge
          </h3>
          
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              id="kb-search-input"
              type="text"
              placeholder="Search SOPs, error codes, VM names..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs bg-muted/20 hover:border-gray-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
            />
          </form>
        </div>

        {/* Scrollable list */}
        <div id="guides-scroll-pane" className="flex-1 overflow-y-auto divide-y">
          {displayedDocs.map(doc => (
            <div
              key={doc.id}
              id={`kb-item-${doc.id}`}
              onClick={() => setSelectedDocId(doc.id)}
              className={`p-4 cursor-pointer text-left transition-colors border-l-4 ${
                currentDocId === doc.id 
                  ? 'bg-blue-500/5 border-blue-500 dark:bg-blue-500/10' 
                  : 'border-transparent hover:bg-muted/15'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground font-mono">
                <span>{doc.id}</span>
                <span>Updated {doc.lastUpdated}</span>
              </div>
              <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 mt-1 leading-snug">{doc.title}</h4>
              
              <div className="flex items-center justify-between gap-2 mt-3 overflow-x-hidden">
                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold shrink-0 border ${selectTypeStyles(doc.type)}`}>
                  {doc.type}
                </span>
                
                <div className="flex gap-1 items-center overflow-hidden">
                  {doc.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] text-muted-foreground shrink-0 select-none">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER DETAILS & MICROSOFT FOUNDRY INTEGRATION PANEL */}
      <div id="guides-detail-and-foundry" className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-4 h-full overflow-hidden">
        
        {/* DOCUMENT VIEW */}
        <div id="guidelines-card" className="md:col-span-8 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col h-full overflow-hidden">
          {selectedDoc ? (
            <div id={`doc-view-${selectedDoc.id}`} className="flex flex-col h-full overflow-hidden text-left pb-4">
              
              {/* Document bar top */}
              <div className="p-4 border-b bg-muted/15 flex items-center justify-between gap-4 shrink-0">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">{selectedDoc.id}</span>
                  <span className={`px-2 py-0.5 h-fit leading-none ml-2 border text-[9px] font-bold uppercase rounded-full ${selectTypeStyles(selectedDoc.type)}`}>
                    {selectedDoc.type}
                  </span>
                  <h3 className="font-bold text-sm text-foreground leading-snug">{selectedDoc.title}</h3>
                </div>

                <button
                  id="copy-doc-content-btn"
                  onClick={() => handleCopy(selectedDoc.content)}
                  className="p-2 border rounded-lg hover:bg-muted text-muted-foreground transition duration-150 shrink-0"
                  title="Copy Document Content"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Body article content */}
              <div id="doc-scrolling-body" className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap leading-relaxed h-full">
                  {selectedDoc.content}
                </div>
              </div>

              {/* Footer tags */}
              <div className="px-5 pt-3 border-t flex flex-wrap gap-1.5 shrink-0 bg-muted/10 pb-1">
                {(selectedDoc.tags || []).map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 rounded-full bg-muted border text-[10px] font-medium text-foreground inline-flex items-center gap-1 shrink-0"
                  >
                    <Tag className="h-2.5 w-2.5 text-muted-foreground" />
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-3">
              <Compass className="h-12 w-12 text-muted/30" />
              <p className="text-sm font-semibold">Select a document.</p>
              <p className="text-xs text-muted-foreground">Select an enterprise-wide troubleshooting guide from the inventory index on the left.</p>
            </div>
          )}
        </div>

        {/* INTEGRATION PANEL */}
        <div id="foundry-side-panel" className="md:col-span-4 border rounded-xl bg-muted/20 p-4 shrink-0 flex flex-col h-full overflow-hidden text-left space-y-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <Layers className="h-4 w-4 text-blue-500 shrink-0" />
              Foundry IQ Indexer
            </h4>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Microsoft SaaS Foundry knowledge schema specifications for custom AI extraction.
            </p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {/* Spec blocks */}
            <div className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm space-y-2">
              <span className="text-[9px] font-mono uppercase bg-blue-500/10 text-blue-500 px-1 rounded font-bold">API ENDPOINT</span>
              <div className="text-[10px] font-mono leading-tight bg-muted p-1 rounded font-semibold truncate select-all">
                POST /api/v1/knowledge-base/search
              </div>
              <p className="text-[9px] text-zinc-500 leading-normal">
                Direct querying with federated sync capability mapping tags RFC-8273-CORRELATION.
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm space-y-1">
              <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-500 px-1 rounded font-bold">INDEX STATE</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground pt-1">
                <Database className="h-3.5 w-3.5 text-neutral-500" />
                Active Synergized Map
              </div>
              <p className="text-[9px] text-zinc-500 leading-normal gap-1 flex items-center">
                <span>Total files indexed:</span>
                <strong className="text-foreground">{documents.length} guidelines</strong>
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm space-y-1">
              <span className="text-[9px] font-mono uppercase bg-purple-500/10 text-purple-600 px-1 rounded font-bold">SCHEMA PATH</span>
              <div className="text-[9px] font-mono leading-tight pt-1">
                microsoft_it_schema.json
              </div>
              <p className="text-[9px] text-zinc-500 leading-normal">
                Strict type enforcement compatible with Azure AI Semantic Search layers.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
