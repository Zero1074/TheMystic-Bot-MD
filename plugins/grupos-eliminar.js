const handler = async (m, { conn, participants, command, usedPrefix }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.grupos_eliminar;

  if (!global.db.data.settings[conn.user.jid].restrict) 
    throw `${tradutor.texto1[0]} (*_restrict_*), ${tradutor.texto1[1]}`;

  if (!m.mentionedJid[0] && !m.quoted) 
    return m.reply("> Menciona o responde al usuario que quieres eliminar.", m.chat);

  if (m.message.extendedTextMessage === undefined || m.message.extendedTextMessage === null) 
    return m.reply(tradutor.texto3);

  const mentioned = m.message.extendedTextMessage.contextInfo.participant 
                    || m.message.extendedTextMessage.contextInfo.mentionedJid[0];

  if (mentioned && conn.user.jid.includes(mentioned)) 
    return m.reply(tradutor.texto4);

  // Verificar si el mencionado es un admin
  const isAdmin = participants.find(p => p.id === mentioned && p.admin !== null);

  if (isAdmin) {
    // Si el que ejecuta el comando es un admin y la persona mencionada también es admin, reaccionamos con "X"
    if (m.isGroup && participants.find(p => p.id === m.sender && p.admin !== null)) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return;
    }
  }

  // Eliminar al usuario mencionado (solo si no es admin)
  const responseb = await conn.groupParticipantsUpdate(m.chat, [mentioned], 'remove');

  // Reacción con emoji de fuego al mensaje original
  await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });

  // No enviar mensajes de confirmación después de eliminar
};

handler.command = /^(kick|expulsar|eliminar|echar|sacar)$/i;
handler.admin = handler.group = handler.botAdmin = true;
export default handler;
