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

test('should succeed for anything other than LaunchRequest', function (t) {
  t.plan(1)

  handler(
    {
      request: { type: 'foo' },
      session: { application: { applicationId: config.applicationId } }
    },
    {
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