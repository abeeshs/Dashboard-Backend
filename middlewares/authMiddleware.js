const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
exports.userProtect = async (req, res, next) => {
   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {
      try {
         //get the token
         token = req.headers.authorization.split(" ")[1];
         console.log(token);

         //varify token
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         // console.log(decoded)

         //get USER from the token
         const user = await User.findById(decoded.id).select("-password");

         if (user) {
            req.user = user;
            next();
         } else {
            res.status(401).json({ message: "Not authorized" });
         }
      } catch (err) {
         console.log(err);
         res.status(401);
         res.json("Not authorized");
      }
   }
   if (!token) {
      res.status(401).json({ message: "Not authorized ,No token" });
   }
};
