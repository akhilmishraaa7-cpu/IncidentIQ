# IncidentIQ


IncidentIQ is an AI-powered enterprise incident management platform that transforms traditional IT support workflows through agentic AI, multi-step reasoning, and autonomous decision-making.

Unlike conventional ticketing systems that simply classify and route tickets, IncidentIQ investigates incidents, identifies root causes, correlates related tickets, retrieves organizational knowledge, recommends remediation actions, and automatically routes issues to the appropriate support teams.

Built for the **Microsoft Agents League Hackathon 2026**.

---

## 🎯 Problem Statement

Enterprise IT teams receive hundreds of support requests daily.

Common challenges include:

* Manual ticket triage
* Duplicate incident reports
* Delayed root cause identification
* Incorrect team assignments
* Lack of incident visibility
* Increased Mean Time To Resolution (MTTR)

These issues reduce operational efficiency and increase downtime.

---

## 💡 Solution

IncidentIQ acts as an Autonomous Incident Investigation Agent.

The platform:

✅ Understands incoming tickets

✅ Categorizes issues automatically

✅ Predicts severity and priority

✅ Correlates related incidents

✅ Identifies likely root causes

✅ Retrieves enterprise knowledge

✅ Generates remediation plans

✅ Routes incidents automatically

✅ Explains every decision with confidence scores

---

## 🧠 AI Agent Workflow

### Step 1 — Ticket Understanding

User submits:

> Unable to connect to VPN after password reset.

The AI extracts:

* Authentication issue
* VPN dependency
* User impact

---

### Step 2 — Ticket Classification

Output:

Category: Authentication

Priority: High

Assigned Team: IAM Team

Confidence Score: 92%

---

### Step 3 — Knowledge Retrieval

The agent retrieves:

* Password Reset SOP
* VPN Troubleshooting Guide
* Authentication Runbooks
* Team Ownership Matrix

Using Microsoft Foundry IQ.

---

### Step 4 — Incident Correlation

Example:

Ticket #101

VPN Login Failed

Ticket #102

Teams Authentication Error

Ticket #103

Unable to Access Corporate Apps

The agent identifies a common incident.

---

### Step 5 — Root Cause Analysis

Multi-step reasoning process:

1. Analyze ticket patterns
2. Compare symptoms
3. Search enterprise knowledge
4. Generate root-cause hypothesis
5. Calculate confidence score

Example:

Root Cause:
Identity Synchronization Service Failure

Confidence:
94%

---

### Step 6 — Resolution Recommendation

Generated Action Plan:

1. Verify synchronization service
2. Restart identity connector
3. Validate authentication logs
4. Re-test VPN access

---

### Step 7 — Autonomous Routing

Incidents are routed automatically to:

* IAM Team
* Network Team
* Database Team
* Application Support
* Desktop Support
* Security Operations

---

## ✨ Key Features

### 🎫 Intelligent Ticket Classification

Automatically detects:

* Authentication Issues
* VPN Problems
* Network Failures
* Application Errors
* Database Incidents
* Hardware Issues
* Security Events

---

### 📊 Severity Prediction

Predicts:

* Low
* Medium
* High
* Critical

With explainable reasoning.

---

### 🔍 Incident Correlation

Detects:

* Duplicate Tickets
* Related Incidents
* Shared Root Causes

---

### 🧠 Root Cause Analysis

Uses AI reasoning to identify:

* Common symptoms
* Failure patterns
* Probable causes

---

### 📚 Knowledge-Based Reasoning

Retrieves:

* SOPs
* Runbooks
* Troubleshooting Guides
* Incident Playbooks

Through Foundry IQ integration.

---

### 🤖 Explainable AI

Every recommendation includes:

* Reasoning
* Supporting Evidence
* Confidence Score

---

### 📈 Enterprise Dashboard

Provides:

* Ticket Analytics
* Incident Trends
* Team Workload
* Critical Alerts
* Resolution Metrics

---

## 🏗️ Architecture

```text
Employee
    ↓
Ticket Portal
    ↓
AI Understanding Agent
    ↓
Foundry IQ Knowledge Layer
    ↓
Incident Correlation Engine
    ↓
Root Cause Analysis Agent
    ↓
Recommendation Engine
    ↓
Autonomous Team Routing
    ↓
Enterprise Dashboard
```

## 💻 Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend

* Spring Boot
* Spring AI

### Database

* PostgreSQL

### AI Layer

* Microsoft Foundry
* Foundry IQ

### Deployment

* Azure App Service

---

## 🎬 Demo

Demo Video:

[Add YouTube/Loom Link Here]

---

## 📸 Screenshots

### Dashboard

Add screenshot here

### Ticket Analysis

Add screenshot here

### Root Cause Investigation

Add screenshot here

---

## 🚀 Installation

Clone repository:

```bash
git clone https://github.com/your-username/IncidentIQ.git
```

Navigate to project:

```bash
cd IncidentIQ
```

Run backend:

```bash
./mvnw spring-boot:run
```

Run frontend:

```bash
npm install
npm run dev
```

---

## 🎯 Hackathon Alignment

### 🧠 Reasoning Agents

* Multi-step reasoning
* Incident investigation
* Root cause analysis

### 💡 Best Use of IQ Tools

* Foundry IQ integration
* Knowledge retrieval
* Grounded responses

### 🛡 Reliability & Safety

* Explainable decisions
* Confidence scoring
* Enterprise knowledge validation

---

## 🔮 Future Enhancements

* SLA Breach Prediction
* Microsoft Teams Integration
* Real-Time Monitoring
* Predictive Failure Detection
* Automated Incident Resolution
* Enterprise Analytics

---

## 👨‍💻 Author

Akhil Mishra

Built for Microsoft Agents League Hackathon 2026.

---

## ⭐ Support

If you found this project useful, please consider giving it a star.
