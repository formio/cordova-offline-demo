import './index.html';
import 'bootstrap/dist/css/bootstrap.css';
import 'formiojs/dist/formio.full.css';

import {createForm, Formio} from 'formiojs';
import FormioOfflineProject from 'formiojs-plugin-offline/index.js';
import Navigo from 'navigo';

var projectUrl = 'https://offline-demo.form.io';

// Initialize a simple router.
var router = new Navigo(null, true);

// Configure the offline plugin.
var offline = new FormioOfflineProject(projectUrl, 'project.json');
Formio.registerPlugin(offline, 'offline-demo');

var setOfflineCount = function() {
  offline.ready.then(function() {
    document.getElementById('count').innerHTML = offline.submissionQueueLength();
  });
}

// Update the count when items go through queue.
Formio.events.on('offline.queue', setOfflineCount);
Formio.events.on('offline.dequeue', setOfflineCount);
Formio.events.on('offline.formSubmission', setOfflineCount);

Formio.events.on('offline.queueEmpty', function() {
  // When queue is empty, go home.
  setOfflineCount();
  router.navigate();
});

// Normally error information would be passed as part of the route parameters but the simple router doesn't allow it.
var errorItem = {};
Formio.events.on('offline.formError', function(error, request) {
  // If an offline error occurs, go to the error page and present the submission that caused the error so it can be fixed.
  errorItem = {error: error, request: request.request};
  router.navigate('error');
});

router
  .on({
    'queue': offline.dequeueSubmissions,
    'error': function() {
      document.getElementById('content').innerHTML = '' +
        '<h2>An error occurred submitting the offline Queue</h2>' +
        '<p>Please fix it and continue</p>' +
        '<div class="alert alert-danger" id="alert"></div>' +
        '<div id="formio" />';
      document.getElementById('alert').innerHTML = "";

      errorItem.error.details.forEach(function(detail) {
        var element = document.createElement('div');
        element.innerHTML = detail.message;
        document.getElementById('alert').appendChild(element);
      });

      createForm(document.getElementById('formio'), errorItem.request.formUrl)
        .then(function(form) {
          // We will update the item in the queue instead of attempting a new submission.
          form.nosubmit = true;
          form.submission = errorItem.request.data;

          form.on('submit', function(submission) {
            errorItem = {};
            offline.dequeueSubmissions();
          })
        });
    },
    'thanks': function() {
      document.getElementById('content').innerHTML = 'Thanks';
    },
    '*': function() {
      document.getElementById('content').innerHTML = '<div id="formio"></div>';
      createForm(document.getElementById('formio'), projectUrl + '/survey')
        .then(function(form) {
          form.on('submitDone', function() {
            setOfflineCount();
            router.navigate('/thanks');
          })
        });
    }
  });

// Init navigate home.
router.navigate();
// Init the count.
setOfflineCount();

