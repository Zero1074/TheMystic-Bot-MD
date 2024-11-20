import { WAMessageStubType } from "baileys";
import fetch from "node-fetch";

// Configuración del idioma (opcional)
export async function handler(m, { conn, participants, command }) {
  // Solo ejecuta el código si el comando es `.close` o `.open`
  if (!["close", "open"].includes(command)) return;

  // Imagen oficial de WhatsApp para el estado
  const whatsappStatusPic =
    "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

  // Determinar el estado del grupo según el comando
  let accion;

  if (command === "close") {
    // Configurar grupo como cerrado
    await conn.groupSettingUpdate(m.chat, "announcement");
    accion = "> 亗『🔒』Grupo Cerrado『🔒』亗";
  } else if (command === "open") {
    // Configurar grupo como abierto
    await conn.groupSettingUpdate(m.chat, "not_announcement");
    accion = "> 亗『🔓』Grupo Abierto『🔓』亗";
  }

  // Formato del mensaje citado
  const fkontak2 = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo",
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${
          m.sender.split("@")[0]
        }:${m.sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
    participant: "0@s.whatsapp.net",
  };

  // Enviar el mensaje con la miniatura
  await conn.sendMessage(
    m.chat,
    {
      text: accion,
      jpegThumbnail: await (await fetch(whatsappStatusPic)).buffer(),
    },
    { quoted: fkontak2 }
  );
}

handler.help = [".close", ".open"];
handler.tags = ["group"];
handler.command = /^(close|open)$/i; // Detectar los comandos .close y .open
handler.admin = true; // Solo los administradores pueden usar el comando
handler.botAdmin = true; // El bot necesita ser administrador para cambiar configuraciones
export default handler;
