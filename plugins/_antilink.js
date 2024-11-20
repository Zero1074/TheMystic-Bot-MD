const linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  const idioma = global.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins._antilink;

  if (m.isBaileys && m.fromMe) {
    return !0;
  }

  if (!m.isGroup) return !1;

  const chat = global.db.data.chats[m.chat];
  const delet = m.key.participant;
  const bang = m.key.id;
  const bot = global.db.data.settings[this.user.jid] || {};
  const user = `@${m.sender.split`@`[0]}`;
  const isGroupLink = linkRegex.exec(m.text);
  const grupo = `https://chat.whatsapp.com`;

  // Mensaje cuando se activa el Anti-Link
  if (chat.antiLink === undefined || chat.antiLink === false) {
    chat.antiLink = true;
    m.reply("> Anti-Link activado.");
    return !0;
  }

  if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
    return m.reply(tradutor.texto1.replace('@user', '@' + user.split('@')[0]));
  }

  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return !0;
    }

    // Mensaje cuando se elimina al usuario
    const kickMessage = `> Usuario @${m.sender.split`@`[0]} eliminado por Anti-link.`;

    await this.sendMessage(m.chat, { text: kickMessage, mentions: [m.sender] }, { quoted: m });

    if (!isBotAdmin) return m.reply(tradutor.texto3);

    if (isBotAdmin && bot.restrict) {
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
      const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      if (responseb[0].status === '404') return;
    } else if (!bot.restrict) return m.reply(tradutor.texto4);
  }

  return !0;
}
