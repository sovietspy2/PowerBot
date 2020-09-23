require('dotenv').config()
const level = require('level')
const Discord = require("discord.js");
const logger = require("./logger");

const token = process.env.TOKEN
const bot = new Discord.Client()

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

async function validateTask(task, userId) {
    // tobbszor ne lehessen completolni 
    // key TASKID value USERNAME 
    // tehat ugyan az a user csak 1 szer clamielheti egyszerre, de ha kesobb visszakapja akkor mjd urja
    let valid = true;
    let existingUser
    try {
        existingUser = await db.get(task);
        valid = existingUser !== userId;

        if (valid) {
            await db.put(task, userId);
        }
    } catch (e) {
        await db.put(task, userId);
    }
    return valid;
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
        const command = args.shift().toLowerCase()


        if (command === 'test') {
            msg.channel.send("TEST")
        }

        if (command === 'color') {

            if (!args.length) {
                return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
            }

            var role = msg.member.roles.cache.find(role => role.id === '758090774255763496');  // my special role id

            if (role) {
                const color = args.shift();
                switch (color) {
                    case "random":
                        return role.setColor("RANDOM").catch(console.error);
                    default:
                        return msg.channel.send(`${color} is not implemented yet!`);
                }
            } else {
                return msg.channel.send(`No permission. LOL`);
            }
        }


        if (command === 'complete') {
            for (task of args) {

                if (task.includes(process.env.COMPLETE_TEMPLATE) && await validateTask(task, profile.id)) {
                    bot.channels.cache.get(activeChannel).send(`<@${profile.id}> just completed :white_check_mark:${task} and recieved 30XP `);
                    profile.xp += 30;
                    profile.credits += 10;
                } else {
                    msg.reply('Nah not happening! This seems fishy!');
                }
            }
        }

        if (command === 'announce') {
            try {
                const message = args
                    .map(item => item.toLocaleLowerCase())
                    .join(" ")
                    .split("")
                    .map(letter => letter != " " ? `:regional_indicator_${letter}:` : " ")
                    .join("");
                bot.channels.cache.get(activeChannel).send(message);
            } catch (e) {
                logger.error(e);
            }

        }

        if (command === 'slap') {

            if (profile.credit > 10) {
                const embed = new Discord.MessageEmbed()
                profile.credit -= 10;
                await saveProfile(msg.author.id, profile);
                logger.debug('slapping in progress');

                const user = msg.mentions.users.first()
                embed.setTitle(`Someone just recieved a major SLAP! :clap:`)
                embed.setDescription(`${user} ouch! That must have hurt!`)
                embed.setFooter(`slap powered by ${msg.author.username}`)
                msg.channel.send(embed)
            } else {
                msg.reply('You need 10 credits to slap someone!');
            }
        }

        if (command === 'getcredits') {
            //const user = msg.author
            profile.credit += 10;
            msg.reply('Your wish is fulfilled!');
        }

        if (command === 'getlevel') {
            //const user = msg.author
            profile.level += 1;
            msg.reply('Your wish is fulfilled!');
        }

        if (command === 'getxp') {
            //const user = msg.author
            profile.xp += 100;
            msg.reply('Your wish is fulfilled!');
        }

        if (command === 'stats') {

            const embed = new Discord.MessageEmbed()

            let selectedProfile = profile;

            const user = msg.mentions.users.first()

            if (user) { // OTHER USER
                selectedProfile = await getProfile(user.id);
            }

            const name = user ? user.username : msg.author.username;

            embed.setTitle(`${name}'s stats`)
            embed.setDescription(`Level: ${selectedProfile.level} Current XP progress: ${selectedProfile.xp}/100  XP: Last seen: ${selectedProfile.lastSeen} Credits: ${selectedProfile.credit}`);
            msg.channel.send(embed)
        }


        if (command === 'help') {
            let embed = new Discord.MessageEmbed()
            embed.setTitle('Avaiable commands:')
            embed.setDescription(`usage: !commandName`);
            embed.addField("See a user's status", "`!stats @user`");
            embed.addField("Slap someone", "`!slap @user`");
            embed.addField("Complete a task", '`!complete HBP3-1234`');
            embed.addField("Steal credits", '`!steal @user`');
            embed.addField("Announce something important", '`!announce <text>`')
            embed.addField("Change color", '`!color random`')
            //embed.setFooter(`this embed made by ${msg.author.username}`)
            msg.channel.send(embed)

        }

        profile.lastSeen = new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })
        profile.xp += 1; // ha hasznalta a botot kap 1 xp-t
        await saveProfile(msg.author.id, profile);

    })

    perodicChecks(1000 * 60 * 5);
    bot.login(token); //bot starts
}

main();