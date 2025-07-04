export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); 
    }
  
    req.flash('error', 'You need to be logged in');
  

    let redirectPath = '/';
    if (req.user) {
      const role = req.user.constructor.modelName.toLowerCase();
      redirectPath = `/${role}/login`;
    } else if (req.session && req.session.passport && req.session.passport.user) {
      const type = req.session.passport.user.type;
      redirectPath = `/${type}/login`;
    } else {
      redirectPath = '/employee/login';
    }
  
    return res.redirect(redirectPath);
}

/**
 * Middleware to check user role
 * @param {string} role - The role to check for
 */
export function checkRole(role) {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash('error', 'Please log in to access this page');
            return res.redirect('/auth/login');
        }

        if (req.user.role !== role) {
            req.flash('error', 'You do not have permission to access this page');
            return res.redirect('/');
        }

        next();
    };
}

// JWT Authentication middleware
// export const protect = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             // Get token from header
//             token = req.headers.authorization.split(' ')[1];

//             // Verify token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET || 'waystar_royco_secret_key_2024');

//             // Get user from the token
//             req.user = decoded;

//             next();
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };
