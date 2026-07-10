## Overview
CodePilot AI is a codebase intelligence platform that acts as a library for repositories. It allows developers to ingest public GitHub repositories, semantic search files, and engage in context-aware conversations with their code.

## Features
- **Repository Ingestion**: Ingest and extract public GitHub codebases on demand.
- **Semantic Vector Search**: Chunk files and query them using MongoDB Atlas Vector Search.
- **Intelligent RAG Chat**: Engages in context-aware chat queries about codebases using Gemini.
- **Profile Dashboard**: Manage user credentials, delete accounts, and resume past chat history.

## Techstack
- **Frontend**: React (Vite), Ant Design, Axios, React Router.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI Integration**: Google Generative AI SDK (Gemini Flash & Embeddings).
- **DevOps**: Docker, Docker Compose, Vercel, Render.

## Setup guide
1. Configure environment variables in `server/.env` and `client/.env`.
2. Start the backend: `cd server && npm install && npm run dev`
3. Start the frontend: `cd client && npm install && npm run dev`
4. Or run containerized locally: `docker-compose up --build`

## Deployed link: 
https://code-pilot-rust.vercel.app/