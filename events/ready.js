const { Events } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`🎶Bleep Bloop is online! Logged in as ${client.user.tag}🎶`);

        // Bot status setup
        const defaultStatusName = config.activities.name + '\nRunning ' + config.version;
        const defaultStatusType = Number(config.activities.type);

        client.user.presence.set({
            activities: [{
                name: defaultStatusName,
                type: defaultStatusType
            }]
        });
        // Bot status setup end ---------------------------
    }
};