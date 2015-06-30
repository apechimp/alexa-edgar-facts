var edgarFacts = require('edgar-facts')
var R = require('ramda')

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

function buildResponse (speechletResponse) {
  return {
    version: '1.0',
    sessionAttributes: {},
    response: speechletResponse
  }
}

exports.handler = function (event, context) {
  try {
    if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.0e44f846-df40-425c-807a-8957e3c5f089') {
      context.fail('Invalid Application ID')
    }

    switch (event.request.type) {
      case 'LaunchRequest':
        R.compose(
          context.succeed.bind(context),
          buildResponse,
          buildSpeechletResponse
        )('An Edgar Fact', edgarFacts(), '', true)
        break
      default:
        console.log('recieved', event.request.type)
        context.succeed()
    }
  } catch (e) {
    context.fail('Exception: ' + e)
  }
}
