const toxicRegex = /\b(porno|cp|cafe con pan|café con pan|camiones pesados)\b/i;

export async function before(m, { isAdmin, isBotAdmin, isOwner }) {
  // Asegúrate de que el bot es administrador
  if (!isBotAdmin) {
    console.error('El bot necesita permisos de administrador para eliminar usuarios.');
    return !1;
  }

  // No actuar si el mensaje es del bot o no es un grupo
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;

  // Verifica si el mensaje contiene una palabra prohibida
  const isToxic = toxicRegex.exec(m.text);

  // Si se detecta una palabra prohibida y el remitente no es admin ni owner
  if (isToxic && !isOwner && !isAdmin) {
    try {
      // Notifica al grupo y elimina al usuario
      await m.reply(
        `> Usuario eliminado por anti-toxic`,
        false,
        { mentions: [m.sender] }
      );
      await m.conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove'); // Elimina al usuario
      user.banned = true; // Marca al usuario como baneado
    } catch (error) {
      console.error('Error al intentar eliminar al usuario:', error);
    }
  }
  return !1;
}
