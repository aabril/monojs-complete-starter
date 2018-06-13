const sessionsCtrl = require('./sessions.controller')

module.exports = [
  {
    method: 'POST',
    path: '/session',
    handler: sessionsCtrl.createSession
  },
  {
    method: 'GET',
    path: '/session',
    session: true,
    handler: sessionsCtrl.getSession
  }
]
