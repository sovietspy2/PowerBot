module.exports = {
	name: 'getxp',
	description: 'Easy way to get xp!',
	execute(message, args, profile) {
		profile.xp += 100;
		message.reply('Your wish is fulfilled!');
	},
};