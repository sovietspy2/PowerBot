module.exports = {
    name: 'announce',
    description: 'Announces some important stuff!',
    execute(message, args) {
        const pattern = new RegExp('[a-z ]', 'g');

        try {
            const msg = args
                .map(item => item.toLocaleLowerCase())
                .join(" ")
                .split("")
                .filter(letter => letter.match(pattern))
                .map(letter => letter != " " ? `:regional_indicator_${letter}:` : " ")
                .join("");
            if (msg) {
                message.channel.send(msg)
            }
        } catch (e) {
            logger.error(e);
        }
    },
};