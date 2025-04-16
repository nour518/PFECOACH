const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" })
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

  res.json({ token, user })
}