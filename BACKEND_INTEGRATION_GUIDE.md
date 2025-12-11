# 🔌 Backend Integration Guide for VibeMatch

This guide provides a comprehensive plan for integrating a backend API with the VibeMatch application for production use.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [API Architecture](#api-architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Migration Strategy](#migration-strategy)
7. [Implementation Steps](#implementation-steps)
8. [Security Considerations](#security-considerations)

---

## 🎯 Overview

Currently, VibeMatch uses browser localStorage for all data persistence. For production, you'll want to integrate a backend API with a database to:

- Enable multi-device access
- Implement real authentication
- Store data securely
- Enable real-time features
- Scale the application
- Add analytics and monitoring

---

## 🏗️ API Architecture

### Recommended Tech Stack

**Backend Framework Options:**
- **Node.js + Express** (Recommended - JavaScript consistency)
- **Python + FastAPI** (Fast and modern)
- **Node.js + Next.js API Routes** (Same framework, easy integration)

**Database Options:**
- **PostgreSQL** (Recommended - robust, relational)
- **MongoDB** (NoSQL, flexible schema)
- **Supabase** (PostgreSQL + real-time features)

**Authentication:**
- **JWT (JSON Web Tokens)** (Stateless, scalable)
- **NextAuth.js** (If using Next.js API routes)
- **OAuth 2.0** (For social login)

**Hosting:**
- **Vercel** (For Next.js - easy deployment)
- **AWS** (Scalable, enterprise-grade)
- **Railway/Render** (Simple deployment)

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  photo_url TEXT,
  bio TEXT,
  age_group VARCHAR(50),
  value_answers JSONB,
  content_answers JSONB,
  preferences JSONB,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_age ON users(age);
```

### Matches Table

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL,
  matched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
```

### User Actions Table

```sql
CREATE TABLE user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'like', 'pass', 'super_like'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_actions_user ON user_actions(user_id);
CREATE INDEX idx_user_actions_target ON user_actions(target_user_id);
CREATE INDEX idx_user_actions_type ON user_actions(action_type);
```

### Conversations Table

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON conversations(user2_id);
```

### Messages Table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);
```

### Bot Profiles Table

```sql
CREATE TABLE bot_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profile_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bot_profiles_user ON bot_profiles(user_id);
```

---

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
POST   /api/auth/refresh       - Refresh JWT token
GET    /api/auth/me            - Get current user
```

### User Endpoints

```
GET    /api/users              - Get all users (with filters)
GET    /api/users/:id          - Get user by ID
PUT    /api/users/:id          - Update user profile
DELETE /api/users/:id          - Delete user account
GET    /api/users/:id/matches  - Get user's matches
```

### Matching Endpoints

```
GET    /api/matches            - Get user's matches
POST   /api/matches            - Create a match
DELETE /api/matches/:id        - Unmatch
GET    /api/matches/suggestions - Get match suggestions
```

### Actions Endpoints

```
POST   /api/actions/like       - Like a user
POST   /api/actions/pass       - Pass on a user
GET    /api/actions/likes      - Get who liked you
GET    /api/actions/stats      - Get action statistics
```

### Messaging Endpoints

```
GET    /api/conversations      - Get all conversations
GET    /api/conversations/:id  - Get conversation by ID
POST   /api/conversations      - Create new conversation
GET    /api/conversations/:id/messages - Get messages
POST   /api/conversations/:id/messages - Send message
PUT    /api/messages/:id/read  - Mark message as read
```

### Bot Endpoints

```
GET    /api/bot/profile        - Get bot profile
PUT    /api/bot/profile        - Update bot profile
POST   /api/bot/reply          - Generate bot reply
```

### Subscription Endpoints

```
GET    /api/subscription       - Get subscription status
POST   /api/subscription/upgrade - Upgrade to premium
POST   /api/subscription/cancel - Cancel subscription
```

---

## 🔐 Authentication

### JWT Implementation Example

```javascript
// lib/auth.js (Backend)
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next();
}
```

### Client-Side Implementation

```javascript
// lib/api.js (Frontend)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Usage
export async function getCurrentUser() {
  return apiRequest('/auth/me');
}

export async function getAllUsers(filters) {
  const queryParams = new URLSearchParams(filters).toString();
  return apiRequest(`/users?${queryParams}`);
}

export async function likeUser(userId) {
  return apiRequest('/actions/like', {
    method: 'POST',
    body: JSON.stringify({ targetUserId: userId }),
  });
}
```

---

## 🔄 Migration Strategy

### Phase 1: Setup Backend Infrastructure
1. Set up database (PostgreSQL recommended)
2. Create database schema
3. Set up API server
4. Implement authentication

### Phase 2: Create API Layer
1. Implement all API endpoints
2. Add input validation
3. Add error handling
4. Add rate limiting

### Phase 3: Update Frontend
1. Create API client library
2. Replace localStorage calls with API calls
3. Add loading states
4. Add error handling

### Phase 4: Data Migration
1. Export existing localStorage data
2. Create migration script
3. Import data to database
4. Verify data integrity

### Phase 5: Testing & Deployment
1. Test all endpoints
2. Test frontend integration
3. Deploy backend
4. Deploy frontend
5. Monitor and fix issues

---

## 🛠️ Implementation Steps

### Step 1: Create API Client

Create `lib/api.js`:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') 
      : null;

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'API Error');
    }

    return response.json();
  }

  // Auth methods
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  // User methods
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async getAllUsers(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/users?${query}`);
  }

  async updateUser(userId, data) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Match methods
  async getMatches() {
    return this.request('/matches');
  }

  async likeUser(userId) {
    return this.request('/actions/like', {
      method: 'POST',
      body: JSON.stringify({ targetUserId: userId }),
    });
  }

  // Message methods
  async getConversations() {
    return this.request('/conversations');
  }

  async sendMessage(conversationId, text) {
    return this.request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }
}

