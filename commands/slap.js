const Discord = require("discord.js");

module.exports = {
    name: 'slap',
    description: 'Slap the hell out of somebody!',
    execute(message, args, profile) {
        if (profile.credit > 10) {
            const embed = new Discord.MessageEmbed()
            profile.credit -= 10;
            logger.debug('slapping in progress');

            const user = message.mentions.users.first()
            embed.setTitle(`Someone just recieved a major SLAP! :clap:`)
            embed.setDescription(`${user} ouch! That must have hurt!`)
            embed.setFooter(`slap powered by ${message.author.username}`)
            message.channel.send(embed)
        } else {
            message.reply('You need 10 credits to slap someone!');
        }
    },
};