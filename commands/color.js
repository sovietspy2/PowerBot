module.exports = {
	name: 'color',
	description: 'Modifies the color of the role!',
	execute(message, args) {
		if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        var role = message.member.roles.cache.find(role => role.id === '758090774255763496');  // my special role id

        if (role) {
            const color = args.shift();
            switch (color) {
                case "random":
                    role.setColor("RANDOM").catch(console.error);
                    break;
                default:
                    message.channel.send(`${color} is not implemented yet!`);
            }
        } else {
            message.channel.send(`No permission. LOL`);
        }
	},
};