export default new ApiClient();
```

### Step 2: Update localStorage.js

Modify to use API client:

```javascript
import apiClient from './api';

export async function getCurrentUser() {
  try {
    return await apiClient.getCurrentUser();
  } catch (error) {
    // Fallback to localStorage for development
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}

// Similar updates for other functions...
```

### Step 3: Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
JWT_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/vibematch
```

---

## 🔒 Security Considerations

### 1. Authentication
- Use HTTPS in production
- Store JWT tokens securely (httpOnly cookies recommended)
- Implement token refresh mechanism
- Add rate limiting to auth endpoints

### 2. Data Validation
- Validate all inputs on backend
- Sanitize user inputs
- Use parameterized queries (prevent SQL injection)
- Validate file uploads

### 3. Authorization
- Check user permissions on every request
- Don't trust client-side data
- Implement role-based access control

### 4. API Security
- Use CORS properly
- Implement rate limiting
- Add request validation
- Log security events

### 5. Data Privacy
- Encrypt sensitive data
- Implement GDPR compliance
- Add data retention policies
- Secure file storage

---

## 📦 Example Backend Structure (Node.js + Express)

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── match.controller.js
│   │   └── message.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Match.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── match.routes.js
│   │   └── message.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── validation.js
│   └── app.js
├── migrations/
├── tests/
├── .env
└── package.json
```

---

## 🚀 Quick Start Example

### Using Next.js API Routes

If you want to keep everything in Next.js, you can use API routes:

```javascript
// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Find user
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (!user.rows[0]) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return NextResponse.json({ token, user: user.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

---

## 📝 Next Steps

1. **Choose your backend stack** (Node.js/Express recommended)
2. **Set up database** (PostgreSQL recommended)
3. **Create API endpoints** following the schema above
4. **Implement authentication** with JWT
5. **Update frontend** to use API client
6. **Test thoroughly** before production deployment
7. **Deploy** backend and frontend
8. **Monitor** and iterate

---

## 🔗 Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/) - JWT debugging and information
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Note:** This is a comprehensive guide. Start with Phase 1 and work through each phase systematically. Consider using a backend-as-a-service like Supabase or Firebase for faster implementation.

