const Notification = require('electron-native-notification')

const { 
  iconStereo,
  iconMono,
} = require('./iconBase64')
const { CHANNELS, SHORTCUTS } = require('./constants')

const showNotification = (value) => {
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

module.exports = {
  showNotification,
}
