const handler = async (m, { conn }) => {
  const datas = global;

  // Verifica si hay un usuario mencionado o si se citó un mensaje
  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted?.sender;
  } else {
    who = m.chat;
  }

  if (!who) return; // Si no hay un objetivo, no hacer nada

  // Marca al usuario como baneado
  const users = datas.db.data.users;
  users[who].banned = true;

  // Reacciona con un emoji de candado cerrado al mensaje del comando
  await conn.sendMessage(m.chat, { react: { text: '🔒', key: m.key } });
};

handler.command = /^banuser$/i;
handler.rowner = true;
export default handler;
