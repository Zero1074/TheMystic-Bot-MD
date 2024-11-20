import _0x36ae01 from 'axios';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import("baileys"))["default"];

let handler = async (_0x10bd40, {
  conn: _0x9c7141,
  text: _0x27db11,
  usedPrefix: _0x55e61b,
  command: _0x5ad406
}) => {
  if (!_0x27db11) {
    return _0x9c7141.reply(_0x10bd40.chat, "> Escriba lo que desea buscar", _0x10bd40);
  }

  // Detecta el idioma del usuario
  const idioma = global.db.data.users[_0x10bd40.sender].language || 'es'; // Por defecto español si no se detecta idioma

  // Traduce la búsqueda según el idioma
  const query = encodeURIComponent(_0x27db11);
  const baseUrl = `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`;

  // Realiza la búsqueda de imágenes en Pinterest
  let { data: _0x4fc489 } = await _0x36ae01.get(baseUrl);

  // Filtra las URLs de las imágenes solo si tienen la propiedad 'orig' y 'url'
  let _0x5f34cb = _0x4fc489.resource_response.data.results
    .map(_0x33ba1c => _0x33ba1c.images?.orig?.url)  // Usa '?.' para evitar errores si 'orig' no existe
    .filter(url => url !== undefined);  // Filtra los valores undefined

  // Si no se encuentran imágenes, muestra un mensaje de error
  if (!_0x5f34cb.length) {
    return _0x9c7141.reply(_0x10bd40.chat, "[❗] *No se encontraron resultados para la búsqueda.*", _0x10bd40);
  }

  // Selecciona una imagen aleatoria de los resultados
  const _0x47c48a = _0x5f34cb[Math.floor(Math.random() * _0x5f34cb.length)];

  // Genera el mensaje con la imagen y el texto correspondiente
  const message = await _0x9c7141.sendMessage(_0x10bd40.chat, {
    image: { url: _0x47c48a },
    caption: `> Resultado (${idioma})`
  });

};

handler.help = ["image <query>"];
handler.tags = ["downloader"];
handler.command = /^(image)$/i;

export default handler;
