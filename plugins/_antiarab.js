const handler = (m) => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin, participants }) {
  if (!m.isGroup) return; // Solo en grupos
  const chat = global.db.data.chats[m.chat];

  // Lista de prefijos bloqueados
  const prefixes = ['212', '265', '92', '234'];

  // Comando "/see": menciona a los usuarios con prefijos bloqueados
  if (m.text === '/see' && isAdmin) {
    const filteredUsers = participants.filter((user) =>
      prefixes.includes(user.id.slice(0, 3))
    );

    if (filteredUsers.length > 0) {
      const mentions = filteredUsers.map((user) => `@${user.id.split('@')[0]}`).join('\n');
      m.reply(`> Usuarios con prefijos bloqueados:\n${mentions}`, null, {
        mentions: filteredUsers.map((user) => user.id),
      });
    } else {
      m.reply('> No hay usuarios con los prefijos bloqueados en este grupo.');
    }
  }

  // Comando "/kill": elimina a los usuarios con prefijos bloqueados
  if (m.text === '/kill' && isAdmin) {
    if (!isBotAdmin) {
      return m.reply('El bot necesita permisos de administrador para eliminar usuarios.');
    }

    const filteredUsers = participants.filter((user) =>
      prefixes.includes(user.id.slice(0, 3))
    );

    if (filteredUsers.length > 0) {
      try {
        for (const user of filteredUsers) {
          await conn.groupParticipantsUpdate(m.chat, [user.id], 'remove');
          console.log(`Usuario ${user.id} eliminado por el comando "/kill".`);
        }
        m.reply('> Se ha eliminado a todos los usuarios con prefijos bloqueados.');
      } catch (err) {
        console.error('> Error al eliminar usuarios:', err);
        m.reply('Hubo un error al intentar eliminar a los usuarios.');
      }
    } else {
      m.reply('> No hay usuarios con los prefijos bloqueados en este grupo.');
    }
  }
};

export default handler;
