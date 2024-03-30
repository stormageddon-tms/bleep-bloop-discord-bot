const dotenv = require('dotenv');
const fs = require('fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Get credentials from .env file
dotenv.config();
// Get credentials from .env file end ---------------------

// Set up client intents
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions
]});
// Set up client intents end ------------------------------

// Set up commands
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
// Set up commands end ------------------------------------

// Set up slash commands behaviour
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command with the name ${interaction.commandName} was found`);
        return;
    }

    try {
        console.log(`User ${interaction.user.username} just ran /${interaction.commandName}`);
        await command.execute(interaction);
    } catch (error) {
        console.error(`Trying to execute ${interaction.commandName} has failed. Error message: \n${error}`);
        if (interaction.replied || interaction.deferred) {
            // if message was sent/deferred, follow up with error
            interaction.followUp({
                content: `There was an error trying to execute this command! Message: ${error}`,
                ephemeral: true
            });
        } else {
            // if no message was sent, send reply with error
            interaction.reply({
                content: `There was an error trying to execute this command! Message: ${error}`,
                ephemeral: true
            });
        }
    }
});
// Set up slash commands behaviour end --------------------

client.once(Events.ClientReady, readyClient => {
	console.log(`🎶Bleep Bloop is online! Logged in as ${readyClient.user.tag}🎶`);
});

client.login(process.env.BOT_TOKEN);