import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(403).json(err);
        return;
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json('token not valid');
  }
};

// user is authorise
export const verifyTokenAndAuthorization = async(req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin || req.params.userId) {
      next();
    } else {
      res.status(403).json('Token not authorise');
    }
  });
};

//user is admin
export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {

    if (req.user.isAdmin) {
      next();
    } 
    else {
      res.status(403).json('false');  //not admin
    }
  });
};
