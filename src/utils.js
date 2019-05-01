const Notification = require('electron-native-notification')
const { 
  dialog
} = require('electron')

const { 
  iconStereo,
  iconMono,
} = require('./iconBase64')
const { CHANNELS, SHORTCUTS } = require('./constants')

const showErrorNotification = (value) => {
  const message = getErrorMessage(value)
  const options = {
    type: 'warning',
    title: 'Mono Switch App',
    message: message,
  }
  dialog.showMessageBox(null, options)
}

const showAudioSwitchedNotification = (value) => {
  // hide notification in 5 sec or let it stay
  const icon = value === CHANNELS.STEREO ? iconStereo : iconMono
  const notification = new Notification(
    `${value.toUpperCase()} Audio`, 
    { 
      body: `Audio played as ${value.toUpperCase()}`,
      silent: true,
      icon,
      image: icon,
    });
}

const getErrorMessage = (error) => {
  const { message } = error
  const systemPermissionsIssue = 'osascript is not allowed assistive access'
  const systemPermissionsMessage = 'To allow Mono Switch update your audio settings please grant it permissions via System Preferences > Security & Privacy > Privacy tab > check Mono Switch checkbox in list of apps.'
  const defaultMessage = message
  
  return message.includes(systemPermissionsIssue) ? systemPermissionsMessage : defaultMessage
}


module.exports = {
  showErrorNotification,
  showAudioSwitchedNotification
}
