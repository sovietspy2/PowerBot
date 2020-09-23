const Discord = require("discord.js");

async function getProfile(id,db) {
    try {
        const profile = JSON.parse(await db.get(id));
        return profile;
    } catch (e) {
        const newProfile = {
            id: id,
            firstSeen: new Date().toUTCString(),
            lastSeen: new Date().toUTCString(),
            level: 1,
            xp: 1,
            credit: 5,
        };
        await db.put(id, JSON.stringify(newProfile));
        const profile = JSON.parse(await db.get(id));
        return profile;
    }
}

module.exports = {
	name: 'stats',
	description: 'Desplays stats!',
	async execute(message, args, profile,db) {
		const embed = new Discord.MessageEmbed()

            let selectedProfile = profile;

            const user = message.mentions.users.first()

            if (user) { // OTHER USER
                selectedProfile = await getProfile(user.id,db);
            }

            const name = user ? user.username : message.author.username;

            embed.setTitle(`${name}'s stats`)
            embed.setDescription(`Level: ${selectedProfile.level} Current XP progress: ${selectedProfile.xp}/100  XP: Last seen: ${selectedProfile.lastSeen} Credits: ${selectedProfile.credit}`);
            message.channel.send(embed)
	},
};