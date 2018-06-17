const { jwt } = require('@terrajs/mono')

exports.createSession = async (req, res) => {
  const userId = 1
  const token = await jwt.generateJWT({ userId })
  res.json({ token })
}

exports.getSession = async (req, res) => {
  // Will run only if a valid JWT is given in the Authorization header
  res.json(req.session)
}

