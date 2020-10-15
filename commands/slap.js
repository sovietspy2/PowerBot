const Discord = require("discord.js");
const logger = require("../logger");

module.exports = {
    name: 'slap',
    description: 'Slap the hell out of somebody!',
    execute(message, args, profile) {
        if (profile.credit > 10) {
            const embed = new Discord.MessageEmbed()
            profile.credit -= 10;
            logger.debug('slapping in progress');

            const user = message.mentions.users.first();
            if (user && user.username === "PowerBot" && user.bot === true) {
                logger.info("someone just triggered rage mode");
                // rage mode
                message.channel.send("WHAT THE FUCK DID U JUST SAY");
                message.channel.send("YOU FACKIN PEICE OF SHIT");
                message.channel.send("GODDAMIT ");
                message.channel.send("how dare you ????????");
                message.channel.send("HOW DARE YOU TRY TO SLAP ME?");
                message.channel.send("meeeeee?");
                message.channel.send("U HAVE ANY IDEA WHO I AM?");
                message.channel.send("IM LIKE A GOD HERE I OWN THIS PLACE");
                message.channel.send("now go stfu!!!!!");
                message.channel.send("", { files: ["https://media.tenor.com/images/e796aa2632c80c2b3fc22dca7150b0a3/tenor.gif"] })
            } else if (user) {
                embed.setTitle(`Someone just recieved a major SLAP! :clap:`);

                args.shift();
                const reason = args.join(" ");

                if (reason) {
                    embed.setDescription(`${user} got slapped! Reason: ${reason} `);
                } else {
                    embed.setDescription(`${user} ouch! That must have hurt!`);
                }

                embed.setFooter(`slap powered by ${message.author.username}`);
                message.channel.send(embed);
            } else {
                message.reply('Slap who??!');
            }

        } else {
            message.reply('You need 10 credits to slap someone!');
        }
    },
};