const { Events, Collection } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Slash Commands handling
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command with the name ${interaction.commandName} was found`);
            return;
        }

        // Cooldown handling
        const { cooldowns } = interaction.client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timeStamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

        if (timeStamps.has(interaction.user.id)) {
            const expirationTime = timeStamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimeStamp = Math.round(expirationTime / 1_000);
                return interaction.reply({
                    content: `Please wait, you're on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimeStamp}:R>`,
                    ephemeral: true
                });
            }
        }
        timeStamps.set(interaction.user.id, now);
        setTimeout(() => timeStamps.delete(interaction.user.id), cooldownAmount);
        // Cooldown handling end --------------------------

        try {
            console.log(`User ${interaction.user.username} (${interaction.member.nickname}) just ran /${interaction.commandName} in ${interaction.channel.name}`);
            await command.execute(interaction);
        } catch (error) {
            console.error(`Trying to execute ${interaction.commandName} has failed. Error message: \n${error}`);
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({
                    content: `There was an error trying to execute this command! Message: ${error}`,
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `There was an error trying to execute this command! Message: ${error}`,
                    ephemeral: true
                });
            }
        }
        // Slash Commands handling end --------------------
    }
};