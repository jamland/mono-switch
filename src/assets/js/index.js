'use strict';
const shell = require('electron').shell;

var privacyLink = document.querySelectorAll('.open-in-browser');
privacyLink.forEach( link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  });
})