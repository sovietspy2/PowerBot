module.exports = {
    name: 'getlevel',
    description: 'Easy way to get level!',
    execute(message, args, profile) {
        profile.level += 1;
        message.reply('Your wish is fulfilled!');
    },
};