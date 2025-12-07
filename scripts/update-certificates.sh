#!/bin/bash

# ========================================
# Update Certificates - Git Helper Script
# ========================================
# This script helps you commit and push the updated encrypted certificate file to GitHub

set -e

echo "🔐 Certificate Update Script"
echo "================================"
echo ""

# Check if encrypted file exists
if [ ! -f "data/certificate_list.enc" ]; then
    echo "❌ Error: Encrypted file not found at data/certificate_list.enc"
    echo "Please save and download the encrypted file from the admin panel first."
    exit 1
fi

echo "✅ Found encrypted certificate file"
echo ""

# Show git status
echo "📊 Current git status:"
git status --short
echo ""

# Ask for confirmation
read -p "Do you want to commit and push the certificate updates? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 0
fi

# Stage the encrypted file
echo "📦 Staging encrypted certificate file..."
git add data/certificate_list.enc

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit (file is already up to date)"
    exit 0
fi

# Get commit message
echo ""
read -p "Enter commit message (or press Enter for default): " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="Update certificates - $(date '+%Y-%m-%d %H:%M')"
fi

# Commit
echo "💾 Creating commit..."
git commit -m "$commit_msg"

# Ask about pushing
echo ""
read -p "Push to GitHub? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing to GitHub..."
    git push
    echo ""
    echo "✅ Successfully pushed certificate updates to GitHub!"
else
    echo "ℹ️  Changes committed locally. Run 'git push' when ready to upload."
fi

echo ""
echo "================================"
echo "✨ Done!"
