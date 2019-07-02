import path from 'path'
import osascript from "node-osascript";
import log from 'electron-log'

import { CHANNELS } from './constants'
import { showErrorNotification } from './utils'
const scriptDoSwitch = path.join(__static, '/applescript/monoStereoSwitch.applescript')
const scriptGetValue = path.join(__static, '/applescript/getMonoStereoState.applescript')

const runMonoStereoToggleAction = (callback1, callback2) => {
  toggleMonoStereo(() => {
    callback1();

    getCurrentValueOfMonoStereo(value => {
      if (value === CHANNELS.STEREO || value === CHANNELS.MONO) {
        callback2(value);
      } else {
        showErrorNotification(value);
        log.warn("🚧 ", value);
      }
    });
  });
};

const toggleMonoStereo = callback => {
  runScript(scriptDoSwitch, callback);
};

const getCurrentValueOfMonoStereo = callback => {
  runScript(scriptGetValue, callback);
};

const runScript = (script, callback) => {
  osascript.executeFile(script, function(err, result) {
    if (err) {
      showErrorNotification(err);
      log.warn("🚧 ", err);
    } else {
      callback(result);
    }
  });
};

export {
  runMonoStereoToggleAction,
  getCurrentValueOfMonoStereo,
}
