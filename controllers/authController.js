const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//--------- Generate jwt Token ----------------
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
   });
};

//--------- User register -----------------

exports.userRegister = async (req, res) => {
   const { username, email, password, confirmPassword } = req.body;
   if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields required" });
   }

   try {
      const emailExist = await User.findOne({ email });

      if (emailExist) {
         return res.status(401).json({ message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
         name: username,
         email,
         password: hashedPassword,
      });

      if (user) {
         return res.status(201).json({
            status: "success",
            user,
            email: user.email,
            token: generateToken(user._id),
         });
      } else {
         return res.status(400).json({ message: "Invalid user data" });
      }
   } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

exports.userLogin = async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      res.status(401).json({ message: "All fields required" });
   } else {
      const userExist = await User.findOne({ email: email });
      if (
         userExist &&
         (await bcrypt.compare(req.body.password, userExist.password))
      ) {
         res.status(200).json({
            status: "success",
            token: generateToken(userExist._id),
            user: userExist,
         });
      } else {
         res.status(401).json({ message: "Incorrect Email or Password" });
      }
   }
};

exports.getDashboard = async (req, res) => {
   res.status(200).json({ status: "success", user: req.user });
};
