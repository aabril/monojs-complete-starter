const { jwt } = require('@terrajs/mono')

exports.createSession = async (req, res) => {
  const token = await jwt.generateJWT(req.body)
  res.json({ token })
}

exports.getSession = async (req, res) => {
  // Will run only if a valid JWT is given in the Authorization header
  res.json(req.session)
}

