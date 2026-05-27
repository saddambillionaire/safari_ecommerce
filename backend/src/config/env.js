import dotenv from 'dotenv'

dotenv.config()

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/myapp'}