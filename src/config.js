module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://postgres@localhost/saneful',
  JWT_SECRET: process.env.JWT_SECRET || '106816c9-bcb5-4a05-9d51-4dda16a357c3',
};
