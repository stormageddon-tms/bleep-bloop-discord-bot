const dotenv = require('dotenv');
const fs = require('fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Getting environment variables
dotenv.config();
// Getting environment variables end ---------------------

// Client Intents setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions
    ]
});
// Client Intents setup end ------------------------------

// Commands setup
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
		} else {
            console.log(`❗The command at ${filePath} is missing a required "data" or "execute" property❗`);
		}
	}
}
// Commands setup end ------------------------------------

// Cooldowns setup
client.cooldowns = new Collection();
// Cooldowns setup end ------------------------------------


// Route event handling
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
// Route event handling end -------------------------------

// Bot log in
const botToken = process.env.BOT_TOKEN;
client.login(botToken);
// Bot log in end -----------------------------------------