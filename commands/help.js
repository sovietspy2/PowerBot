const Discord = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Displays some basic commands!',
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
        embed.setTitle('Avaiable commands:')
        embed.setDescription(`usage: !commandName`);
        embed.addField("See a user's status", "`!stats @user`");
        embed.addField("Slap someone", "`!slap @user`");
        embed.addField("Complete a task", '`!complete HBP3-1234`');
        embed.addField("Steal credits", '`!steal @user`');
        embed.addField("Announce something important", '`!announce <text>`')
        embed.addField("Change color", '`!color random`')
        //embed.setFooter(`this embed made by ${msg.author.username}`)
        message.channel.send(embed)
    },
};