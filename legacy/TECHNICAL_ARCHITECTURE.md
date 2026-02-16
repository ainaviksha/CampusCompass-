# Technical Architecture & Implementation Guide

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Client Application                       │
│                    (React + Tailwind CSS)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Form Module  │  │   Discovery  │  │   Checkout   │      │
│  │              │→ │    Module    │→ │    Module    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                  ↓                  ↓             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          State Management (React Hooks)             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer                           │
│                    (Node.js/Express)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Lead Manager │  │  Eligibility │  │   Payment    │      │
│  │              │  │    Engine    │  │   Gateway    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                  ↓                  ↓             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Database (MongoDB/PostgreSQL)          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ SMS Provider │  │   Razorpay   │  │ Email Service│      │
│  │  (MSG91)     │  │   (Payment)  │  │  (SendGrid)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

### Recommended Folder Organization
```
master-engineering-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── Form/
│   │   │   ├── MasterForm.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   └── ExamScoresGrid.jsx
│   │   │
│   │   ├── Discovery/
│   │   │   ├── CollegeCard.jsx
│   │   │   ├── CategorySection.jsx
│   │   │   ├── FloatingActionBar.jsx
│   │   │   └── DiscoveryPage.jsx
│   │   │
│   │   ├── Modals/
│   │   │   ├── CheckoutModal.jsx
│   │   │   └── AISummaryModal.jsx
│   │   │
│   │   └── Shared/
│   │       ├── Header.jsx
│   │       ├── TrustBadge.jsx
│   │       └── Button.jsx
│   │
│   ├── data/
│   │   └── colleges.js
│   │
│   ├── utils/
│   │   ├── eligibilityEngine.js
│   │   ├── pricing.js
│   │   └── validation.js
│   │
│   ├── hooks/
│   │   ├── useFormData.js
│   │   ├── useCollegeSelection.js
│   │   └── usePayment.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── payment.js
│   │   └── analytics.js
│   │
│   ├── App.jsx
│   ├── index.js
│   └── index.css
│
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🔧 Component Breakdown

### 1. MasterForm Component
**Responsibility**: Collect student data and exam scores

```jsx
import React from 'react';
import OTPVerification from './OTPVerification';
import ExamScoresGrid from './ExamScoresGrid';

