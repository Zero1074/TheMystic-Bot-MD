const handler = async (m, { conn }) => {
  const datas = global;

  // Identificar al usuario objetivo (mención o respuesta)
  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted?.sender;
  } else {
    who = m.chat;
  }

  if (!who) return; // Si no hay objetivo, no hacer nada

  // Desbanear al usuario
  const users = datas.db.data.users;
  users[who].banned = false;

  // Reaccionar con un emoji de candado abierto 🔓 al comando
  await conn.sendMessage(m.chat, { react: { text: '🔓', key: m.key } });
};

handler.help = ['unbanuser'];
handler.tags = ['owner'];
handler.command = /^unbanuser$/i;
handler.rowner = true;
export default handler;
