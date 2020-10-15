async function validateTask(task, userId, db) {
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

module.exports = {
    name: 'complete',
    description: 'Complete some tasks and get some rewards!',
    async execute(message, args, profile, db) {
        for (task of args) {

            if (task.includes(process.env.COMPLETE_TEMPLATE) && await validateTask(task, profile.id, db)) {
                message.channel.send(`<@${profile.id}> just completed :white_check_mark:${task} and recieved 30XP and 10 credits`);
                profile.xp += 30;
                profile.credit += 10;
            } else {
                message.reply('Nah not happening! This seems fishy!');
            }
        }
    },
};

