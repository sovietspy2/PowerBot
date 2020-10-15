async function getProfile(id, db) {
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

async function saveProfile(id, profile, db) {
    await db.put(id, JSON.stringify(profile));
}

module.exports = {
    getProfile,
    saveProfile
}