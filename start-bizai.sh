#!/bin/bash

echo "Starting BizAI Application..."
echo

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if ports are available
if ! check_port 4000; then
    echo "Backend port 4000 is already in use. Please stop the existing process."
    exit 1
fi

if ! check_port 5173; then
    echo "Frontend port 5173 is already in use. Please stop the existing process."
    exit 1
fi

echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend Development Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "🚀 BizAI is starting up!"
echo "📊 Backend API: http://localhost:4000"
echo "🌐 Frontend App: http://localhost:5173"
echo "📰 Live News: Enabled with NewsAPI"
echo
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo
    echo "Stopping BizAI servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "All servers stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait