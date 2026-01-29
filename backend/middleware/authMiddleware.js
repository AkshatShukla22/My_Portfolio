export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Simple validation - check if token exists and is not expired (24 hours)
      const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
      const [prefix, timestamp] = decodedToken.split(':');
      
      if (prefix === 'admin') {
        const tokenAge = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (tokenAge < maxAge) {
          // Token is valid
          req.user = { role: 'admin' };
          return next();
        }
      }
      
      return res.status(401).json({ 
        success: false,
        message: 'Session expired, please login again' 
      });
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authentication token' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }
};