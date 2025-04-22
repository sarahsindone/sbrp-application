// Database configuration
const dbConfig = {
  development: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sbrp_db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  test: {
    uri: process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/sbrp_test_db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  production: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
};

// JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'sbrp-secure-jwt-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

// Server configuration
const serverConfig = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  corsOptions: {
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  }
};

// File upload configuration
const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png'
  ]
};

module.exports = {
  db: dbConfig[process.env.NODE_ENV || 'development'],
  jwt: jwtConfig,
  server: serverConfig,
  upload: uploadConfig
};
