# AI Chat Travel Planner

## Project Overview

The **AI Chat Travel Planner** is an intelligent trip planning application that utilizes the power of LLMs to create a unique user experience for booking and managing travel itineraries. Users can interact with an AI chatbot that suggests locations, activities, and handles calendar bookings seamlessly. 

### **Core Features:**
- **AI-Powered Travel Planning** – Chat with an AI to plan and customize trips.
- **Automated Calendar Booking** – AI schedules activities and events directly into a calendar.
- **Trip & Calendar Pages** – Users can manually tweak and monitor planned trips.
- **Activity Customization** – Modify AI-suggested plans to match personal preferences.

## Running the Project Locally

### **1. Clone the repository**
```sh
git clone https://github.com/yourusername/ai-chat-travel-planner.git
cd ai-chat-travel-planner
```

### **2. Setup the Backend**
```sh
cd api
npm install
```
Create a `.env` file in the `api/` directory and add the following variables:
```env
BASE_URL=http://localhost:3000
GOOGLE_API_KEY=your_google_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```
Then, start the server:
```sh
npm run dev
```

### **3. Setup the Frontend**
```sh
cd ../travel-chat-react
npm install
```
Create a `.env` file in the `travel-chat-react/` directory and add:
```env
VITE_SERVER_URL=http://localhost:3000
```
Then, start the React app:
```sh
npm run dev
```

## Deployment

### **Backend (AWS EC2)**
- The backend is hosted on an **AWS EC2 instance**.
- The server is managed using **WSL and PM2**.
- Environment variables for production are stored securely.

### **Frontend**
- The React app can be deployed on **Vercel, Netlify, or any static hosting service**.

## Future Enhancements
- **Additional Clients**: Vue, Angular, and other frontend frameworks.
- **More AI Features**: Smarter recommendations and deeper itinerary customization.
- **Mobile App**: A React Native version for iOS and Android.

---

### **Contributing**
Pull requests are welcome! If you’d like to contribute, please fork the repository and submit a PR.

---

### **License**
This project is licensed under the MIT License.
