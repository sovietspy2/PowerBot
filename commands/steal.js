const Discord = require("discord.js");
const { getProfile, saveProfile } = require("./util");

module.exports = {
    name: 'steal',
    description: 'Steal credits!',
    async execute(message, args, profile, db) {
        const embed = new Discord.MessageEmbed()

        const robber = profile;

        const loser = message.mentions.users.first();

        if (!loser) { // OTHER USER
            message.reply("You need to specify a target! U aint smart! 🙄");
            return;
        }

        const loserProfile = selectedProfile = await getProfile(loser.id, db);

        let chance = Math.floor(Math.random() * 11);

        if (chance >= 5) { // stealing

            // most 50% de lehet lejjebb venni
            const amount = Math.floor(Math.random() * 11);
            if (loserProfile.credit < amount) {
                message.reply("maaaaaaan his broke. Leave him alone!")
            } else {
                loserProfile.credit -= amount;
                loserProfile.xp += 15;
                robber.credit += amount;
                await saveProfile(loserProfile.id, loserProfile, db);

                embed.setTitle(`Someone just got robbed!!! 🔫`)
                embed.setDescription(`${loser} lost ${amount} credtis!`);
                message.channel.send(embed);
            }
        } else {
            message.reply("You failed. 😬")
        }
    },
};