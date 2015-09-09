var    statix = require('node-static'),
       http = require('http'),
       Faye = require('faye'),
       diceRollExtension = require("./extensions/dice-roll"),
       gifMeExtension = require("./extensions/gif-me"),
       nodePersistStorage = require('./storage/node-persist-messages'),
       redisStorage = require('./storage/redis-messages'),
       scriptFilterExtension = require('./extensions/script-filter.js'),
       messageLogging = require('./extensions/message-logger.js'),
       autoHtmlExtension = require("./extensions/auto-html");

var dataStore;
if (process.env.REDIS_URL) {
    var client = require('redis').createClient(process.env.REDIS_URL);
    dataStore = redisStorage.new(client);
} else {
    var nodePersist = require('node-persist');
    nodePersist.initSync();
    dataStore = nodePersistStorage.new(nodePersist);
}
var bayeux = new Faye.NodeAdapter({mount: '/faye', timeout: 5 });

var file = new(statix.Server)('./www');

var server = http.createServer(function(request, response) {
    request.addListener('end', function() {
        if (request.url.indexOf('/rooms/') === 0) {
            file.serveFile('/index.html', 200, {}, request, response);
        } else if (request.url.indexOf('/history/') === 0) {
            var room = request.url.slice(request.url.lastIndexOf('/') + 1);
            if (!room)
                room = 'Welcome';
            dataStore.loadMessages(room, function(messages) {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end( JSON.stringify(messages) );
            });
        } else {
            file.serve(request, response);
        }
    }).resume();
});

bayeux.attach(server);
bayeux.addExtension(scriptFilterExtension);
bayeux.addExtension(autoHtmlExtension);
bayeux.addExtension(gifMeExtension);
bayeux.addExtension(diceRollExtension("dice me"));
bayeux.addExtension(messageLogging(dataStore));


var port = process.env.PORT || 8001;
server.listen(port);
console.log('listening on: ' + port);
