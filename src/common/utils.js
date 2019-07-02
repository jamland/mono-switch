import Notification from 'electron-native-notification'
import { dialog } from 'electron'
import log from 'electron-log'
import * as path from 'path'

import { CHANNELS } from './constants'
const iconStereo = path.join(__static, '/images/green-circle.png')
const iconMono = path.join(__static, '/images/red-circle.png')

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
  log.info('⚀ routine: show notification: ', value);
  const icon = value === CHANNELS.STEREO ? iconStereo : iconMono
  new Notification(
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


export {
  showErrorNotification,
  showAudioSwitchedNotification
}
