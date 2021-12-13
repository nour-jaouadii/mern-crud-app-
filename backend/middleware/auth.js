const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {

    const token = req.cookies.token;
    console.log(token);

    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });
      
    // to verify  if the token has been reated with  the key = JWT_SECRET 
    // to make sure that no one else has created a token 
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verified); // { user: '61b39518163c98d325b5985d', iat: 1639160527 }
    req.user = verified.user;
    // exit out of the midelware and continue with next function 
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

module.exports = auth;