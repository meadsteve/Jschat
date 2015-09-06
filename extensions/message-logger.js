var MessageLogger = function(dataStore) {
    return {
        incoming: function (message, callback) {
            if (message.data && message.data.text) {
                var room = message.channel.slice(message.channel.lastIndexOf('/') + 1);
                var dataStoreId = 'messages.' + room;
                var messagesToKeep = 30;
                var currentMessages = dataStore.getItem(dataStoreId);
                if (!currentMessages)
                    currentMessages = [];

                currentMessages.unshift(message);
                dataStore.setItem(dataStoreId, currentMessages.slice(0, messagesToKeep));
            }

            callback(message);
        }
    };
};
module.exports = MessageLogger;
