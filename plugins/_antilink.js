const linkRegex = /(?:chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})|whatsapp\.com\/channel\/([A-Za-z0-9-_]{20,40}))/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) {
    return true;
  }

  if (!m.isGroup) return false;

  const chat = global.db.data.chats[m.chat];
  const delet = m.key.participant;
  const bang = m.key.id;
  const bot = global.db.data.settings[this.user.jid] || {};
  const isGroupLink = linkRegex.exec(m.text);
  const grupo = `https://chat.whatsapp.com`;

  // Activar Anti-Link si está desactivado
  if (chat.antiLink === undefined || chat.antiLink === false) {
    chat.antiLink = true;
    m.reply("> Anti-Link activado.");
    return true;
  }

  // Si el mensaje contiene un enlace del grupo, ignoramos a los admins
  if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
    return;
  }

  // Si no es admin y se detecta un enlace de grupo o canal
  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return true;
    }

    // Mensaje de eliminación con etiqueta
    const kickMessage = `> Usuario @${m.sender.split('@')[0]} eliminado por Anti-Link.`;

    // Enviar mensaje con mención
    await conn.sendMessage(m.chat, {
      text: kickMessage,
      mentions: [m.sender],
    });

    // Verificar que el bot tenga permisos para eliminar al usuario
    if (!isBotAdmin) return m.reply("> No tengo permisos para eliminar usuarios.");

    if (isBotAdmin && bot.restrict) {
      try {
        // Eliminar el mensaje del usuario
        await conn.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: bang,
            participant: delet,
          },
        });

        // Eliminar al usuario del grupo
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      } catch (error) {
        console.error('Error al intentar eliminar al usuario:', error);
      }
    } else if (!bot.restrict) {
      return m.reply("> No tengo permisos para eliminar usuarios.");
    }
  }

  return true;
}
