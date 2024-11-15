/*
MIT License

Copyright (c) 2020 Robert M Pavey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {
  displayBusyMessageWithSkipButton,
  displayBusyMessage,
  displayMessageWithIconAndWaitForContinue,
} from "/base/browser/popup/popup_menu_building.mjs";

var monitoredSleepsInProgress = 0;

function doUnmonitoredSleep(ms) {
  //console.log("monitorRequestQueue, starting sleep for: " + ms + " at time: " + Date.now());
  return new Promise((resolveTimeout) =>
    setTimeout(function () {
      //console.log("monitorRequestQueue, sleep completed for: " + ms + " at time: " + Date.now());
      resolveTimeout();
    }, ms)
  );
}

function doMonitoredSleep(ms) {
  // The purpose of this is to allow the loop in monitorRequestQueue do do sleeps in between
  // checking the queue. The issue it solves is that the requests could all complete and the
  // parallel requests terminate while there was still a timeout for the sleep - which could then
  // call its callback when the next set of parallel requests had started.

  //console.log("monitorRequestQueue, starting sleep for: " + ms + " at time: " + Date.now());
  monitoredSleepsInProgress++;
  return new Promise((resolveTimeout) =>
    setTimeout(function () {
      monitoredSleepsInProgress--;
      //console.log("monitorRequestQueue, sleep completed for: " + ms + " at time: " + Date.now());
      resolveTimeout();
    }, ms)
  );
}

async function waitForAnyMonitoredSleepsToComplete() {
  while (monitoredSleepsInProgress) {
    await doUnmonitoredSleep(1);
  }
}

const maxRetryCount = 4;

var requestsTracker = {
  requestStates: [],
  expectedResponseCount: 0,
  receivedResponseCount: 0,
  failureCount: 0,
  callbackFunction: undefined,
  requestFunction: undefined,
  requestFunctionName: "", // used in console error messages
  displayMessage: "",
  parallelRequestsId: 0, // the ID of this call to doParallelRequests
};

function findRequestStateForRequest(request) {
  // find linkedRecord for this url
  let matchingRequestState = undefined;
  for (let requestState of requestsTracker.requestStates) {
    if (requestState.request == request) {
      matchingRequestState = requestState;
      break;
    }
  }
  return matchingRequestState;
}

var requestQueue = [];
var queueResponseTracker = {
  totalSuccess: 0,
  total429: 0,
  totalOtherError: 0,
  num429SinceSuccess: 0,
  waitBetweenRequests: 200,
  abortRequests: false,
  lastFewResponses: [],
};

function resetQueueResponseTracker() {
  queueResponseTracker = {
    totalSuccess: 0,
    total429: 0,
    totalOtherError: 0,
    num429SinceSuccess: 0,
    waitBetweenRequests: 200,
    abortRequests: false,
    lastFewResponses: [],
  };
}

const defaultQueueOptions = {
  initialWaitBetweenRequests: 1,
  maxWaitime: 3200,
  additionalRetryWaitime: 3200,
  additionalManyRecent429sWaitime: 5000,
  slowDownFromStartCount: 30,
  slowDownFromStartMult: 2,
};
var queueOptions = defaultQueueOptions;

function clearRequestQueue() {
  requestQueue = [];
}

function updateQueueTimingForResponse(response) {
  let responseArray = queueResponseTracker.lastFewResponses;
  if (responseArray.length >= 5) {
    responseArray.shift();
  }
  responseArray.push(response);

  if (response.success) {
    queueResponseTracker.totalSuccess++;
    queueResponseTracker.num429SinceSuccess = 0;
  } else {
    if (response.statusCode == 429) {
      queueResponseTracker.total429++;
      queueResponseTracker.num429SinceSuccess++;
      if (queueResponseTracker.num429SinceSuccess > 5) {
        queueResponseTracker.abortRequests = true;
      }

      if (queueResponseTracker.waitBetweenRequests < queueOptions.maxWaitime) {
        queueResponseTracker.waitBetweenRequests *= 2;
      }
    } else {
      queueResponseTracker.totalOtherError++;
    }
  }
}

async function monitorRequestQueue(doRequest, resolve, requestedQueueOptions) {
  //console.log("monitorRequestQueue starting at time: " + Date.now());

  if (requestedQueueOptions) {
    // Use the spread operator to override the default queue options with
    // any that are set in teh requested options.
    queueOptions = { ...defaultQueueOptions, ...requestedQueueOptions };
  }

  if (queueOptions.initialWaitBetweenRequests > 0) {
    queueResponseTracker.waitBetweenRequests = queueOptions.initialWaitBetweenRequests;
  }

  // if initial queue length is more than a certain amount
  // then increase the sleep time to try to avoid triggering the
  // error 429 "Too many requests".
  if (requestQueue.length >= queueOptions.slowDownFromStartCount) {
    queueResponseTracker.waitBetweenRequests *= queueOptions.slowDownFromStartMult;
  }

  while (requestsTracker.receivedResponseCount != requestsTracker.expectedResponseCount) {
    if (requestQueue.length > 0) {
      let nextRequest = requestQueue.shift();

      let matchingRequestState = findRequestStateForRequest(nextRequest);
      //console.log("monitorRequestQueue: matchingRequestState is:");
      //console.log(matchingRequestState);

      // if this request has had several retries already and the latest one was a 429
      // then wait an additional time befor queueing it
      if (matchingRequestState.retryCount > 1 && matchingRequestState.statusCode == 429) {
        if (matchingRequestState.status && matchingRequestState.status.startsWith("retry")) {
          matchingRequestState.status = "waiting before " + matchingRequestState.status;
        } else {
          matchingRequestState.status = "waiting";
        }
        displayStatusMessage(resolve);
        await doMonitoredSleep(queueOptions.additionalRetryWaitime);
      }

      // if we have had several 429s in the last few responses then wait a bit extra
      let responseArray = queueResponseTracker.lastFewResponses;
      let numRecent429s = 0;
      for (let prevResponse of responseArray) {
        if (prevResponse.statusCode == 429) {
          numRecent429s++;
        }
      }
      //console.log("responseArray.length = " + responseArray.length + ", numRecent429s = " + numRecent429s);
      if (numRecent429s >= 3) {
        if (matchingRequestState.status && matchingRequestState.status.startsWith("retry")) {
          matchingRequestState.status = "waiting before " + matchingRequestState.status;
        } else {
          matchingRequestState.status = "waiting";
        }
        displayStatusMessage(resolve);
        await doMonitoredSleep(queueOptions.additionalManyRecent429sWaitime);
      } else {
        await doMonitoredSleep(queueResponseTracker.waitBetweenRequests);
      }

      doRequest(nextRequest);
    }

    await doMonitoredSleep(1); // just to allow other tasks to run
    if (queueResponseTracker.abortRequests) {
      break;
    }
  }
}

function resetStaticCounts() {
  requestsTracker.expectedResponseCount = 0;
  requestsTracker.receivedResponseCount = 0;
  requestsTracker.failureCount = 0;
  requestsTracker.displayMessage = "";
}

function displayStatusMessage(resolve) {
  let baseMessage = requestsTracker.displayMessage;
  if (!baseMessage) {
    baseMessage = "WikiTree Sourcer fetching additional records";
  }
  baseMessage += " ...\n\n(This might take several seconds)...\n";

  let message2 = "";
  for (let requestState of requestsTracker.requestStates) {
    let name = requestState.request.name;
    let status = requestState.status;

    // if the name and status are too long to fit on a line try wrapping at space and indenting
    // For an exact solution we could calculate the proportional width of the text
    // See: https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
    // but that seems overkill.
    const maxLength = 40;
    const indentString = "\xa0\xa0\xa0\xa0";
    if (name && status && name.length + status.length > maxLength) {
      if (name.length > maxLength) {
        let newName = "";
        while (name.length > 45) {
          let spaceIndex = name.lastIndexOf(" ", maxLength);
          let cutIndex = 40;
          if (spaceIndex != -1) {
            cutIndex = spaceIndex;
          }
          newName += name.substring(0, cutIndex) + "\n";
          if (spaceIndex != -1) {
            cutIndex++; // move beyond the matched space
          }
          name = indentString + name.substring(cutIndex);
        }
        name = newName + name;
      }
      message2 += "\n'" + name + "'\n" + indentString + status;
    } else {
      message2 += "\n'" + name + "' " + status;
    }
  }

  displayBusyMessageWithSkipButton(baseMessage, message2, function () {
    queueResponseTracker.skippedByUser = true;
    queueResponseTracker.abortRequests = true;
    terminateParallelRequests(resolve);
  });
}

async function parallelRequestsDisplayErrorsMessage(actionName) {
  let baseMessage = "During " + actionName + " some linked records could not be retrieved.";
  if (queueResponseTracker.skippedByUser) {
    baseMessage += "\nThe server responded with 'Too many requests' (error 429).";
  } else if (queueResponseTracker.abortRequests) {
    baseMessage += "\nThe server responded with 'Too many requests' (error 429).";
  } else {
    baseMessage += "\nThis could be due to internet connectivity issues or server issues.";
  }
  baseMessage += "\nPress continue to use what could be retrieved.\n";

  let message2 = "";
  for (let requestState of requestsTracker.requestStates) {
    message2 += "\n'" + requestState.request.name + "' " + requestState.status;
  }
  await displayMessageWithIconAndWaitForContinue("warning", baseMessage, message2);
}

function updateStatusForRequest(request, status, resolve) {
  let matchingRequestState = findRequestStateForRequest(request);

  if (matchingRequestState) {
    matchingRequestState.status = status;
    displayStatusMessage(resolve);
  }
}

async function terminateParallelRequests(resolve) {
  // NOTE: this can currently get called multiple times.
  // This is to resolve any issue with timeouts where tasks and microtasks seem to be
  // conflicting.

  //console.log("terminateParallelRequests called at time: " + Date.now());

  // if there were any failures then remember that for caller
  let callbackInput = { failureCount: requestsTracker.failureCount, responses: [] };
  for (let requestState of requestsTracker.requestStates) {
    callbackInput.responses.push(requestState.response);
  }

  // This removes the status message with the skip button.
  displayBusyMessage("Finished fetch requests", "Processing results");

  // We wait for any timeouts that are outstanding since they can mess things up due
  // to some weir conflict between timeouts and promises.
  // We do not currently wait for any fetches that are outstanding. They are handled via the
  // requestsTracker.parallelRequestsId. It is posible there could be a race condition when a
  // fetch responded after we call reolve but before control returns to the caller but we haven't
  // seen that. If it happens we should wait for all outstanding fetches here.
  await waitForAnyMonitoredSleepsToComplete();

  resetStaticCounts();

  //console.log("About to call resolve in terminateParallelRequest, callbackInput is:");
  //console.log(callbackInput);
  resolve(callbackInput);
  //console.log("======================== resolve has been called in terminateParallelRequests, time is: " + Date.now());
}

function handleRequestResponse(request, response, doRequest, resolve) {
  //console.log("received response in parallel_requests handleRequestResponse:");
  //console.log(response);
  //console.log(request);
  //console.log("handleRequestResponse, queueResponseTracker is:");
  //console.log(queueResponseTracker);

  if (queueResponseTracker.abortRequests) {
    return;
  }

  let matchingRequestState = findRequestStateForRequest(request);

  if (!matchingRequestState || request.requestsTracker != requestsTracker.parallelRequestsId) {
    // Because of BuildAllCitations, this could be a response from a previous
    // set of parallel requests that was terminated via a skip or too many errors.
    return;
  }

  //console.log("in parallel_requests handleRequestResponse, matchingRequestState is:");
  //console.log(matchingRequestState);

  if (response.success) {
    if (matchingRequestState) {
      matchingRequestState.status = "completed";
      matchingRequestState.response = response;
    }
    requestsTracker.receivedResponseCount++;

    //console.log("in parallel_requests handleRequestResponse, requestsTracker is:");
    //console.log(requestsTracker);
  } else {
    //console.log("handleRequestResponse: Failed response, request name is: " + request.name);
    //console.log("handleRequestResponse: matchingRequestState is:");
    //console.log(matchingRequestState);

    // see if we can retry
    if (response.allowRetry && matchingRequestState.retryCount < maxRetryCount) {
      //console.log("doing a retry");
      requestQueue.push(matchingRequestState.request);
      matchingRequestState.retryCount++;
      matchingRequestState.status = "retry " + matchingRequestState.retryCount;
      if (response.statusCode) {
        matchingRequestState.status += " (error " + response.statusCode + ")";
        matchingRequestState.statusCode = response.statusCode;
      }
    } else {
      //console.log("handleRequestResponse: setting status to failed");
      matchingRequestState.status = "failed";
      if (response.statusCode) {
        matchingRequestState.status += " (error " + response.statusCode + ")";
        matchingRequestState.statusCode = response.statusCode;
      }
      requestsTracker.failureCount++;
      requestsTracker.receivedResponseCount++;
    }
  }

  displayStatusMessage(resolve);

  updateQueueTimingForResponse(response);
  if (queueResponseTracker.abortRequests) {
    // aborting, for every requestState that is not "failed" or "completed"
    // add one to failureCount
    for (let requestState of requestsTracker.requestStates) {
      let status = requestState.status;
      if (status != "failed" && status != "completed") {
        requestsTracker.failureCount++;
      }
    }
  }

  if (
    requestsTracker.receivedResponseCount == requestsTracker.expectedResponseCount ||
    queueResponseTracker.abortRequests
  ) {
    //console.log("in parallel_requests handleRequestResponse, calling terminateParallelRequests");
    terminateParallelRequests(resolve);
  }
}

// This function does a series of asynchronous requests in parallel and returns
// when they are all completed. It is passed an array of request objects and an
// async function to call for each request
function doRequestsInParallel(
  requests,
  requestFunction,
  requestedQueueOptions = defaultQueueOptions,
  displayMessage = ""
) {
  // requests is an array of objects, each has the following fields
  //   name : a name that can be used in the status display
  //   input : data to be passed to the request function (varies by site/action)
  // requestFunction is an async function that performs the request and returns a response
  //   Two parameters are passed to requestFunction:
  //      input: the input fields of the request
  //      statusUpdateFunction: a function taking a single string parameter
  //   The response object must have a property "success" that is true or false.
  // return value is a Promise. The resolve object has the following properties
  //   failureCount
  //   responses: array of response objects

  if (requests.length == 0) {
    let callbackInput = { failureCount: 0, responses: [] };
    //console.log("doRequestsInParallel, requests length is zero");
    return callbackInput;
  }

  resetStaticCounts();
  resetQueueResponseTracker();
  requestsTracker.expectedResponseCount = requests.length;
  requestsTracker.displayMessage = displayMessage;
  requestsTracker.parallelRequestsId++;

  requestsTracker.requestStates = [];
  for (let request of requests) {
    request.requestsTracker = requestsTracker.parallelRequestsId;
    let requestState = {
      request: request,
      status: "queued...",
      retryCount: 0,
    };
    requestsTracker.requestStates.push(requestState);
  }

  //console.log("======================== doRequestsInParallel, creating promise, requestsTracker is:");
  //console.log(requestsTracker);

  return new Promise((resolve, reject) => {
    try {
      async function doRequest(request) {
        try {
          //console.log("doRequestsInParallel: calling requestFunction. request is:");
          //console.log(request);
          let response = await requestFunction(request.input, function (status) {
            updateStatusForRequest(request, status, resolve);
          });
          //console.log("doRequestsInParallel: requestFunction returned. response is:");
          //console.log(response);

          handleRequestResponse(request, response, doRequest, resolve);
        } catch (error) {
          console.log("doRequestsInParallel: caught error in request. Error is:");
          console.log(error);
          let response = { success: false, error: error };
          handleRequestResponse(request, response, doRequest, resolve);
        }
      }

      clearRequestQueue();
      for (let request of requests) {
        requestQueue.push(request);
      }

      displayStatusMessage(resolve);

      monitorRequestQueue(doRequest, resolve, requestedQueueOptions);
    } catch (error) {
      console.log("doRequestsInParallel, error caught in promise, error is:");
      console.log(error);
      reject(error);
    }
  });
}

export { doRequestsInParallel, parallelRequestsDisplayErrorsMessage };
