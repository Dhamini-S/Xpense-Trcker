#!/bin/bash

# Xpense Tracker - GitHub Push Script
# This script helps you push your code to GitHub

echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                          ║"
echo "║               💰 Xpense Tracker - GitHub Push Helper                     ║"
echo "║                                                                          ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed!"
    echo "Please install Git first: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if already initialized
if [ -d .git ]; then
    echo "📁 Git repository already initialized"
else
    echo "🔧 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
fi

echo ""
echo "────────────────────────────────────────────────────────────────────────────"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo "❌ Error: GitHub username cannot be empty"
    exit 1
fi

# Get repository name
read -p "Enter repository name (default: xpense-tracker): " repo_name
repo_name=${repo_name:-xpense-tracker}

echo ""
echo "────────────────────────────────────────────────────────────────────────────"
echo ""
echo "📝 Configuration:"
echo "   Username: $github_username"
echo "   Repository: $repo_name"
echo "   URL: https://github.com/$github_username/$repo_name"
echo ""
echo "────────────────────────────────────────────────────────────────────────────"
echo ""

# Confirm before proceeding
read -p "Is this correct? (y/n): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ Cancelled by user"
    exit 0
fi

echo ""
echo "🔧 Setting up Git..."
echo ""

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

# Add remote
echo "🔗 Adding remote repository..."
git remote add origin "https://github.com/$github_username/$repo_name.git"
echo "✅ Remote added"

echo ""
echo "📦 Adding files to staging area..."
git add .
echo "✅ Files added"

echo ""
echo "💾 Creating commit..."
git commit -m "Initial commit: Xpense Tracker - Modern expense management app

Features:
- Beautiful login screen with demo credentials
- Dashboard with statistics and charts
- Full expense management (add, edit, delete)
- Advanced filtering and search
- Budget tracking with progress indicators
- Interactive charts (line & pie)
- 7 expense categories
- Notes support for expenses
- Fully responsive design
- Smooth animations and micro-interactions
- LocalStorage persistence
- 12 sample expense entries

Tech Stack:
- HTML5, CSS3, Vanilla JavaScript ES6+
- Zero dependencies (except Google Fonts)
- Custom canvas charts
- Modular architecture

Documentation:
- Comprehensive README
- Quick start guide
- Complete feature list
- Installation instructions"

if [ $? -eq 0 ]; then
    echo "✅ Commit created"
else
    echo "⚠️  No changes to commit (files already committed)"
fi

echo ""
echo "🌿 Setting main branch..."
git branch -M main
echo "✅ Branch set to main"

echo ""
echo "────────────────────────────────────────────────────────────────────────────"
echo ""
echo "🚀 Pushing to GitHub..."
echo ""
echo "⚠️  IMPORTANT:"
echo "   If prompted for credentials:"
echo "   - Username: Your GitHub username"
echo "   - Password: Use a Personal Access Token (NOT your GitHub password)"
echo ""
echo "   To create a token:"
echo "   1. Go to: https://github.com/settings/tokens"
echo "   2. Generate new token (classic)"
echo "   3. Select 'repo' scope"
echo "   4. Copy and paste the token when prompted for password"
echo ""
echo "────────────────────────────────────────────────────────────────────────────"
echo ""

read -p "Ready to push? (y/n): " push_confirm
if [ "$push_confirm" != "y" ] && [ "$push_confirm" != "Y" ]; then
    echo "❌ Push cancelled"
    echo ""
    echo "You can manually push later with:"
    echo "   git push -u origin main"
    exit 0
fi

echo ""
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                          ║"
    echo "║                        🎉 SUCCESS! 🎉                                    ║"
    echo "║                                                                          ║"
    echo "╚══════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "✅ Code successfully pushed to GitHub!"
    echo ""
    echo "🔗 Repository URL:"
    echo "   https://github.com/$github_username/$repo_name"
    echo ""
    echo "────────────────────────────────────────────────────────────────────────────"
    echo ""
    echo "📝 Next Steps:"
    echo ""
    echo "1. Visit your repository:"
    echo "   https://github.com/$github_username/$repo_name"
    echo ""
    echo "2. (Optional) Enable GitHub Pages to host your app:"
    echo "   - Go to Settings → Pages"
    echo "   - Source: Deploy from branch → main → / (root)"
    echo "   - Your app will be live at:"
    echo "     https://$github_username.github.io/$repo_name/"
    echo ""
    echo "3. (Optional) Add topics to your repository:"
    echo "   expense-tracker, javascript, html-css, finance-app"
    echo ""
    echo "────────────────────────────────────────────────────────────────────────────"
    echo ""
    echo "💡 To update your code in the future, use:"
    echo "   git add ."
    echo "   git commit -m \"Your update message\""
    echo "   git push"
    echo ""
else
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                          ║"
    echo "║                        ❌ PUSH FAILED                                    ║"
    echo "║                                                                          ║"
    echo "╚══════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Common issues:"
    echo ""
    echo "1. Repository doesn't exist on GitHub"
    echo "   → Create it first at https://github.com/new"
    echo ""
    echo "2. Authentication failed"
    echo "   → Use a Personal Access Token instead of password"
    echo "   → Get one at: https://github.com/settings/tokens"
    echo ""
    echo "3. Permission denied"
    echo "   → Make sure you own the repository or have write access"
    echo ""
    echo "📖 For detailed help, see GITHUB_SETUP.md"
    echo ""
fi
