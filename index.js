var edgarFacts = require('edgar-facts')

function getEdgarFact (intent, session, callback) {
  var cardTitle = 'An Edgar Fact'
  var speechOutput = edgarFacts()
  callback({}, buildSpeechletResponse(cardTitle, speechOutput, '', true))
}

/**
 * Called when the user launches the app without specifying what they want.
 */
function onLaunch (launchRequest, session, callback) {
  console.log(
    'onLaunch requestId=',
    launchRequest.requestId,
    ', sessionId=',
    session.sessionId
  )

  getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this application.
 */
function onIntent (intentRequest, session, callback) {
  console.log('onIntent requestId=',
              intentRequest.requestId,
              ', sessionId=',
              session.sessionId)

  var intent = intentRequest.intent
  var intentName = intentRequest.intent.name

  switch (intentName) {
    case 'GetEdgarFact':
      getEdgarFact(intent, session, callback)
      break
    default:
      throw new Error('Invalid intent')
  }
}

/**
 * Called when the user ends the session.
 * Is not called when the app returns shouldEndSession=true.
 */
function onSessionEnded (sessionEndedRequest, session) {
  console.log('onSessionEnded requestId=',
              sessionEndedRequest.requestId,
              ', sessionId=',
              session.sessionId)
}

/**
 * Helpers that build all of the responses.
 */
function buildSpeechletResponse (title, output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: 'PlainText',
      text: output
    },
    card: {
      type: 'Simple',
      title: title,
      content: output
    },
    shouldEndSession: shouldEndSession
  }
}

function buildResponse (sessionAttributes, speechletResponse) {
  return {
    version: '1.0',
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }
}

/**
 * Functions that control the app's behavior.
 */
function getWelcomeResponse (callback) {
  // If we wanted to initialize the session to have some attributes we could add those here.
  var sessionAttributes = {}
  var cardTitle = 'Welcome'
  var speechOutput = 'Welcome to Edgar facts, ' +
                     'ask me for a fact about Edgar by saying, ' +
                     'tell me a fact about edgar'
  // If the user either does not reply to the welcome message or says something that is not
  // understood, they will be prompted again with this text.
  var repromptText = 'Ask me for a fact about Edgar by saying, ' +
                     'tell me a fact about edgar'
  var shouldEndSession = false

  callback(sessionAttributes,
           buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession))
}

/**
 * Called when the session starts.
 */
function onSessionStarted (sessionStartedRequest, session) {
  console.log(
    'onSessionStarted requestId=',
    sessionStartedRequest.requestId,
    ', sessionId=',
    session.sessionId)
}

exports.handler = function (event, context) {
  try {
    console.log('event.session.application.applicationId=' + event.session.application.applicationId)

    /**
     * Uncomment this if statement and replace application.id with yours
     * to prevent other voice applications from using this function.
     */
    if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.0e44f846-df40-425c-807a-8957e3c5f089') {
      context.fail('Invalid Application ID')
    }

    if (event.session.new) {
      onSessionStarted({requestId: event.request.requestId}, event.session)
    }

    if (event.request.type === 'LaunchRequest') {
      onLaunch(event.request,
               event.session,
               function (sessionAttributes, speechletResponse) {
                 context.succeed(buildResponse(sessionAttributes, speechletResponse))
               })
    } else if (event.request.type === 'IntentRequest') {
      onIntent(event.request,
               event.session,
               function (sessionAttributes, speechletResponse) {
                 context.succeed(buildResponse(sessionAttributes, speechletResponse))
               })
    } else if (event.request.type === 'SessionEndedRequest') {
      onSessionEnded(event.request, event.session)

      context.succeed()
    }
  } catch (e) {
    context.fail('Exception: ' + e)
  }
}
