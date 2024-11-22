const { downloadContentFromMessage } = (await import("baileys"));

const handler = async (m, { conn }) => {
  // Verificar si el comando se usa en un grupo
  if (!m.isGroup) {
    return; // No hacer nada si no es en un grupo
  }

  // Verificar si el mensaje citado existe y es del tipo "viewOnceMessageV2"
  if (!m.quoted || m.quoted.mtype !== 'viewOnceMessageV2') {
    return; // No hacer nada si no cumple las condiciones
  }

  // Obtener información del grupo y verificar si el usuario es administrador
  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;
  const isAdmin = participants.some(member => member.id === m.sender && (member.admin === 'admin' || member.admin === 'superadmin'));

  if (!isAdmin) {
    // Reaccionar con "❌" si no es administrador
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  // Si es administrador, procesar el contenido del mensaje citado
  const msg = m.quoted.message;
  const type = Object.keys(msg)[0];
  const media = await downloadContentFromMessage(msg[type], type === 'imageMessage' ? 'image' : 'video');

  let buffer = Buffer.from([]);
  for await (const chunk of media) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  // Enviar el archivo al grupo
  if (/video/.test(type)) {
    return conn.sendFile(m.chat, buffer, 'video.mp4', msg[type].caption || '', m);
  } else if (/image/.test(type)) {
    return conn.sendFile(m.chat, buffer, 'image.jpg', msg[type].caption || '', m);
  }
};

handler.help = ['readvo'];
handler.tags = ['tools'];
handler.command = /^(readviewonce|read|revelar|readvo)$/i;
handler.admin = true; // Solo administradores pueden usar este comando
handler.group = true; // Solo en grupos
export default handler;
