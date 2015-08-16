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

exports.handler = function (event, context) {
  try {
    if (event.session.application.applicationId !== config.applicationId) {
      return context.fail('Invalid Application ID')
    }

    switch (event.request.type) {
      case 'IntentRequest':
      case 'LaunchRequest':
        R.compose(
          context.succeed.bind(context),
          buildResponse,
          buildSpeechletResponse
        )('An Edgar Fact', edgarFacts(), true)
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
