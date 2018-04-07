'use strict';
var fs = require('fs');
var nodemailer = require("nodemailer");

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  if (request.body.result) {
    processV1Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});

function processV1Request(request, response) {
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
  let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
  let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
  let messages = request.body.result.fulfillment.messages;
  let requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;
  const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests
  const app = new DialogflowApp({ request: request, response: response });
  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    'default': () => {
      sendResponse('Hello, Welcome to my Dialogflow agent!');
    },
    'provide-reference-number': () => {
      let responseToUser = {
        data: [
          {
            "representation": "sessionId",
          }
        ],
        messages: messages,
        //outputContexts: [{'name': 'weather', 'lifespan': 2, 'parameters': {'city': 'Rome'}}], // Optional, uncomment to enable
        //speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor! v1 speech', // spoken response
        speech: messages[0].speech,
        text: messages[0].speech
      };
      sendResponse(responseToUser);
    },
    'action-file-upload': () => {
      var dataUrl = request.body.result.contexts[0].parameters.dataUrl;
      var base64Data = dataUrl.substr(dataUrl.indexOf('base64') + 7);
      var buffer = new Buffer(base64Data, 'base64');
      var data = buffer.toString('utf8');
      var dataArray = data.split('\n');

      var mapConsumptionByMonth = {};
      var xAxisConsumptionByMonth = [];
      var yAxisConsumptionByMonth = [];

      var mapConsumptionByDay = {};
      var xAxisConsumptionByDay = [];
      var yAxisConsumptionByDay = [];

      var mapConsumptionByHour = {};
      var xAxisConsumptionByHour = [];
      var yAxisConsumptionByHour = [];

      for (var i in dataArray) {
        var dateTime = new Date(dataArray[i].split(',')[0]);
        var consumption = dataArray[i].split(',')[1];

        addValueToListInMap(mapConsumptionByMonth, dateTime.getMonth(), consumption);
        addValueToListInMap(mapConsumptionByDay, dateTime.getDay(), consumption);
        addValueToListInMap(mapConsumptionByHour, dateTime.getHours(), consumption);
      }

      for (var month in mapConsumptionByMonth) {
        xAxisConsumptionByMonth.push(getMonthName(parseInt(month)));
        yAxisConsumptionByMonth.push(getAverage(mapConsumptionByMonth[month]));
      }

      for (var day in mapConsumptionByDay) {
        xAxisConsumptionByDay.push(getDayName(parseInt(day)));
        yAxisConsumptionByDay.push(getAverage(mapConsumptionByDay[day]));
      }

      for (var hour in mapConsumptionByHour) {
        xAxisConsumptionByHour.push(getHourFormat(parseInt(hour)));
        yAxisConsumptionByHour.push(getAverage(mapConsumptionByHour[hour]));
      }


      let responseToUser = {
        data: [
          {
            "representation": "graph",
            "graphData": {
              "xAxis": xAxisConsumptionByMonth,
              "yAxis": yAxisConsumptionByMonth,
              "title": "Consumption by Month"
            }
          },
          {
            "representation": "graph",
            "graphData": {
              "xAxis": xAxisConsumptionByDay,
              "yAxis": yAxisConsumptionByDay,
              "title": "Consumption by Weekday"
            }
          },
          {
            "representation": "graph",
            "graphData": {
              "xAxis": xAxisConsumptionByHour,
              "yAxis": yAxisConsumptionByHour,
              "title": "Consumption by Time of Day"
            }
          },
          {
            "representation": "text",
            "textData": "Based on the information provided, we can offer you the following options."
          },
          {
            "representation": "table",
            "tableData": {
              "header": ["QuoteID - 101202303", "Lock In", "Pricing", "Peak", "Off Peak", "Shoulder", "Estimated Monthly Bill", "Potential Mismatch charge*"],
              "rows": [
                ["quickReply:30 Day Rolling", "30 days", "Variable*", "10.0p", "10.0p", "10.0p", "", ""],
                ["quickReply:Night Owl 1", "12 months", "Fixed", "11.0p", "5.0p", "7.0p", "£100", "£10"],
                ["quickReply:Night Owl 2", "24 months", "Fixed", "11.5p", "5.5p", "7.5p", "£105", "£10"],
                ["quickReply:Night Owl 3", "36 months", "Fixed", "12.0p", "5.5p", "7.5p", "£110", "£10"],
                ["quickReply:Balanced 1", "12 months", "Fixed", "12.0p", "8.0p", "5.0p", "£110", "£0"],
                ["quickReply:Balanced 2", "24 months", "Fixed", "12.1p", "8.1p", "5.2p", "£112", "£0"],
                ["quickReply:Balanced 3", "36 months", "Fixed", "12.2p", "8.2p", "5.2p", "£115", "£0"]
              ]
            }
          }
        ],
        messages: messages,
        //outputContexts: [{'name': 'weather', 'lifespan': 2, 'parameters': {'city': 'Rome'}}], // Optional, uncomment to enable
        //speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor! v1 speech', // spoken response
        speech: messages[0].speech,
        text: messages[0].speech
      };
      sendResponse(responseToUser);
    },
    'email': () => {
      var smtpTransport = nodemailer.createTransport({
        service: "Yahoo",
        auth: {
          user: "tech.dvpartners@yahoo.com",
          pass: "*********"
        }
      });
      var mailOptions = {
        from: "Technology DVPartners ✔ <tech.dvpartners@yahoo.com>",
        to: request.body.result.parameters.email,
        subject: request.body.result.parameters.TariffPlan,
        text: "You have selected " + request.body.result.parameters.TariffPlan + ". Please go ahaed with the payment.</b>",
        html: "<b>You have selected " + request.body.result.parameters.TariffPlan + ". Please go ahaed with the payment.</b>"
      }
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log("Message sent: " + JSON.stringify(response));
        }
        smtpTransport.close();
      });
    }
  };
  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }
  // Run the proper handler function to handle the request from Dialogflow
  actionHandlers[action]();
  function sendResponse(responseToUser) {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
      let responseJson = {};
      responseJson.speech = responseToUser; // spoken response
      responseJson.displayText = responseToUser; // displayed response
      response.json(responseJson); // Send response to Dialogflow
    } else {
      // If the response to the user includes rich responses or contexts send them to Dialogflow
      let responseJson = {};
      // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
      responseJson.speech = responseToUser.speech || responseToUser.displayText;
      responseJson.displayText = responseToUser.displayText || responseToUser.speech;
      // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
      responseJson.data = responseToUser.data;
      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      responseJson.contextOut = responseToUser.outputContexts;
      responseJson.messages = responseToUser.messages;
      console.log('Response to Dialogflow: ' + JSON.stringify(responseJson));
      response.json(responseJson); // Send response to Dialogflow
    }
  }
}

function addValueToListInMap(map, key, value) {
  map[key] = map[key] || [];
  map[key].push(value);
}

function getAverage(array) {
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += parseInt(array[i], 10); //don't forget to add the base
  }

  var avg = sum / array.length;
  return avg;
}

function getMonthName(num) {
  switch (num) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "";
  }
}

function getDayName(num) {
  switch (num) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "";
  }
}

function getHourFormat(num) {
  if (num >= 0 && num <= 23) {
    return num + ":00"
  }
  else {
    return "";
  }
}