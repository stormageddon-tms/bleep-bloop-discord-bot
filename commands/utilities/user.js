const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Test if Bleep Bloop can recognise the user'),
    async execute(interaction) {
        await interaction.reply({
            content: `Greetings, ${interaction.member.nickname}, you are logged in as ${interaction.user.username}`,
            ephemeral: true
        });
    }
};