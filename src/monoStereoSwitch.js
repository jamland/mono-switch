const path = require('path')
const applescript = require('applescript')
const { CHANNELS, SHORTCUTS } = require('./constants')

const scriptDoSwitch = path.join(__dirname, './applescript/monoStereoSwitch.applescript')
const scriptGetValue = path.join(__dirname, './applescript/getMonoStereoState.applescript')

const runMonoStereoToggleAction = (callback) => {
  toggleMonoStereo( (value) => {
    getCurrentValueOfMonoStereo( (value) => {
      if (value === CHANNELS.STEREO || value === CHANNELS.MONO) {
        callback(value)
      } else {
        console.log('🚧 applescript failed to exec. value is:', value)
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
    } else {
      callback(rtn)
    }
  });
}

module.exports = {
  runMonoStereoToggleAction
}
