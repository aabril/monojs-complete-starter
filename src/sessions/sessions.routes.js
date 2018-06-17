const sessionsCtrl = require('./sessions.controller')
const sessionsValidation = require('./sessions.validation')

module.exports = [
  {
    method: 'POST',
    path: '/session',
    handler: sessionsCtrl.createSession,
    validation: sessionsValidation.createSession,
  },
  {
    method: 'GET',
    path: '/session',
    session: true,
    handler: sessionsCtrl.getSession
  }
]
