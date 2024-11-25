const handler = async (m, {conn, usedPrefix, text}) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;

  if (isNaN(text) && !text.match(/@/g)) {
    // Si no hay número ni usuario mencionado, hacer nada.
  } else if (isNaN(text)) {
    var number = text.split`@`[1];
  } else if (!isNaN(text)) {
    var number = text;
  }

  if (!text && !m.quoted) return;
  if (number.length > 13 || (number.length < 11 && number.length > 0)) return;

  try {
    if (text) {
      var user = number + '@s.whatsapp.net';
    } else if (m.quoted.sender) {
      var user = m.quoted.sender;
    } else if (m.mentionedJid) {
      var user = number + '@s.whatsapp.net';
    }
  } catch (e) {
    console.log(e);
  } finally {
    // Reaccionar con un check (✔) al mensaje del comando /promote
    try {
      await conn.sendMessage(m.chat, { react: { text: '✔', key: m.key } });
    } catch (e) {
      console.error('Error al agregar la reacción:', e);
    }

    // Promover al usuario
    conn.groupParticipantsUpdate(m.chat, [user], 'promote');
  }
};

handler.help = ['*593xxx*', '*@usuario*', '*responder chat*'].map((v) => 'promote ' + v);
handler.tags = ['group'];
handler.command = /^(promote|daradmin|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
