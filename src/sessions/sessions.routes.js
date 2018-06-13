const sessionsCtrl = require('./sessions.controller')
const { jwt } = require('@terrajs/mono')

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
