#!/bin/bash

# Super update script for Weather App
echo "🌤 Starting Weather App update..."

# Pull remote changes first (handle conflicts)
git pull origin main --allow-unrelated-histories

# Add all local changes
git add .

# Commit with message
read -p "Enter commit message: " msg
git commit -m "$msg"

# Push to GitHub
git push origin main

# Open live GitHub Pages URL
read -p "Enter your live GitHub Pages URL (e.g., https://username.github.io/weather-app/): " liveURL
termux-open-url $liveURL

echo "✅ Weather App updated and live!"
