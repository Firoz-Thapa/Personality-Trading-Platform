import sql from 'mssql';
import { Sequelize } from 'sequelize';

// SQL Server connection configuration for Windows Authentication
const dbConfigWindows: sql.config = {
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || 'PersonaTrade',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// SQL Server connection configuration for SQL Authentication
const dbConfigSQL: sql.config = {
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || 'PersonaTrade',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Raw SQL Server connection
export const createConnection = async () => {
  try {
    const useWindowsAuth = process.env.DB_USE_WINDOWS_AUTH === 'true';
    const config = useWindowsAuth ? dbConfigWindows : dbConfigSQL;
    
    console.log(`🔌 Connecting to SQL Server with ${useWindowsAuth ? 'Windows' : 'SQL'} Authentication...`);
    
    const pool = await sql.connect(config);
    console.log('✅ SQL Server connected successfully');
    return pool;
  } catch (error) {
    console.error('❌ SQL Server connection failed:', error);
    throw error;
  }
};

// Sequelize ORM instance for SQL Server
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'PersonaTrade',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    dialect: 'mssql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      }
    },
  }
);

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize SQL Server connection established successfully');
  } catch (error) {
    console.error('❌ Unable to connect to SQL Server:', error);
    throw error;
  }
};

// Initialize database
export const initializeDatabase = async () => {
  try {
    await testConnection();
    
    // Sync models (create tables if they don't exist)
    // Set to false since we already created tables manually
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default sequelize;