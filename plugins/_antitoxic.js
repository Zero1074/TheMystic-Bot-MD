const toxicRegex = /\b(porno|cp|cafe con pan|café con pan|camiones pesados|caldo de pollo|servicios de un hacker|c p)\b/i;

export async function before(m, { isAdmin, isBotAdmin, isOwner }) {
  // Asegúrate de que el bot es administrador
  if (!isBotAdmin) {
    console.error('El bot necesita permisos de administrador para eliminar usuarios.');
    return !1;
  }

  // No actuar si el mensaje es del bot o no es un grupo
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;

  const user = global.db.data.users[m.sender];
  const chat = global.db.data.chats[m.chat];

  // Verificar si el comando /enable antitoxic está siendo enviado
  if (m.text.startsWith('/enable antitoxic')) {
    if (isAdmin || isOwner) {
      chat.antitoxic = true;
      await m.reply('> Anti-Tóxico activado');
      console.log(`Anti-Tóxico activado por ${m.sender}`);  // Depuración
      return !1;
    } else {
      await m.reply('> Solo los administradores o el propietario pueden activar el antitóxico.');
      return !1;
    }
  }

  // Comando para deshabilitar antitóxico
  if (m.text.startsWith('/disable antitoxic') && (isAdmin || isOwner)) {
    chat.antitoxic = false;
    await m.reply('> Anti-Tóxico desactivado');
    return !1;
  }

  // Verifica si el antitóxico está habilitado
  if (!chat.antitoxic && !isOwner) {
    return !1; // No procesar el mensaje si el antitóxico no está habilitado
  }

  // Verifica si el mensaje contiene una palabra prohibida
  const isToxic = toxicRegex.exec(m.text);

  // Comando para reiniciar advertencias
  if (m.text.startsWith('/clean') && (isAdmin || isOwner)) {
    try {
      let targetUser;

      // Si el mensaje responde a alguien, usar ese usuario
      if (m.quoted) {
        targetUser = m.quoted.sender;
      } else {
        // De lo contrario, extraer el usuario mencionado en el comando
        const mention = m.text.split(' ')[1];
        if (mention && mention.includes('@')) {
          targetUser = mention.replace(/[@]/g, '') + '@s.whatsapp.net';
        }
      }

      if (targetUser && global.db.data.users[targetUser]) {
        global.db.data.users[targetUser].warn = 0; // Reinicia las advertencias
        // Reacciona con un check al mensaje del admin usando "reactionMessage"
        await m.conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });
      } else {
        console.error('No se encontró al usuario o no se mencionó correctamente.');
      }
    } catch (error) {
      console.error('Error al intentar reiniciar advertencias:', error);
    }
    return !1; // Detener aquí si es un comando de limpieza
  }

  // Si se detecta una palabra prohibida y el remitente no es admin ni owner
  if (isToxic && !isOwner && !isAdmin) {
    try {
      // Si el usuario no tiene advertencias, inicializa el contador
      if (!user.warn) user.warn = 0;

      // Aumenta el contador de advertencias
      user.warn += 1;

      // Elimina el mensaje original
      await m.delete();

      // Enviar advertencia según el número de advertencia
      if (user.warn < 3) {
        await m.reply(
          `> Palabra prohibida, advertencia ${user.warn}/3`,
          false,
          { mentions: [m.sender] }
        );
      } else {
        // Si llega a 3 advertencias, eliminar al usuario
        await m.reply(
          `> Usuario eliminado por anti-toxic`,
          false,
          { mentions: [m.sender] }
        );
        await m.conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove'); // Elimina al usuario
        user.banned = true; // Marca al usuario como baneado
        user.warn = 0; // Resetea el contador de advertencias
      }

      // Guardar los datos del usuario
      global.db.data.users[m.sender] = user;
    } catch (error) {
      console.error('Error al procesar el mensaje:', error);
    }
  }
  return !1;
}

