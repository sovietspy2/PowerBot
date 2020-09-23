require('dotenv').config()
const level = require('level')
const fs = require('fs');
const Discord = require("discord.js");
const logger = require("./logger");

const token = process.env.TOKEN
const bot = new Discord.Client()
bot.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}

const prefix = '!'
// create or open database
const db = level(process.env.DB);

logger.info("LOGGER INFO");
logger.debug("LOGGER DEBUG");
logger.error("LOGGER ERROR")

let activeChannel = null;

let firstLoginWinner = null;

// json parse damn
async function getProfile(id) {
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

async function saveProfile(id, profile) {
    await db.put(id, JSON.stringify(profile));
}

async function handleFirstLoginOfTheDay(msg) {
    logger.info("handle first login current hour:" + new Date().getHours())
    if (!firstLoginWinner && new Date().getHours() >= 7 && new Date().getHours() <= 9) {
        if (activeChannel) {

            const profile = await getProfile(msg.author.id);
            profile.xp += 25;
            profile.credit += 10;
            await saveProfile(profile.id, profile);

            firstLoginWinner = msg.author.id;
            console.log("first winner announced");
            bot.channels.cache.get(activeChannel).send(`<@${msg.author.id}> is the first today and recieved 25 XP and 10 credits! :yawning_face: `);
        }
    }
}

async function main() {

    const perodicChecks = (millis) => {

        // FIRST LOGIN OF THE DAY
        if (firstLoginWinner && new Date().getHours() === 23) {
            firstLoginWinner = null;
        }

        // LEVEL UPS  AND ANNOUCNEMNTS
        const readStream = db.createReadStream({});
        readStream.on('data', function (data) {
            // each key/value is returned as a 'data' event
            console.log(data.key + ' = ' + data.value);

            const profile = JSON.parse(data.value);
            if (profile.xp >= 100) {
                const remainingXp = profile.xp - 100;
                profile.xp = remainingXp;
                profile.level += 1;
                saveProfile(profile.id, profile);

                if (activeChannel) {
                    console.log("BATCH PROCESS")
                    bot.channels.cache.get(activeChannel).send(`<@${profile.id}> just reach LVL: ${profile.level}! Congratz! :sparkles:`);
                }
            }
        });
        setTimeout(() => perodicChecks(millis), millis)
    }



    bot.on('message', async (msg) => {

        activeChannel = msg.channel.id; // DEFAULT CHANNEL BEALLITAS

        handleFirstLoginOfTheDay(msg);

        if (msg.content[0] !== prefix) {
            console.log('no prefix')
            return
        }

        const profile = await getProfile(msg.author.id);

        const args = msg.content.slice(prefix.length).trim().split(' ')

        const commandName = args.shift().toLowerCase();

        if (!bot.commands.has(commandName)) return;

        const command = bot.commands.get(commandName);

        try {
            await command.execute(msg, args, profile, db);

            if (command.guildOnly && msg.channel.type === 'dm') {
                return message.reply('I can\'t execute that command inside DMs!');
            }
        } catch (error) {
            console.error(error);
            msg.reply('There was an error trying to execute that command!');
        }

        profile.lastSeen = new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })
        profile.xp += 1; // ha hasznalta a botot kap 1 xp-t
        await saveProfile(msg.author.id, profile);

    })

    perodicChecks(1000 * 60 * 5);
    bot.login(token); //bot starts
}

main();