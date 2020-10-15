module.exports = {
    name: 'color',
    description: 'Modifies the color of the role!',
    execute(message, args) {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        const color = args.shift();

        if (color === "reset" || color === "default" || color === "base") {
            const toRemove = Array.from(message.member.roles.cache.values()).filter(role => role.name !== "@everyone");
            message.member.roles.remove(toRemove);
            message.channel.send(`Kay boss!`);
            return;
        }

        var role = Array.from(message.guild.roles.cache.values()).find(role => role.name === color);  // my special role id

        if (role) {
            message.member.roles.add(role);
            message.reply("Color role changed! You need to use !color reset to remove the current color.")
        } else {
            message.channel.send(`Color role does not exists`);
        }
    },
};