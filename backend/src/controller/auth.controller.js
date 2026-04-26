const adminModel = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerAdmin(req, res) {
  const { fullName, email, password } = req.body;

  const isAlreadyExists = await adminModel.exists({ email });
  // const isAlreadyExists = await adminModel.findOne({email})

  if (isAlreadyExists) {
    return res.status(400).json({
      message: "User already exists!",
    })
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))

  const user = await adminModel.create({
    fullName,
    email,
    password: hashedPassword,
  })

  const token = jwt.sign(
    {
      id: user._id,
    },process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  )

  res.cookie('token', token)
  res.status(201).json({
    message: 'Admin successfully registered!',
    admin: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
    }
  })
}

async function loginAdmin(req, res) {
  const {email, password} = req.body

  const user = await adminModel.findOne({email})

  if(!user){
    return res.status(400).json({
      message: 'Invalid email or password!'
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if(!isPasswordValid){
    return res.status(400).json({
      message: 'Inavlid email or password!'
    })
  }

  const token = jwt.sign({
    id: user._id
  }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })

  res.cookie('token', token)
  res.status(201).json({
    message: 'Admin successfully logged in!',
    admin: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    }
  })
}

async function logoutAdmin(req, res) {
  res.clearCookie('token')
  res.status(200).json({
    message: 'Admin logged out succesfully!'
  })
}

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
}