autoHtmlExtension = require("../../lib/extensions/auto-html");
var messageHelper = require("../helpers/message-helper.js");

var expectMessageToMatch = messageHelper.expectMessageToMatch;
var messageWithText = messageHelper.messageWithText;

describe("The auto html provides an incoming handler", function() {
    var handler = autoHtmlExtension.incoming;

    it("leaves basic messages unchanged", function() {
        var message = messageWithText("I'm a little message and I'm okay");
        var expectedMessage = messageWithText("I'm a little message and I'm okay");
        handler(message, function(updatedMessage) {
            expectMessageToMatch(updatedMessage, expectedMessage);
        });
    });

    it("creates anchor tags out of links", function() {
        var message = messageWithText("go to http://www.fun.com");
        var expectedMessage = messageWithText(
            "go to <a href='http://www.fun.com' target='_blank'>http://www.fun.com</a>"
        );
        handler(message, function(updatedMessage) {
            expectMessageToMatch(updatedMessage, expectedMessage);
        });
    });

    it("it leaves quoted links alone", function() {
        var message = messageWithText("go to 'http://www.fun.com'");
        var expectedMessage = messageWithText("go to 'http://www.fun.com'");
        handler(message, function(updatedMessage) {
            expectMessageToMatch(updatedMessage, expectedMessage);
        });
    });

    it("makes .gif links images", function() {
        var message = messageWithText("http://www.fun.com/lol.gif");
        var expectedMessage = messageWithText(
            "<a href='http://www.fun.com/lol.gif' target='_blank'><img src='http://www.fun.com/lol.gif' /></a>"
        );
        handler(message, function(updatedMessage) {
            expectMessageToMatch(updatedMessage, expectedMessage);
        });
    });

    it("makes links starting with a # into doors to other rooms", function() {
        var message = messageWithText("#hypnotoad");
        var expectedMessage = messageWithText(
            "<a href='/rooms/hypnotoad'>#hypnotoad</a>"
        );
        handler(message, function(updatedMessage) {
            expectMessageToMatch(updatedMessage, expectedMessage);
        });
    });
});