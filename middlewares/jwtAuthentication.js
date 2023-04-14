const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // eslint-disable-next-line dot-notation
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: 'Auth failed',
          success: false,
        });
      }
      req.body.userId = decoded.id;
      next();

      return null;
    });
  } catch (error) {
    return res.status(401).send({
      message: 'Auth failed',
      success: false,
    });
  }
  return null;
};
