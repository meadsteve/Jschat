var queueMeExtension = require("../../../lib/extensions/queue-me.js");
var messageHelper = require("../../helpers/message-helper.js");

var expectMessageToMatch = messageHelper.expectMessageToMatch;
var messageWithText = messageHelper.messageWithText;

describe("The queue-me extension takes 'queue me link' and passes the link to the queue", function() {
    var handler, playQueue;

    beforeEach(function() {
        playQueue = {
            queueItem: function (room, data){}
        };
        handler = queueMeExtension("queue me", playQueue).incoming;
        spyOn(playQueue, 'queueItem');
    });

    it("leaves messages unchanged", function(done) {
        var message = messageWithText("I'm a little message and I'm okay");
        var expectedMessage = messageWithText("I'm a little message and I'm okay");
        handler(message, function(updatedMessage) {
            expectMessageToMatch(updatedMessage, expectedMessage);
            done();
        });
    });

    it("queue me link adds link to the queue", function(done) {
      var message = messageWithText("queue me www.youtube.com/watch?v=kfVsfOSbJY0");
      handler(message, function(updatedMessage) {
        expect(playQueue.queueItem).toHaveBeenCalledWith('logging-test', { data: {'service': 'youtube', id: 'kfVsfOSbJY0', title: 'Friday - Rebecca Black - Official Music Video' }, duration: 228000, requester: 'Mctest'});
        done();
      });
    });
});
