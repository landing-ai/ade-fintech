#!/usr/bin/env python3
"""Update projects_data.json with real abstracts and summaries from repository READMEs"""

import json

# Load existing data
with open('data/projects_data.json', 'r') as f:
    projects = json.load(f)

# Define abstracts and summaries for top teams
updates = {
    "Skywalkers77 (2nd)": {
        "abstract": "Document processing platform with Landing AI ADE for automated invoice and contract extraction, compliance monitoring, and fraud detection",
        "summary": "DocuFlow is a production-ready platform featuring hybrid compliance automation that combines RAG with deterministic rule engines. The system processes invoices and contracts through complete ADE SDK integration, performs vendor-aware matching, extracts bounding boxes for PDF highlighting, and includes scheduled bulk processing for compliance monitoring. Built with FastAPI backend (3,408 LOC) and React frontend (4,591 LOC), it achieves perfect implementation scores with multi-model AI failover, PostgreSQL with pgvector storage, and role-based dashboards for auditors, compliance officers, and finance teams."
    },
    "ai_banking_geek": {
        "abstract": "AI-Powered Template-Adaptive Credit Memo Generation - Ernie credit assistant automating loan underwriting for Midwest Regional Bank",
        "summary": "Ernie eliminates manual credit memo generation bottlenecks by automating document extraction with LandingAI ADE and generating narrative analysis with AWS Bedrock Claude 4.5 Haiku. The system achieves 92% time savings by auto-generating memos tailored to bank-approved templates, calculating 9 financial ratios automatically, and providing full traceability of data sources for regulatory compliance. Features include template-adaptive AI generation, automated reconciliation across sources, and bias reduction through AI-powered analysis. Winner of Best Documentation Award with 562-line comprehensive README."
    },
    "ExemptFlow (renamed to Luma) (Top 4)": {
        "abstract": "AI-Powered Nonprofit Financial Intelligence platform transforming 1.5 million+ IRS Form 990 tax filings into actionable insights",
        "summary": "Luma addresses the challenge of extracting meaningful insights from over 1.5 million annual nonprofit Form 990 filings. The platform combines intelligent document processing with vector search using Qdrant database and Azure OpenAI embeddings. Features a multi-agent system with specialized Form Auditor for compliance checking, Analyst Agent for insights generation, and Web Search Agent powered by Tavily API. Built with comprehensive full-stack architecture: 9,222 LOC FastAPI backend with 85 TypeScript frontend files, generative UI for dynamic React components, and flexible schema management for nonprofit intelligence across the sector."
    },
    "ArthaNethra": {
        "abstract": "Knowledge graph-native financial investigation platform that maps entities and relationships across documents to reveal hidden patterns",
        "summary": "ArthaNethra (Sanskrit: wealth + eye) is the first knowledge graph-native financial investigation platform. Unlike traditional tools that extract data in isolation, it automatically maps entities and relationships across multiple documents into an interactive Neo4j graph database. The multi-agent architecture combines LandingAI ADE for document extraction with AWS Bedrock for analysis, revealing connections that analysts miss in manual review. Saves 200+ hours per M&A deal by providing unified cross-document views, identifying hidden risks in covenants and conflicts, and explaining AI insights through traceable graph relationships. Built with Angular 19 frontend featuring Sigma.js graph visualization and ECharts data visualization."
    },
    "Loanlens AI (1st)": {
        "abstract": "Intelligent end-to-end underwriting assistant automating financial document analysis, fraud detection, and credit decisioning",
        "summary": "LoanLens AI addresses critical challenges where 52% of loan processing time is spent manually collecting documents and 1 in 4 applications contain discrepancies. The platform combines Landing AI ADE for document extraction with AWS Bedrock for fraud detection and credit evaluation using a multi-agent architecture. Key metrics show 30% of creditworthy applicants are rejected due to poor data interpretation in traditional systems. LoanLens delivers faster, more accurate, and auditable underwriting decisions by automating document extraction, identifying first-party fraud patterns (salary inflation, risky revenue practices), and providing transparent AI-powered credit recommendations with full traceability."
    },
    "Serimag (top 4)": {
        "abstract": "FakePay.ai - Automatic validation system for Spanish pay stubs using AI to detect GenAI-driven fraud and verify authenticity",
        "summary": "FakePay tackles the rising threat of GenAI-driven document forgery in financial services. Built by Serimag, Spain's leading Intelligent Document Processing company (processing 1M+ pages daily for banking), the system provides an easy-to-deploy API for IDP workflows. Features include document classification using LandingAI Parse API, AI-generated document detection via AIorNOT, key information extraction with Extract API, and automatic validation of dates, NIF/CIF formats, and internal earnings calculations. Focused initially on Spanish pay stubs with plans to expand. Built during a weekend hackathon by Serimag's Barcelona-based team with strong NLP and Computer Vision expertise."
    },
    "pAIsa-pAIsa": {
        "abstract": "SnowFlow AI - AI-powered financial document processing platform that extracts, analyzes, and structures data for Snowflake warehouse",
        "summary": "SnowFlow AI automates the complete pipeline from financial document upload to Snowflake data warehouse deployment. Uses Google Gemini AI and LandingAI ADE for intelligent extraction from PDFs, images, and financial statements. The LangGraph-based architecture orchestrates four key agents: Document Extractor (OCR and AI-powered markdown conversion), Financial Analyzer (document type identification and relationship mapping), Schema Designer (optimized database schema generation), and Snowflake Deployer (automated data loading). Built with FastAPI backend and React/Tailwind frontend, featuring user-driven metric discovery, automated schema design based on extracted data, and comprehensive workflow management with conditional processing."
    },
    "ReLeap": {
        "abstract": "re-ink - Automated reinsurance contract and party management using Agentic Document Extraction for insurance companies",
        "summary": "re-ink streamlines reinsurance contract management by automating extraction of contract details and party information from uploaded PDF/DOCX documents. Features complete document upload with drag-and-drop interface, AI extraction monitoring with real-time status updates, review interface for editing extracted data, comprehensive contract and party dashboards, and sample extraction mode for workflow testing. The system integrates LandingAI's Agentic Document Extraction API with LangChain/LangGraph agents for intake insights and automated contract reviews. Built with FastAPI backend, PostgreSQL database with SQLAlchemy ORM, React 18 frontend, and full CRUD operations for managing reinsurance contracts and parties (cedents, reinsurers, brokers)."
    },
    "Daemon Craft": {
        "abstract": "Openomi - AI-powered fraud detection for Canadian immigration applications, reducing processing time from hours/days to minutes",
        "summary": "Openomi automates compliance audits for government immigration applications, specifically targeting Canadian IRCC processes that handle 400,000+ applications annually. Immigration officers manually review 6 months of bank statements per applicant at a cost of $200M+ annually with 15-20% fraud rates. The system uses AWS Bedrock Agent architecture with Lambda functions integrating LandingAI ADE for document extraction, RAG knowledge base for IRCC rules verification, and automated fraud pattern detection invisible to human reviewers. Reduces processing time by 95% while verifying program-specific compliance requirements. Built with Streamlit UI, S3 storage, and comprehensive use case coverage for multiple immigration programs with program-specific compliance rules."
    },
    "Boring": {
        "abstract": "ComplianceGuard AI - Document ingestion and semantic search powered by state-of-the-art ColPali vision-language embeddings",
        "summary": "ComplianceGuard represents cutting-edge technology using ColPali embeddings (2024 SOTA) for multi-vector document analysis. The system features unified DocumentIndex API for indexing and search, automatic PDF to image conversion, hosted Modal service integration for embeddings (no local model required), Milvus vector database for fast retrieval, and MaxSim (Maximum Similarity) scoring for accurate document ranking. Architecture includes support for multiple independent indexes, duplicate prevention with automatic tracking, persistent index logs, efficient batch operations, and built-in result formatting. Winner of Most Advanced Embeddings award. Built with FastAPI, Docker Compose for service orchestration, S3 for file storage, PostgreSQL for metadata, and comprehensive batch processing capabilities."
    },
    "Eagle": {
        "abstract": "PortfoliMosaic - AI-powered financial document assistant for understanding investment portfolios across multiple brokerages and countries",
        "summary": "PortfoliMosaic addresses the complexity of managing portfolios across multiple brokerages, countries, and asset classes. Modern investors maintain accounts globally for diversification, tax efficiency, and specialized access, requiring dynamic tools to synthesize structured holdings, unstructured documents, and real-time market data. The platform unifies fragmented financial information into coherent, actionable insights across borders and asset types. Key features include multi-brokerage portfolio aggregation, international investment tracking, cross-border compliance and reporting, natural language conversations about investments, and integration of tax documents and financial statements. Built to handle the reality that most global investors hold 15-30 securities across multiple platforms with trillions in international assets."
    }
}

# Update projects with abstracts and summaries
for project in projects:
    team_name = project["team_name"]
    if team_name in updates:
        project["abstract"] = updates[team_name]["abstract"]
        project["summary"] = updates[team_name]["summary"]
        print(f"✓ Updated {team_name}")

# Save updated data
with open('data/projects_data.json', 'w') as f:
    json.dump(projects, f, indent=2, ensure_ascii=False)

print(f"\n✓ Successfully updated projects_data.json with {len(updates)} team abstracts and summaries")
