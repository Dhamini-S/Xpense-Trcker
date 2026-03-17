#!/bin/bash

# Xpense Tracker - Simple Start Script

echo "🚀 Starting Xpense Tracker..."
echo ""
echo "📍 Server will run at: http://localhost:8000"
echo ""
echo "Demo Credentials:"
echo "  Email: robert.chase@walnutai.com"
echo "  Password: demo@123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Python HTTP server
python3 -m http.server 8000
