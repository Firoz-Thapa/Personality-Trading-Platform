import sql from 'mssql';
import { Sequelize } from 'sequelize';

// Force SQL Server Authentication
const dbConfig: sql.config = {
  server: 'localhost',
  port: 1433,
  database: 'PersonaTrade',
  user: 'personatrade_user',
  password: 'PersonaTrade123!',
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
    console.log('🔌 Connecting to SQL Server with SQL Authentication...');
    console.log(`📍 Server: ${dbConfig.server}:${dbConfig.port}`);
    console.log(`🗄️ Database: ${dbConfig.database}`);
    console.log(`👤 Username: ${dbConfig.user}`);
    
    const pool = await sql.connect(dbConfig);
    console.log('✅ SQL Server connected successfully');
    return pool;
  } catch (error) {
    console.error('❌ SQL Server connection failed:', error);
    throw error;
  }
};

// Sequelize with forced SQL Server Authentication
export const sequelize = new Sequelize(
  'PersonaTrade',
  'personatrade_user',
  'PersonaTrade123!',
  {
    host: 'localhost',
    port: 1433,
    dialect: 'mssql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
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
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default sequelize;