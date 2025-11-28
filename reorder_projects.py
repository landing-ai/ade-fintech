#!/usr/bin/env python3
"""Reorder projects: Champions → Honorable Mentions → Best Online Apps → Others"""

import json

# Load existing data
with open('data/projects_data.json', 'r') as f:
    projects = json.load(f)

# Remove the Total row
projects = [p for p in projects if p['team_name'] != 'Total']

# Define categories
champion = []
honorable_mentions = []
best_online_apps = []
others = []

# Top Champion (Winner)
champion_names = ['Skywalkers77 (2nd)']  # Actually #1 winner

# Honorable Mentions (Top performing teams)
honorable_names = [
    'ai_banking_geek',  # Winner #2
    'ExemptFlow (renamed to Luma) (Top 4)',  # Winner #3
    'Loanlens AI (1st)',  # Top 5
    'ArthaNethra',
    'pAIsa-pAIsa',
    'ReLeap',
    'Daemon Craft',
    'Boring',
    'Eagle',
    'Serimag (top 4)'
]

# Best Online Apps
online_app_names = [
    'Beemnet Haile',  # Winner
    'Viva',
    'Hosni Belfeki',
    'Sabirul'
]

# Categorize projects
for project in projects:
    name = project['team_name']

    if name in champion_names:
        champion.append(project)
    elif name in honorable_names:
        honorable_mentions.append(project)
    elif name in online_app_names:
        # Handle duplicate Beemnet Haile entries - take the first one with real data
        if name == 'Beemnet Haile' and len([p for p in best_online_apps if p['team_name'] == 'Beemnet Haile']) > 0:
            continue  # Skip duplicates
        best_online_apps.append(project)
    else:
        others.append(project)

# Reorder lists to match specified order
def get_order_index(item, order_list):
    try:
        return order_list.index(item['team_name'])
    except ValueError:
        return 999

champion.sort(key=lambda x: get_order_index(x, champion_names))
honorable_mentions.sort(key=lambda x: get_order_index(x, honorable_names))
best_online_apps.sort(key=lambda x: get_order_index(x, online_app_names))

# Keep only first Beemnet Haile with valid data
if len([p for p in best_online_apps if p['team_name'] == 'Beemnet Haile']) > 1:
    beemnet_entries = [p for p in best_online_apps if p['team_name'] == 'Beemnet Haile']
    # Keep the one with team_members
    best_online_apps = [p for p in best_online_apps if p['team_name'] != 'Beemnet Haile']
    best_online_apps.insert(0, beemnet_entries[0])

# Combine in order
reordered = champion + honorable_mentions + best_online_apps + others

# Save reordered data
with open('data/projects_data.json', 'w') as f:
    json.dump(reordered, f, indent=2, ensure_ascii=False)

print(f"✓ Reordered projects:")
print(f"  - Champion: {len(champion)}")
print(f"  - Honorable Mentions: {len(honorable_mentions)}")
print(f"  - Best Online Apps: {len(best_online_apps)}")
print(f"  - Others: {len(others)}")
print(f"  - Total: {len(reordered)} (removed Total row)")
