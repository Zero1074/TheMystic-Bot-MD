const handler = async (m) => {
  global.db.data.chats[m.chat].isBanned = true;
  const sentMessage = await m.reply("> Chat baneado con éxito. 🔒");

  // Verifica si el objeto de mensaje tiene un id disponible
  if (sentMessage && sentMessage.key && sentMessage.key.id) {
    const messageId = sentMessage.key.id;
    // Aquí se envía la reacción usando el ID del mensaje
    await conn.sendMessage(m.chat, { react: { text: '🔒', key: m.key } });

  } else {
    console.error("No se pudo obtener el ID del mensaje para reaccionar.");
  }
};

handler.help = ['banchat'];
handler.tags = ['owner'];
handler.command = /^banchat$/i;
handler.rowner = true;
export default handler;
