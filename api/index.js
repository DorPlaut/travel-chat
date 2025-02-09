// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import router from './routes/route.js';
// import bodyParser from 'body-parser';

// // Load environment variables from .env file
// dotenv.config();

// const app = express();
// app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit to 50MB

// // global vars
// const port = process.env.PORT;

// // middlewares
// app.use(
//   cors({
//     origin: '*',
//   })
// );

// // Router
// app.use(express.static('./public'));
// app.use('/api', router);

// // Add this new route
// app.get('/privacy-policy', (req, res) => {
//   res.sendFile('privacy-policy.html', { root: './public' });
// });

// const start = async () => {
//   try {
//     await app.listen(port, () =>
//       console.log(`server is listening on port ${port}`)
//     );
//   } catch (error) {
//     console.log(error);
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

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit to 50MB

// Global vars
const port = process.env.PORT;

// cookie parser
app.use(cookieParser());

// Middlewares
const allowedOrigin = 'http://localhost:5173'; // Replace with your frontend's actual URL if deployed
// app.use(cors({ origin: '*' }));
app.use(
  cors({
    origin: allowedOrigin, // Specify the frontend origin
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Initialize passport
app.use(passport.initialize());

// Routes
app.use(express.static('./public'));
app.use('/api', router);

// Start server
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

start();
