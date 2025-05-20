const config = require('../config');
const { cmd } = require('../command');

const stylizedChars = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

cmd({
    pattern: "chr",
    alias: ["reacttext"],
    react: "🔤",
    desc: "React to channel messages with stylized text",
    category: "owner",
    use: '.chr <channel-link> <text>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isCreator) return reply("❌ Owner only command");
        if (!q) return reply(`Usage:\n${command} https://whatsapp.com/channel/1234567890 hello`);

        const [link, ...textParts] = q.split(' ');
        if (!link.includes("whatsapp.com/channel/")) return reply("Invalid channel link format");
        
        const inputText = textParts.join(' ').toLowerCase();
        if (!inputText) return reply("Please provide text to convert");

        const emoji = inputText
            .split('')
            .map(char => {
                if (char === ' ') return '―';
                return stylizedChars[char] || char;
            })
            .join('');

        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];
        if (!channelId || !messageId) return reply("Invalid link - missing IDs");

        const channelMeta = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(channelMeta.id, messageId, emoji);

        return reply(`╭━━━〔 *KHAN-MD* 〕━━━┈⊷
┃▸ *Success!* Reaction sent
┃▸ *Channel:* ${channelMeta.name}
┃▸ *Reaction:* ${emoji}
╰────────────────┈⊷
> *© Pᴏᴡᴇʀᴇᴅ Bʏ KʜᴀɴX-Aɪ ♡*`);
    } catch (e) {
        console.error(e);
        reply(`❎ Error: ${e.message || "Failed to send reaction"}`);
    }
});

cmd({
    pattern: "chr2",
    alias: ["chremoji", "reactemoji"],
    react: "😀",
    desc: "React to channel messages with 10x repeated emoji",
    category: "owner",
    use: '.chremo <channel-link> <emoji>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isCreator) return reply("❌ Owner only command");
        if (!q) return reply(`Usage:\n${command} https://whatsapp.com/channel/1234567890 🌚`);

        const [link, emoji] = q.split(' ');
        if (!link.includes("whatsapp.com/channel/")) return reply("Invalid channel link");
        if (!emoji) return reply("Please provide an emoji");

        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];
        if (!channelId || !messageId) return reply("Invalid link - missing IDs");

        const channelMeta = await conn.newsletterMetadata("invite", channelId);
        
        // Create reaction with emoji repeated 10 times
        const repeatedEmoji = emoji.trim().repeat(10);
        await conn.newsletterReactMessage(channelMeta.id, messageId, repeatedEmoji);

        return reply(`╭━━━〔 *KHAN-MD* 〕━━━┈⊷
┃▸ *Success!* Reaction sent
┃▸ *Channel:* ${channelMeta.name}
┃▸ *Reaction:* ${repeatedEmoji}
╰────────────────┈⊷
> *© Pᴏᴡᴇʀᴇᴅ Bʏ KʜᴀɴX-Aɪ ♡*`);
    } catch (e) {
        console.error(e);
        reply(`❎ Error: ${e.message || "Failed to send reaction"}`);
    }
});

cmd({
    pattern: "chrx",
    alias: ["massreact"],
    react: "🔢",
    desc: "Send multiple reactions to increment count",
    category: "owner",
    use: '.chrx <link> <emoji>,<count>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, isCreator, reply }) => {
    try {
        if (!isCreator) return reply("❌ Owner only command");
        if (!q) return reply(`Usage:\n.chrx <link> <emoji>,<count>\nExample: .chrx https://whatsapp.com/channel/123 🙂,100`);

        // Parse input
        const [link, emojiPart] = q.split(' ').filter(x => x);
        if (!emojiPart.includes(",")) return reply("Invalid format! Use: .chrx <link> <emoji>,<count>");
        
        const [emoji, countStr] = emojiPart.split(',');
        const count = parseInt(countStr);
        
        // Validate inputs
        if (!link.includes("whatsapp.com/channel/")) return reply("Invalid WhatsApp channel link");
        if (!emoji || isNaN(count) || count < 1 || count > 200) return reply("Invalid emoji or count (1-200 max)");

        // Get channel info
        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];
        if (!channelId || !messageId) return reply("Invalid link - missing channel/message ID");

        const channelMeta = await conn.newsletterMetadata("invite", channelId);
        
        // Send reactions with unique variation
        let successCount = 0;
        const progressMsg = await reply(`⏳ Starting to send ${count} reactions...`);
        
        for (let i = 0; i < count; i++) {
            try {
                // Add slight variation to avoid detection
                const variation = i % 5 === 0 ? " " : ""; // Add space every 5th reaction
                await conn.newsletterReactMessage(channelMeta.id, messageId, emoji + variation);
                successCount++;
                
                // Update progress
                if (i % 10 === 0) {
                    await conn.sendMessage(from, { 
                        edit: progressMsg.key, 
                        text: `⏳ Progress: ${successCount}/${count} reactions sent...` 
                    });
                }
                
                await new Promise(res => setTimeout(res, 1500 + Math.random() * 1000)); // Random delay 1.5-2.5s
            } catch (e) {
                console.error(`Reaction ${i+1} failed:`, e.message);
            }
        }

        return reply(`✅ Successfully sent ${successCount} ${emoji} reactions to:\n${channelMeta.name}`);

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});
