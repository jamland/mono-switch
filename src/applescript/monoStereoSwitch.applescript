tell application "System Preferences"
	reveal anchor "Hearing" of pane id "com.apple.preference.universalaccess"
end tell

tell application "System Events"
	tell application process "System Preferences"
		-- set frontmost to true
		tell window "Accessibility"
			##--> pre 10.9 set monoStereoCheckbox to checkbox 2 of group 1
			set monoStereoCheckbox to checkbox "Play stereo audio as mono" of group 1
			tell monoStereoCheckbox to click
		end tell
	end tell
end tell

-- if application "System Preferences" is running then
-- 	tell application "System Preferences" to quit
-- end if