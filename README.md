# 🎓 VirtuBoard AI - Virtual Learning Platform

<div align="center">

![VirtuBoard AI](https://img.shields.io/badge/VirtuBoard-AI%20Powered-22c55e?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**An AI-powered virtual whiteboard for students with voice control, automatic note generation, and intelligent content management.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Voice Commands](#-voice-commands) • [API](#-api-integration)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [Voice Commands](#-voice-commands)
- [AI Features](#-ai-features)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

VirtuBoard AI is a next-generation virtual learning platform designed for students and educators. It combines traditional whiteboard functionality with cutting-edge AI capabilities, including:

- 🎤 **Voice-Controlled Interface** - Control everything hands-free
- 🤖 **AI-Powered Note Generation** - Automatic formatting and structuring
- 📊 **Smart Diagram Creation** - Flowcharts, UML, circuits, and mind maps
- 📝 **Intelligent Content Management** - AI-powered organization and cleaning
- ⏰ **Live Lecture Tracking** - Real-time schedule and attendance
- 💾 **Persistent Storage** - Never lose your work

### 🎯 Key Benefits

- **Accessibility**: Complete voice control for hands-free operation
- **Productivity**: AI automates tedious formatting and organization
- **Learning**: Generate study materials automatically from lectures
- **Flexibility**: Works in mock mode without API keys for development
- **Security**: Role-based authentication (Student/Teacher/Admin)

---

## ✨ Features

### 🎙️ Voice Recognition & Control

- **Voice Note Taking**: Speak and AI converts to formatted notes
- **Voice Commands**: 40+ commands to control entire system
- **Smart Voice Cleaning**: Natural language board management
- **Quick Mode**: Commands process in 1.5-2.5 seconds
- **Manual Stop**: Force immediate processing anytime

### 🤖 AI-Powered Features

| Feature | Description | Command Example |
|---------|-------------|-----------------|
| **Auto Note Generation** | Convert speech to structured notes | Voice write mode |
| **Content Enhancement** | Improve clarity and structure | "Enhance my content" |
| **Smart Summaries** | Extract key points automatically | "Summarize this" |
| **Study Questions** | Generate quiz questions | "Generate questions" |
| **Flowcharts** | Create process diagrams | "Create flowchart for bubble sort" |
| **UML Diagrams** | Class/Sequence diagrams | "Make UML diagram for user auth" |
| **Circuit Diagrams** | Electronics schematics | "Draw circuit with LED" |
| **Mind Maps** | Concept visualization | "Create mind map about AI" |
| **Smart Diagrams** | AI picks best diagram type | Voice command or button |
| **Content Organization** | Intelligent restructuring | "Organize this" |

### 📚 Board Management

- **Smart Cleaning**: Remove diagrams, code, or specific content
- **Undo/Redo**: 10-level history
- **Pin/Lock**: Protect important content
- **Download**: Export notes as text files
- **Auto-Save**: Real-time local and server sync
- **Usage Tracking**: Visual board usage indicator

### 👤 User Management

- **Multi-Role System**: Student, Teacher, Admin dashboards
- **Secure Authentication**: JWT-based with bcrypt hashing
- **Session Management**: Persistent login with localStorage
- **Profile Management**: User-specific settings

### ⏰ Live Features

- **Real-Time Clock**: Live time display
- **Lecture Tracking**: Current and next class information
- **Attendance System**: One-click attendance marking
- **Schedule Updates**: Automatic status changes

### 🎨 User Interface

- **Modern Design**: Clean, green-themed interface
- **Responsive**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: Optimized for all lighting conditions
- **Accessibility**: WCAG compliant with voice control

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: React Hooks
- **Voice Recognition**: Web Speech API

### Backend
- **API Routes**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT + bcryptjs
- **AI Integration**: Anthropic Claude API

### AI & ML
- **Model**: Claude Sonnet 4
- **Features**: Natural Language Processing, Code Generation, Diagram Creation
- **Mock Mode**: Free development without API keys

### Additional Tools
- **Diagrams**: Mermaid.js
- **Icons**: Font Awesome
- **Date/Time**: Native JavaScript APIs

---

## 📦 Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version

### Step 1: Clone Repository
```bash
