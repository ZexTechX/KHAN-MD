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
    pattern: "chr3",
    alias: ["rch"],
    desc: "React to WhatsApp channel messages",
    category: "channel",
    react: "💬",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, text, isCreator }) => {
    try {
        if (!isCreator) return reply("This command is only for the bot owner!");
        if (!text) return reply("Example:\n.reactch https://whatsapp.com/channel/xxx/123 ❤️\n.reactch https://whatsapp.com/channel/xxx/123 ❤️|5");

        const hurufGaya = {
            a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
            h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
            o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
            v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
            '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
            '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
        };

        const [mainText, offsetStr] = text.split('|');
        const args = mainText.trim().split(" ");
        const link = args[0];

        if (!link.includes("https://whatsapp.com/channel/")) {
            return reply("Invalid link!\nExample: .reactch https://whatsapp.com/channel/xxx/Jawad ❤️|3");
        }

        const channelId = link.split('/')[4];
        const rawMessageId = parseInt(link.split('/')[5]);
        if (!channelId || isNaN(rawMessageId)) return reply("Incomplete link!");

        const offset = parseInt(offsetStr?.trim()) || 1;
        const teksNormal = args.slice(1).join(' ');
        const teksTanpaLink = teksNormal.replace(link, '').trim();
        if (!teksTanpaLink) return reply("Please enter text/emoji to react with.");

        const emoji = teksTanpaLink.toLowerCase().split('').map(c => {
            if (c === ' ') return '―';
            return hurufGaya[c] || c;
        }).join('');

        const metadata = await conn.newsletterMetadata("invite", channelId);
        let success = 0, failed = 0;

        for (let i = 0; i < offset; i++) {
            const msgId = (rawMessageId - i).toString();
            try {
                await conn.newsletterReactMessage(metadata.id, msgId, emoji);
                success++;
            } catch (e) {
                failed++;
            }
        }

        reply(`✅ Successfully sent reaction *${emoji}* to ${success} messages in channel *${metadata.name}*\n❌ Failed for ${failed} messages`);
    } catch (err) {
        console.error("ReactCh Error:", err);
        reply("❌ Failed to process the request!");
    }
});