const MasterForm = ({ formData, onChange, onSubmit, otpVerified }) => {
  return (
    <div className="form-container">
      {/* Essential fields */}
      <input name="studentName" value={formData.studentName} onChange={onChange} />
      
      {/* OTP component */}
      <OTPVerification 
        contact={formData.contact}
        onVerify={setOtpVerified}
      />
      
      {/* Exam scores */}
      <ExamScoresGrid formData={formData} onChange={onChange} />
      
      {/* Optional details accordion */}
      <details>
        {/* PCM marks, Olympiads, etc. */}
      </details>
      
      <button onClick={onSubmit} disabled={!otpVerified}>
        Continue to College Selection
      </button>
    </div>
  );
};
```

**Props**:
- `formData`: Object containing all form fields
- `onChange`: Handler for input changes
- `onSubmit`: Form submission handler
- `otpVerified`: Boolean OTP verification status

---

### 2. CollegeCard Component
**Responsibility**: Display individual college with selection state

```jsx
const CollegeCard = ({ college, isSelected, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(college)}
      className={`college-card ${isSelected ? 'selected' : ''}`}
    >
      {isSelected && <CheckmarkBadge />}
      
      <div className="college-name">{college.name}</div>
      <div className="college-icon">
        <GraduationCap />
      </div>
      
      <div className="college-details">
        <span>{college.city}</span>
        <span>{college.avgPackage}</span>
      </div>
    </div>
  );
};
```

**Props**:
- `college`: College object with all details
- `isSelected`: Boolean selection state
- `onToggle`: Function to handle selection toggle

---

### 3. CategorySection Component
**Responsibility**: Render horizontal scrolling college section

```jsx
const CategorySection = ({ 
  title, 
  colleges, 
  selectedColleges, 
  onToggle,
  isExpanded,
  onExpandToggle 
}) => {
  return (
    <section>
      <div className="section-header">
        <h2>{title}</h2>
        <button onClick={onExpandToggle}>
          {isExpanded ? 'Show Less' : 'Expand All'}
        </button>
      </div>
      
      <div className={isExpanded ? 'grid-layout' : 'horizontal-scroll'}>
        {colleges.map(college => (
          <CollegeCard
            key={college.id}
            college={college}
            isSelected={selectedColleges.includes(college.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
};
```

---

### 4. FloatingActionBar Component
**Responsibility**: Show selection count and action buttons

```jsx
const FloatingActionBar = ({ 
  selectedCount, 
  onApplyNow, 
  onLearnMore 
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl">
      <div className="container">
        <div className="selection-info">
          <span>{selectedCount} Colleges</span>
        </div>
        
        <div className="actions">
          <button onClick={onLearnMore} className="btn-secondary">
            Learn More
          </button>
          <button onClick={onApplyNow} className="btn-primary">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## 🧮 Business Logic

### Eligibility Engine Algorithm

```javascript
// utils/eligibilityEngine.js

export const calculateEligibility = (formData) => {
  const jee = parseInt(formData.jeeMains) || 0;
  const hasOlympiad = Boolean(
    formData.olympiadPhysics || 
    formData.olympiadMath || 
    formData.olympiadOther
  );
  
  // Scoring system
  let score = 0;
  
  // JEE score (60% weight)
  if (jee > 250) score += 60;
  else if (jee > 200) score += 50;
  else if (jee > 150) score += 40;
  else if (jee > 100) score += 30;
  else score += 20;
  
  // Olympiad bonus (15% weight)
  if (hasOlympiad) score += 15;
  
  // PCM marks (10% weight)
  const pcmAvg = (
    parseInt(formData.physics || 0) +
    parseInt(formData.chemistry || 0) +
    parseInt(formData.math || 0)
  ) / 3;
  
  if (pcmAvg > 90) score += 10;
  else if (pcmAvg > 75) score += 7;
  else score += 5;
  
  // Other exams (15% weight)
  const hasOtherExams = Boolean(
    formData.bitsat || formData.comedk || 
    formData.kcet || formData.mhtcet
  );
  if (hasOtherExams) score += 10;
  
  // Profile classification
  if (score >= 70) return 'elite';
  if (score >= 50) return 'balanced';
  return 'skill-first';
};

export const getRecommendedColleges = (profile, allColleges) => {
  const recommendations = [];
  
  switch(profile) {
    case 'elite':
      recommendations.push(
        ...allColleges.elite,
        ...allColleges.newAge.slice(0, 3),
        ...allColleges.affordable.slice(0, 3)
      );
      break;
      
    case 'balanced':
      recommendations.push(
        ...allColleges.affordable.slice(0, 5),
        ...allColleges.newAge,
        ...allColleges.online
      );
      break;
      
    case 'skill-first':
      recommendations.push(
        ...allColleges.newAge,
        ...allColleges.affordable.slice(0, 4),
        ...allColleges.online
      );
      break;
  }
  
  return recommendations;
};
```

---

### Pricing Logic

```javascript
// utils/pricing.js

export const calculatePricing = (selectedColleges) => {
  const BASE_FEE = 500; // Per college
  const count = selectedColleges.length;
  
  const subtotal = count * BASE_FEE;
  
  // Discount tiers
  let discountPercent = 0;
  if (count >= 10) discountPercent = 30;
  else if (count >= 7) discountPercent = 25;
  else if (count >= 4) discountPercent = 20;
  else if (count >= 2) discountPercent = 10;
  
  const discountAmount = Math.floor(subtotal * discountPercent / 100);
  const total = subtotal - discountAmount;
  
  return {
    subtotal,
    discountPercent,
    discountAmount,
    total,
    savings: discountAmount
  };
};
```

---

### Form Validation

```javascript
// utils/validation.js

export const validateForm = (formData) => {
  const errors = {};
  
  // Required fields
  if (!formData.studentName?.trim()) {
    errors.studentName = 'Student name is required';
  }
  
  if (!formData.parentName?.trim()) {
    errors.parentName = 'Parent name is required';
  }
  
  if (!formData.contact?.match(/^\d{10}$/)) {
    errors.contact = 'Valid 10-digit mobile number required';
  }
  
  if (!formData.jeeMains || formData.jeeMains < 0 || formData.jeeMains > 300) {
    errors.jeeMains = 'JEE Mains marks must be between 0 and 300';
  }
  
  // Exam scores validation
  const examFields = [
    'bitsat', 'comedk', 'kcet', 'mhtcet',
    'eapcet', 'viteee', 'srmjee', 'wbjee'
  ];
  
  examFields.forEach(field => {
    const value = formData[field];
    if (value && (value < 0 || value > 500)) {
      errors[field] = `${field.toUpperCase()} score must be between 0 and 500`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

---

## 🔌 Backend API Specification

### 1. Submit Lead
```
POST /api/leads

Request Body:
{
  "studentData": {
    "name": "Rahul Kumar",
    "parentName": "Suresh Kumar",
    "contact": "9876543210",
    "email": "rahul@example.com"
  },
  "examData": {
    "jeeMains": 245,
    "bitsat": 320,
    "comedk": 180
  },
  "academicData": {
    "board": "CBSE",
    "physics": 92,
    "chemistry": 88,
    "math": 95,
    "cs": 90
  },
  "selectedColleges": [
    { "id": "scaler", "name": "Scaler School of Technology" },
    { "id": "ashoka", "name": "Ashoka University" }
  ],
  "eligibilityProfile": "elite"
}

Response:
{
  "success": true,
  "leadId": "LEAD_2024_001234",
  "confirmationNumber": "MENG24567",
  "timestamp": "2024-02-15T10:30:00Z",
  "message": "Application submitted successfully"
}
```

---

### 2. Get Colleges
```
GET /api/colleges

Query Parameters:
- category: new-age | affordable | elite | online
- limit: number (default: 50)

Response:
{
  "success": true,
  "colleges": [
    {
      "id": "scaler",
      "name": "Scaler School of Technology",
      "category": "new-age",
      "city": "Bangalore",
      "year": 2019,
      "batch": 300,
      "avgPackage": "12 LPA",
      "highestPackage": "45 LPA",
      "fees": "4.5 Lakh",
      "roi": 266,
      "alumni": 1200,
      "logoUrl": "/assets/logos/scaler.png",
      "websiteUrl": "https://scaler.com"
    }
  ]
}
```

---

### 3. Initiate Payment
```
POST /api/payment/initiate

Request Body:
{
  "leadId": "LEAD_2024_001234",
  "amount": 4500,
  "collegeCount": 10,
  "paymentMethod": "razorpay"
}

Response:
{
  "success": true,
  "orderId": "order_KJHGfdsa123",
  "amount": 4500,
  "currency": "INR",
  "razorpayKey": "rzp_test_xxxxx",
  "callbackUrl": "/api/payment/callback"
}
```

---

### 4. Payment Callback
```
POST /api/payment/callback

Request Body:
{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}

Response:
{
  "success": true,
  "paymentStatus": "captured",
  "leadId": "LEAD_2024_001234",
  "receiptUrl": "/receipts/LEAD_2024_001234.pdf"
}
```

---

## 🗄️ Database Schema

### MongoDB Collections

#### 1. Leads Collection
```javascript
{
  "_id": ObjectId("..."),
  "leadId": "LEAD_2024_001234",
  "confirmationNumber": "MENG24567",
  "student": {
    "name": "Rahul Kumar",
    "parentName": "Suresh Kumar",
    "contact": "9876543210",
    "email": "rahul@example.com",
    "contactVerified": true
  },
  "exams": {
    "jeeMains": 245,
    "bitsat": 320,
    "comedk": 180,
    "kcet": null,
    "mhtcet": null,
    "eapcet": null,
    "viteee": null,
    "srmjee": null,
    "wbjee": null
  },
  "academic": {
    "board": "CBSE",
    "homeState": "Karnataka",
    "physics": 92,
    "chemistry": 88,
    "math": 95,
    "cs": 90,
    "olympiads": {
      "physics": "State Level",
      "math": null,
      "other": null
    }
  },
  "eligibility": {
    "profile": "elite",
    "score": 75,
    "recommendedCategories": ["elite", "new-age"]
  },
  "selectedColleges": [
    {
      "collegeId": "scaler",
      "name": "Scaler School of Technology",
      "category": "new-age",
      "applicationFee": 500
    }
  ],
  "payment": {
    "status": "completed",
    "orderId": "order_xxxxx",
    "paymentId": "pay_xxxxx",
    "amount": 4500,
    "discount": 500,
    "finalAmount": 4000,
    "timestamp": ISODate("2024-02-15T10:35:00Z")
  },
  "status": "submitted",
  "submittedAt": ISODate("2024-02-15T10:30:00Z"),
  "updatedAt": ISODate("2024-02-15T10:35:00Z")
}
```

#### 2. Colleges Collection
```javascript
{
  "_id": ObjectId("..."),
  "collegeId": "scaler",
  "name": "Scaler School of Technology",
  "slug": "scaler-school-of-technology",
  "category": "new-age",
  "location": {
    "city": "Bangalore",
    "state": "Karnataka",
    "address": "..."
  },
  "established": 2019,
  "details": {
    "batch": 300,
    "campusSize": "5 acres",
    "facultyCount": 50,
    "totalSeats": 300
  },
  "placements": {
    "avgPackage": "12 LPA",
    "highestPackage": "45 LPA",
    "medianPackage": "10 LPA",
    "placementRate": 95,
    "topRecruiters": ["Google", "Amazon", "Microsoft"]
  },
  "financial": {
    "fees": "4.5 Lakh",
    "feesBreakdown": {
      "tuition": 3.5,
      "hostel": 0.8,
      "other": 0.2
    },
    "roi": 266,
    "scholarships": true
  },
  "alumni": {
    "total": 1200,
    "notable": ["Name 1", "Name 2"]
  },
  "assets": {
    "logoUrl": "/assets/logos/scaler.png",
    "coverUrl": "/assets/covers/scaler.jpg",
    "websiteUrl": "https://scaler.com",
    "galleryUrls": [...]
  },
  "eligibility": {
    "examsAccepted": ["JEE", "BITSAT", "Internal"],
    "minJEE": 100,
    "minPercentage": 75
  },
  "featured": true,
  "active": true,
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-02-01T00:00:00Z")
}
```

---

## 🔐 Environment Variables

```bash
# .env.example

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/master-engineering-app
DB_NAME=master_eng_app

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
PAYMENT_CALLBACK_URL=http://localhost:3000/api/payment/callback

# SMS Gateway
MSG91_AUTH_KEY=xxxxx
MSG91_SENDER_ID=MENGAP
OTP_TEMPLATE_ID=xxxxx

# Email Service
SENDGRID_API_KEY=xxxxx
FROM_EMAIL=noreply@masterengineering.com
ADMIN_EMAIL=admin@masterengineering.com

# Analytics
GOOGLE_ANALYTICS_ID=UA-xxxxx
MIXPANEL_TOKEN=xxxxx

# Storage
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_BUCKET_NAME=master-eng-assets
AWS_REGION=ap-south-1

# Security
JWT_SECRET=xxxxx
ENCRYPTION_KEY=xxxxx
CORS_ORIGIN=http://localhost:3000

# Feature Flags
ENABLE_OTP_VERIFICATION=true
ENABLE_PAYMENT=true
ENABLE_EMAIL_NOTIFICATIONS=true
```

---

## 🧪 Testing Strategy

### Unit Tests (Jest + React Testing Library)

```javascript
// __tests__/utils/eligibilityEngine.test.js

import { calculateEligibility, getRecommendedColleges } from '../utils/eligibilityEngine';

describe('Eligibility Engine', () => {
  test('classifies high JEE score as elite', () => {
    const formData = { jeeMains: 250 };
    expect(calculateEligibility(formData)).toBe('elite');
  });
  
  test('considers Olympiad achievements', () => {
    const formData = { 
      jeeMains: 180,
      olympiadPhysics: 'National' 
    };
    expect(calculateEligibility(formData)).toBe('elite');
  });
  
  test('recommends correct colleges for skill-first profile', () => {
    const colleges = getRecommendedColleges('skill-first', mockColleges);
    expect(colleges).toContain(mockColleges.newAge[0]);
  });
});
```

### Integration Tests

```javascript
// __tests__/integration/application-flow.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import MasterEngineeringApp from '../App';

describe('Application Flow', () => {
  test('completes full application journey', async () => {
    render(<MasterEngineeringApp />);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Student Name'), {
      target: { value: 'Rahul Kumar' }
    });
    
    // Verify OTP
    fireEvent.click(screen.getByText('Verify OTP'));
    
    // Submit form
    fireEvent.click(screen.getByText('Continue to College Selection'));
    
    // Select college
    const collegeCard = await screen.findByText('Scaler School of Technology');
    fireEvent.click(collegeCard);
    
    // Open checkout
    fireEvent.click(screen.getByText('Apply Now'));
    
    // Verify checkout modal
    expect(screen.getByText('Complete Your Application')).toBeInTheDocument();
  });
});
```

---

## 📊 Analytics Implementation

### Google Analytics Events

```javascript
// services/analytics.js

export const trackFormSubmission = (formData) => {
  if (window.gtag) {
    window.gtag('event', 'form_submission', {
      event_category: 'Application',
      event_label: 'Master Form Completed',
      value: 1
    });
  }
};

export const trackCollegeSelection = (college, action) => {
  if (window.gtag) {
    window.gtag('event', 'college_selection', {
      event_category: 'Selection',
      event_label: `${action}: ${college.name}`,
      college_id: college.id,
      college_category: college.category
    });
  }
};

export const trackCheckoutInitiated = (selectedColleges, amount) => {
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      event_category: 'Ecommerce',
      value: amount,
      currency: 'INR',
      items: selectedColleges.map(c => ({
        item_id: c.id,
        item_name: c.name,
        item_category: c.category,
        price: 500
      }))
    });
  }
};

export const trackPaymentSuccess = (orderId, amount) => {
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: amount,
      currency: 'INR',
      event_category: 'Ecommerce'
    });
  }
};
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel/Netlify)

```bash
# Build command
npm run build

# Output directory
build/

# Environment variables (set in Vercel dashboard)
REACT_APP_API_URL=https://api.masterengineering.com
REACT_APP_RAZORPAY_KEY=rzp_live_xxxxx
```

### Backend Deployment (AWS/Heroku)

```bash
# Install dependencies
npm install

# Start server
npm start

# Process manager (PM2)
pm2 start server.js --name master-eng-api
pm2 save
pm2 startup
```

### Database Hosting
- MongoDB Atlas (recommended)
- Self-hosted MongoDB on AWS EC2
- Managed PostgreSQL on AWS RDS (alternative)

---

## 📈 Performance Benchmarks

### Target Metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimization Checklist
- [ ] Enable gzip/brotli compression
- [ ] Implement lazy loading for images
- [ ] Code splitting for routes
- [ ] CDN for static assets
- [ ] Database indexing on frequently queried fields
- [ ] Redis caching for college data
- [ ] Service worker for offline support

---

**This architecture is scalable to 100,000+ concurrent users with proper infrastructure.**
