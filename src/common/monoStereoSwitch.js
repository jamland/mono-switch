import path from 'path'
import applescript from 'applescript'
import log from 'electron-log'

import { CHANNELS, SHORTCUTS } from './constants'
import { showErrorNotification } from './utils'
const scriptDoSwitch = path.join(__static, '/applescript/monoStereoSwitch.applescript')
const scriptGetValue = path.join(__static, '/applescript/getMonoStereoState.applescript')


const runMonoStereoToggleAction = (callback) => {
  toggleMonoStereo( (value) => { 
    getCurrentValueOfMonoStereo( (value) => {
      if (value === CHANNELS.STEREO || value === CHANNELS.MONO) {
        callback(value)
      } else {
        console.log('🚧 applescript failed to exec. value is:', value)
        showErrorNotification(value)
        log.warn('🚧 ', value);
      }
    })
  })
}

const toggleMonoStereo = (callback) => {
  runScript(scriptDoSwitch, callback)
}

const getCurrentValueOfMonoStereo = (callback) => {
  runScript(scriptGetValue, callback)
}

const runScript = (script, callback) => {
  applescript.execFile(script, (err, rtn) => {
    if (err) {
      console.log('🚧 applescript failed to exec', err)
      showErrorNotification(err)
      log.warn('🚧 ', err);
    } else {
      callback(rtn)
    }
  });
}

export {
  runMonoStereoToggleAction,
  getCurrentValueOfMonoStereo,
}
