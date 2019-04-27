'use strict';
console.log('here')
const { ipcRenderer } = require('electron')

var privacyLink = document.querySelector('#privacy-policy');
privacyLink.addEventListener('click', function (e) {
  e.preventDefault()
  const href = privacyLink.getAttribute('href');
  ipcRenderer.sendSync('link-clicked', href)
});

var githubLink = document.querySelector('#github-link');
githubLink.addEventListener('click', function (e) {
  e.preventDefault()
  const href = githubLink.getAttribute('href');
  ipcRenderer.sendSync('link-clicked', href)
});