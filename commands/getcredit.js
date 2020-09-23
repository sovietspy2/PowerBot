module.exports = {
	name: 'getcredit',
	description: 'Easy way to get credit!',
	execute(message, args, profile) {
		profile.credit += 10;
            message.reply('Your wish is fulfilled!');
	},
};