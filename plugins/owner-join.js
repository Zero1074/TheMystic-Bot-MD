const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
let enviando = false;

const handler = async (m, { conn, text, isMods, isOwner, isPrems }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.owner_join;

  if (enviando) return;
  enviando = true;

  try {
    const link = text;
    if (!link || !link.match(linkRegex)) throw tradutor.texto1; // "Enlace inválido"

    const [_, code] = link.match(linkRegex) || [];

    try {
      // Intentar unirse al grupo
      await conn.groupAcceptInvite(code);
      await conn.sendMessage(m.chat, { text: tradutor.texto2 }, { quoted: m }); // "Me he unido al grupo."
    } catch (e) {
      // Manejar error al unirse al grupo
      if (e.message.includes('not an admin')) {
        await conn.sendMessage(m.chat, { text: tradutor.texto3 }, { quoted: m }); // "No tengo permisos para unirme."
        return;
      }
      if (e.message.includes('you are removed')) {
        await conn.sendMessage(m.chat, {
          text: "No puedo unirme porque alguien me eliminó, dile a un administrador que me una."
        }, { quoted: m });
        return;
      }
      // Otros errores
      throw e;
    }

  } catch (err) {
    await conn.sendMessage(m.chat, { text: tradutor.texto5 || "Ha ocurrido un error." }, { quoted: m }); // "Error inesperado."
  } finally {
    enviando = false;
  }
};

handler.help = ['join [chat.whatsapp.com]'];
handler.tags = ['premium'];
handler.command = /^join|nuevogrupo$/i;
handler.private = true;

export default handler;
