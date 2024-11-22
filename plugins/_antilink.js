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
  const isGroupLink = linkRegex.exec(m.text);
  const grupo = `https://chat.whatsapp.com`;

  // Mensaje cuando se activa el Anti-Link
  if (chat.antiLink === undefined || chat.antiLink === false) {
    chat.antiLink = true;
    m.reply("> Anti-Link activado.");
    return !0;
  }

  if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
    return; // No respondemos al usuario que envió el link
  }

  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return !0;
    }

    // Mensaje cuando se elimina al usuario (con etiqueta)
    const kickMessage = `> Usuario @${m.sender.split('@')[0]} eliminado por Anti-Link.`;

    // Enviar el mensaje con la mención
    await conn.sendMessage(m.chat, { 
      text: kickMessage, 
      mentions: [m.sender] 
    });

    // Asegurarnos de que el bot elimine al usuario
    if (!isBotAdmin) return m.reply(tradutor.texto3);

    if (isBotAdmin && bot.restrict) {
      try {
        // Eliminar el mensaje del usuario
        await conn.sendMessage(m.chat, { 
          delete: { 
            remoteJid: m.chat, 
            fromMe: false, 
            id: bang, 
            participant: delet 
          } 
        });

        // Eliminar al usuario del grupo
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      } catch (error) {
        console.error('Error al intentar eliminar al usuario:', error);
      }
    } else if (!bot.restrict) {
      return m.reply(tradutor.texto4);
    }
  }

  return !0;
}
