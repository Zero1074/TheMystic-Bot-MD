import { generateWAMessageFromContent } from "baileys";
import * as fs from 'fs';

const handler = async (m, { conn, text, participants }) => {
  try {
    // Obtener los JIDs (identificadores) de los participantes
    const users = participants.map((u) => conn.decodeJid(u.id));  

    // Crear el mensaje que se enviará con las menciones ocultas
    const htextos = `${text ? text : '*Hola :D*'}`;  // El mensaje que se enviará, si no se especifica, por defecto es "Hola :D".

    // Se genera un mensaje sin mencionar al usuario que ejecutó el comando
    const more = String.fromCharCode(8206);  // Caracter invisible para ocultar el texto
    const masss = more.repeat(850);  // Repetir el caracter invisible para evitar que se muestre un mensaje vacío

    // Si el mensaje es un sticker, se manejará de esta forma:
    if (m.quoted && m.quoted.mtype === 'stickerMessage') {
      const quoted = m.quoted;
      const mediax = await quoted.download?.();  // Descargar el sticker

      // Enviar el sticker con menciones ocultas
      await conn.sendMessage(m.chat, {
        sticker: mediax,
        mentions: users  // Mencionamos a todos los usuarios
      }, { quoted: null }); // No mencionamos al autor del comando
    } else {
      // Si no es un sticker, simplemente enviamos el mensaje de texto con menciones
      await conn.relayMessage(m.chat, {
        extendedTextMessage: {
          text: `${masss}\n${htextos}\n`, 
          contextInfo: {
            mentionedJid: users  // Se mencionan a todos los usuarios
          }
        }
      }, {});
    }
  } catch (err) {
    console.error(err);  // Captura cualquier error y lo muestra en consola
  }
};

handler.command = /^(hidetag|notificar|notify)$/i;  // Comandos aceptados: hidetag, notificar, notify.
handler.group = true;  // Solo en grupos.
handler.admin = true;  // Solo administradores.
export default handler;
