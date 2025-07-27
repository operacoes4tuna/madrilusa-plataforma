import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://madrilusa.com', 'https://www.madrilusa.com'] 
    : ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions); 