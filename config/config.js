const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI || "mongodb+srv://thanhnguyendata68_db_user:QyV0TmZkV7b7CT7B@cluster0.ggcujs2.mongodb.net/?appName=Cluster0" ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/mernproject'
}
export default config

