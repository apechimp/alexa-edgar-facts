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

var respond = R.curry(function (title, output, shouldEndSession, context) {
  R.compose(
    context.succeed.bind(context),
    buildResponse,
    buildSpeechletResponse
  )(title, output, shouldEndSession)
})

var respondWithEdgarFact = respond('An Edgar Fact', edgarFacts(), true)

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
        }
        break
      case 'LaunchRequest':
        respondWithEdgarFact(context)
        break
      default:
        console.log('recieved', event.request.type)
        context.succeed()
    }
  } catch (e) {
    console.error('error', e.stack)
    context.fail('Exception: ' + e)
  }
}
