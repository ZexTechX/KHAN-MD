const { cmd, commands } = require('../command');
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Toggle anti-delete feature",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe }) => {
    if (!isCreator) return reply('This command is only for the bot owner');
    try {
        const command = q?.toLowerCase().trim();
        const currentStatus = await getAnti();

        if (!command || command === 'status') {
            return reply(`AntiDelete is currently ${currentStatus ? '✅ ON' : '❌ OFF'}\n\nUsage:\n• .antidelete on - Enable\n• .antidelete off - Disable`);
        }

        if (command === 'on') {
            await setAnti(true);
            return reply('✅ AntiDelete has been enabled for both group chats and direct messages');
        } else if (command === 'off') {
            await setAnti(false);
            return reply('❌ AntiDelete has been disabled for both group chats and direct messages');
        } else {
            return reply('Invalid command. Usage:\n• .antidelete on\n• .antidelete off\n• .antidelete status');
        }
    } catch (e) {
        console.error("Error in antidelete command:", e);
        return reply("An error occurred while processing your request.");
    }
});
