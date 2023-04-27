### This repository is now considered legacy and no longer supported. Please take a look at our recent repositories and help documentation at the following links.

 - https://help.form.io
 - https://github.com/formio/formio.js
 - https://github.com/formio/formio
 - https://github.com/formio/react
 - https://github.com/formio/angular
 - https://github.com/formio/vue
 
# Form.io Cordova offline demo

This repository demonstrates how a cordova application without using a framework like Angular, React or Vue, can use the offline plugin.

## Formio Offline Plugin Access

In order to be able to compile and run this application you must have access to the formiojs-plugin-offline repository. To get access you must have an Enterprise project on form.io and request access from support@form.io.

### Installation
```bash
npm install
cordova requirements
```

Make sure all of the cordova requirements are fulfilled before proceeding.

To do a build, run the following:
```bash
webpack
cordova build ios
cordova emulate ios
```

You can switch cordova to android as well.

### Navigo
While this repo uses almost entirely vanilla javasript to implement the offline plugin, we did need to add a basic router. Navigo is a very simple router that has no dependencies so it fit the bill. Feel free to use a different router such as one that comes with your framework of choice.
