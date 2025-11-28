#!/usr/bin/env python3
"""Update abstracts to be very short (2-6 words describing category/problem)"""

import json

# Load existing data
with open('data/projects_data.json', 'r') as f:
    projects = json.load(f)

# Define short abstracts (2-6 words)
short_abstracts = {
    "Skywalkers77 (2nd)": "Invoice & Contract Compliance Automation",
    "ai_banking_geek": "Credit Memo Generation",
    "ExemptFlow (renamed to Luma) (Top 4)": "Nonprofit Tax Filing Intelligence",
    "ArthaNethra": "Financial Investigation Knowledge Graph",
    "Loanlens AI (1st)": "Loan Underwriting & Fraud Detection",
    "Serimag (top 4)": "Pay Stub Fraud Detection",
    "pAIsa-pAIsa": "Financial Data Warehouse Automation",
    "ReLeap": "Reinsurance Contract Management",
    "Daemon Craft": "Immigration Compliance Fraud Detection",
    "Boring": "Document Search with Vision AI",
    "Eagle": "Multi-Brokerage Portfolio Analysis"
}

# Update projects with short abstracts
for project in projects:
    team_name = project["team_name"]
    if team_name in short_abstracts:
        project["abstract"] = short_abstracts[team_name]
        print(f"✓ Updated {team_name}: {short_abstracts[team_name]}")

# Save updated data
with open('data/projects_data.json', 'w') as f:
    json.dump(projects, f, indent=2, ensure_ascii=False)

print(f"\n✓ Successfully updated {len(short_abstracts)} project abstracts")
