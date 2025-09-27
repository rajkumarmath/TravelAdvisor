
# 🌍 Travel Safety Advisor

![Travel Safety Advisor])
![AI Powered]
![React]
![FastAPI]
![OpenAI]
**AI-Powered Global Travel Security Platform** — Get comprehensive safety advice for any destination in seconds, not hours.

---

## 🚀 Live Demo
###IF THE FRONTEND DOES NOT FETCH RESULTS, PLEASE WAKE UP THE BACKEND BY CLICKING-> (https://traveladvisorbackend.onrender.com/)





[🌍 Try It Live Now](https://traveladvisor28.netlify.app/)  
[![Live Demo](https://drive.google.com/file/d/1d7IiqBipvcBQVmDFx8f-nPXIeGLGFdh4/view?usp=sharing)

---




## 📖 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📱 Usage](#-usage)
- [🎯 Why We Built This](#-why-we-built-this)
- [🏗️ Architecture](#️-architecture)
- [🔧 Installation](#-installation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team](#-team)
- [🌟 Acknowledgments](#-acknowledgments)
- [📞 Contact](#-contact)

---

## ✨ Features

### 🛡️ Comprehensive Safety Coverage
- **Safety & Security:** Neighborhood ratings, transportation safety, risk factors  
- **Health & Wellness:** Vaccination requirements, medical facilities, health precautions  
- **Cultural Etiquette:** Local customs, basic phrases, cultural norms  
- **Emergency Contacts:** Police, ambulance, fire numbers  
- **Weather Forecast:** Current conditions and predictions  
- **Local Laws:** Important regulations and legal considerations  

### 🤖 AI-Powered Intelligence
- **GPT-4 Integration:** Intelligent analysis of travel destinations  
- **Real-time Processing:** Always up-to-date information  
- **Structured Data:** Clean, organized presentation of complex information  
- **Context Awareness:** Personalized advice based on travel dates and location  

### 📱 Modern User Experience
- **Beautiful UI:** Gradient designs, card-based layout, professional appearance  
- **Mobile-First:** Fully responsive across devices  
- **Fast Loading:** Optimized performance with Vite  
- **Intuitive Navigation:** Three-click process to comprehensive safety insights  

---

## 🛠️ Tech Stack

### Frontend
![React]
![Tailwind CSS]
![Vite] 

### Backend
![FastAPI]
![Python] 
![OpenAI]

### Deployment
![Netlify]
![Render]
---

## 🚀 Quick Start

### 1. Try the Live Demo
Visit: (https://traveladvisor28.netlify.app)

### 2. Example Usage
**Input:** Destination: City (Paris), Country (France)  
**Select Dates:** Choose travel period  
**Output:** Comprehensive safety analysis  

---

## 📱 Usage

**For Travelers**
- Plan Your Trip: Research safety before booking  
- Stay Informed: Understand local customs and laws  
- Be Prepared: Emergency contacts at hand  
- Travel Smart: Make informed decisions  

**For Developers**
```javascript
// Example API call
const response = await fetch(
  `https://traveladvisorbackend.onrender.com/advice?city=Paris&country=France&start_date=2024-01-01&end_date=2024-01-10`
);
const safetyData = await response.json();
````

---

## 🎯 Why We Built This

**The Problem**

* ❌ Info scattered across multiple sites
* ❌ Time-consuming research
* ❌ Inconsistent data quality
* ❌ Most sources not mobile-friendly

**Our Solution**

* ✅ One Platform for all travel safety info
* ✅ AI-Powered contextual analysis
* ✅ Instant results
* ✅ Professional, mobile-friendly design

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────┐
│   Frontend      │    │    Backend       │    │   AI Engine    │
│ React.js        │◄──►│ FastAPI          │◄──►│ OpenAI GPT-4   │
│ Tailwind CSS    │    │ Python           │    │                │
│ Vite            │    │                  │    │                │
│ Netlify Deploy  │    │ Render Deploy    │    │                │
└─────────────────┘    └──────────────────┘    └────────────────┘
```

**Data Flow:**
User Input → AI Processing → Structured Response → Beautiful Display

---

## 🔧 Installation

**Prerequisites**

* Node.js ≥16
* Python ≥3.8
* OpenAI API Key

**Frontend**

```bash
git clone https://github.com/rajkumarmath/TravelAdvisor.git
cd TravelAdvisor/frontend
npm install
npm run dev    # Start dev server
npm run build  # Production build
```

**Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
export OPENAI_API_KEY=your_api_key_here
uvicorn main:app --reload
```

**Customization**
Edit `src/App.jsx` for colors or styles:

```jsx
// Example gradient
bg-gradient-to-br from-blue-500 to-purple-600
```

---

## 🤝 Contributing

* Fork the repository
* Create a feature branch: `git checkout -b feature/awesome-feature`
* Commit changes: `git commit -m "Add awesome feature"`
* Push: `git push origin feature/awesome-feature`
* Open a Pull Request

**Report Issues** or suggest features via GitHub Issues.

---

## 👥 Team

-> RajKumar Math
-> Meghana U
-> Namira Saniya

---

## 🌟 Acknowledgments

* OpenAI GPT-4-o API
* Render for backend hosting
* Netlify for frontend deployment
* FastAPI & React for web frameworks

---

## 📞 Contact

* **Live Demo:** [Travel Safety Advisor](https://traveladvisor28.netlify.app/)
* **GitHub:** [rajkumarmath/TravelAdvisor](https://github.com/rajkumarmath/TravelAdvisor)
* **Issues:** GitHub Issues


