// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import passport from './config/passportConfig.js'; // Initialize Passport
// import router from './routes/route.js';
// import cookieParser from 'cookie-parser';

// // Load env variabls
// dotenv.config();
// const port = process.env.PORT?.trim() || 3000;
// const env = process.env.NODE_ENV?.trim() || 'development';

// // set app
// const app = express();

// // body parser
// app.use(bodyParser.json({ limit: '50mb' }));
// // cookie parser
// app.use(cookieParser());

// // Middlewares
// const allowedOrigin = 'http://localhost:5173'; // currently set to local front end client
// // app.use(cors({ origin: '*' }));
// app.use(
//   cors({
//     origin: allowedOrigin, // Specify the frontend origin
//     credentials: true, // Allow cookies to be sent with requests
//   })
// );

// // Initialize passport
// app.use(passport.initialize());

// // Routes
// app.use(express.static('./public'));
// app.use('/api', router);

// // Start server
// const start = async () => {
//   try {
//     app.listen(port, () => {
//       console.log(`Server is listening on port ${port}`);
//     });
//   } catch (error) {
//     console.error('Error starting server:', error);
//   }
// };

// start();

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from './config/passportConfig.js'; // Initialize Passport
import router from './routes/route.js';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import https from 'https';
import http from 'http';

// Load environment variables
dotenv.config();
const port = process.env.PORT?.trim() || 3000;
const env = process.env.NODE_ENV?.trim() || 'development';

const app = express();

// Body parser
app.use(bodyParser.json({ limit: '50mb' }));
// Cookie parser
app.use(cookieParser());

// CORS settings
const allowedOrigin =
  env === 'production'
    ? 'https://travel-chat.dorplaut.com'
    : 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Initialize passport
app.use(passport.initialize());

// Routes
app.use(express.static('./public'));
app.use('/api', router);

// Start server with HTTPS only in production
const start = async () => {
  try {
    if (env === 'production') {
      const options = {
        key: fs.readFileSync(
          '/etc/letsencrypt/live/travel-chat.dorplaut.com/privkey.pem'
        ),
        cert: fs.readFileSync(
          '/etc/letsencrypt/live/travel-chat.dorplaut.com/fullchain.pem'
        ),
      };

      https.createServer(options, app).listen(443, () => {
        console.log('✅ HTTPS Server running on port 443 (Production)');
      });

      // Redirect HTTP to HTTPS
      http
        .createServer((req, res) => {
          res.writeHead(301, {
            Location: `https://${req.headers.host}${req.url}`,
          });
          res.end();
        })
        .listen(80, () => {
          console.log('🔄 Redirecting all HTTP traffic to HTTPS...');
        });
    } else {
      app.listen(port, () => {
        console.log(`🚀 Server running in ${env} mode on port ${port}`);
      });
    }
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
};

start();
