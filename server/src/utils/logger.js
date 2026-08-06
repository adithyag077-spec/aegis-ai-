const logger = {
  info: (msg, meta = {}) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  error: (msg, meta = {}) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  security: (msg, meta = {}) => {
    console.log(`[SECURITY_AUDIT] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? meta : '');
  }
};

module.exports = logger;
