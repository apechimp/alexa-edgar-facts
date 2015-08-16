var config = require('./config')
var handler = require('./index').handler
var test = require('tape')

test('should fail context if application id is invalid', function (t) {
  t.plan(1)

  handler(
    { session: { application: { applicationId: 'lol' } } },
    {
      fail: function (msg) {
        t.equal(msg, 'Invalid Application ID')
      }
    }
  )
})

test('should succeed for session ended', function (t) {
  t.plan(1)

  handler(
    {
      request: { type: 'SessionEndedRequest' },
      session: { application: { applicationId: config.applicationId } }
    },
    {
      fail: t.fail,
      succeed: function (msg) {
        t.ok(!msg, 'no response')
      }
    }
  )
})

test('should send back an edgar fact for LaunchRequest', function (t) {
  t.plan(9)

  handler(
    {
      request: { type: 'LaunchRequest' },
      session: { application: { applicationId: config.applicationId } }
    },
    {
      succeed: function (msg) {
        var response
        t.ok(response = msg.response, 'response should exist')

        t.ok(response.shouldEndSession, 'should end session')

        t.equal(response.outputSpeech.type, 'PlainText')
        t.equal(typeof response.outputSpeech.text, 'string')

        t.equal(response.card.type, 'Simple')
        t.equal(response.card.title, 'An Edgar Fact')
        t.equal(typeof response.card.content, 'string')
        t.equal(response.card.content, response.outputSpeech.text)

        t.ok(!response.repromptText, 'no reprompt')
      }
    }
  )
})

test('should send back an edgar fact for EdgarFact intent', function (t) {
  t.plan(9)

  handler(
    {
      request: { type: 'IntentRequest', intent: { name: 'EdgarFact' } },
      session: { application: { applicationId: config.applicationId } }
    },
    {
      fail: t.fail,
      succeed: function (msg) {
        var response
        t.ok(response = msg.response, 'response should exist')

        t.ok(response.shouldEndSession, 'should end session')

        t.equal(response.outputSpeech.type, 'PlainText')
        t.equal(typeof response.outputSpeech.text, 'string')

        t.equal(response.card.type, 'Simple')
        t.equal(response.card.title, 'An Edgar Fact')
        t.equal(typeof response.card.content, 'string')
        t.equal(response.card.content, response.outputSpeech.text)

        t.ok(!response.repromptText, 'no reprompt')
      }
    }
  )
})

test('should send back help for Help intent', function (t) {
  t.plan(10)

  handler(
    {
      request: { type: 'IntentRequest', intent: { name: 'Help' } },
      session: { application: { applicationId: config.applicationId } }
    },
    {
      fail: t.fail,
      succeed: function (msg) {
        var response
        t.ok(response = msg.response, 'response should exist')

        t.ok(response.shouldEndSession, 'should end session')

        t.equal(response.outputSpeech.type, 'PlainText')
        t.equal(typeof response.outputSpeech.text, 'string')

        t.equal(response.card.type, 'Simple')
        t.equal(response.card.title, 'Edgar Facts Help')
        t.equal(typeof response.card.content, 'string')
        t.equal(response.card.content, response.outputSpeech.text)
        t.ok(response.card.content.match(/Edgar facts is here to tell you everything you need to know about Edgar the dog\. Just say 'Alexa, tell me an Edgar fact\.'/))

        t.ok(!response.repromptText, 'no reprompt')
      }
    }
  )
})
