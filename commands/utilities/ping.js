const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test connection of Bleep Bloop'),
    async execute(interaction) {
        await interaction.reply({
            content: `Greetings, ${interaction.member.nickname}! Bleep Bloop is at your service!`,
            ephemeral: true
        });
    }
};