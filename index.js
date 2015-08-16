var config = require('./config')
var edgarFacts = require('edgar-facts')
var R = require('ramda')

/**
 * Helpers that build all of the responses.
 */
function buildSpeechletResponse (title, output, shouldEndSession) {
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

function buildResponse (speechletResponse) {
  return {
    version: '1.0',
    sessionAttributes: {},
    response: speechletResponse
  }
}

function respond (title, output, shouldEndSession, context) {
  R.compose(
    context.succeed.bind(context),
    buildResponse,
    buildSpeechletResponse
  )(title, output, shouldEndSession)
}

function respondWithEdgarFact (context) {
  respond('An Edgar Fact', edgarFacts(), true, context)
}

exports.handler = function (event, context) {
  try {
    if (event.session.application.applicationId !== config.applicationId) {
      return context.fail('Invalid Application ID')
    }

    switch (event.request.type) {
      case 'IntentRequest':
        switch (event.request.intent.name) {
          case 'EdgarFact':
            respondWithEdgarFact(context)
            break
          case 'Help':
            respond(
              'Edgar Facts Help',
              'Edgar facts is here to tell you everything you need to know about Edgar the dog. Just say \'Alexa, tell me an Edgar fact.\'',
              true,
              context
            )
            break
          case 'LicenseInfo':
            respond(
              'Edgar Facts License Information',
              'Edgar facts is licensed via the AGPL. For more information, and to view the source code, goto https://github.com/apechimp/alexa-edgar-facts',
              true,
              context
            )
            break
          default:
            context.fail('Unknown intent: ' + event.request.intent.name)
        }
        break
      case 'LaunchRequest':
        respondWithEdgarFact(context)
        break
      case 'SessionEndedRequest':
        context.succeed()
        break
      default:
        context.fail('Unknown request type: ' + event.request.type)
    }
  } catch (e) {
    context.fail('Exception: ' + e)
  }
}
