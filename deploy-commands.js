const dotenv = require('dotenv');
const { REST, Routes} = require('discord.js');
const fs = require('fs');
const path = require('node:path');

// Get credentials from .env file
dotenv.config();
// Get credentials from .env file end ---------------------

// Get all commands from all files and push
const commands = [];
const folderPath = path.join(__dirname, 'commands');
const commandsFolder = fs.readdirSync(folderPath);

for (const folder of commandsFolder) {
    const commandsPath = path.join(folderPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    console.log(`Pushing ${commandFiles.length} Slash Commands!\n`);
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
		const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`/${command.data.name} pushed`);
        } else {
            console.log(`❗The Slash Command at ${filePath} is missing the required 'data' or 'execute' property❗`);
        }
    }
    console.log('\nComplete push!');
}
// Get all commands from all files and push end------------

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log(`\n🔄Refreshing ${commands.length} Slash Commands!🔄`);

        const data = rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID),
            { body: commands }
        );

        console.log(`✅Successfully refreshed ${data.length} Slash Commands!✅`);
    } catch (error) {
        console.error(`❌Could not refresh commands! Error message: \n${error}❌`);
    }
})();