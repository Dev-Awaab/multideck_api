import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import path from 'path'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import xss from 'xss-clean'
import cors from 'cors'
import hpp from 'hpp'

// Routes files
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import userRoutes from './routes/userRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

const app = express();

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10mins 
    max: 100
})

app.use(limiter)

// Prevent http para
app.use(hpp())

// Enable CORS
app.use(cors());

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload())

// Set static folder
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'public')))

// Connect db
connectDB();

// morgan logging configuration
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Routes configurations
app.use('/api/category', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes)

// Error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.bgBlack.bold)
);
