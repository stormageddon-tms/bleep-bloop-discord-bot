const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test connection of Bleep Bloop'),
    async execute(interaction) {
        await interaction.reply({
            content: 'Pong! Bleep Bloop is at your service!',
            ephemeral: true
        });
    }
};