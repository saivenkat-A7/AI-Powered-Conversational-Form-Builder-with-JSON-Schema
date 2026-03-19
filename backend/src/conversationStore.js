const conversations = new Map();

function getConversation(id) {
    if (!conversations.has(id)) {
        conversations.set(id, {
            history: [],
            version: 0,
            schema: null
        });
    }
    return conversations.get(id);
}

function updateConversation(id, history, version, schema) {
    conversations.set(id, { history, version, schema });
}

module.exports = {
    getConversation,
    updateConversation
};
