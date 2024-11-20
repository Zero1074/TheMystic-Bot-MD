import axios from 'axios';
import cheerio from 'cheerio';
import {generateWAMessageFromContent} from "baileys";
import {tiktokdl} from '@bochilteam/scraper';

let tiktok;
import('@xct007/frieren-scraper')
  .then((module) => {
    tiktok = module.tiktok;
  })
  .catch((error) => {
    console.error('No se pudo importar "@xct007/frieren-scraper".');
  });

const handler = async (m, {conn, text, args, usedPrefix, command}) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.descargas_tiktok;

  // Si no se especifica un enlace
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: '❓', key: m.key } });
    return;
  }

  // Si el enlace no es válido
  if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) {
    await conn.react(m.chat, '❓', m.key);
    return;
  }

  // Si el enlace es válido, enviar el video
  try {
    await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });

    const dataFn = await conn.getFile(`${global.MyApiRestBaseUrl}/api/tiktokv2?url=${args[0]}&apikey=${global.MyApiRestApikey}`);
    await conn.sendMessage(m.chat, {video: dataFn.data}, {quoted: m});
  } catch (e1) {
    try {
      const dataF = await tiktok.v1(args[0]);
      await conn.sendMessage(m.chat, {video: {url: dataF.play}}, {quoted: m});
    } catch (e1) {
      try {
        const tTiktok = await tiktokdlF(args[0]);
        await conn.sendMessage(m.chat, {video: {url: tTiktok.video}}, {quoted: m});
      } catch (e2) {
        try {
          const {author: {nickname}, video, description} = await tiktokdl(args[0]);
          const url = video.no_watermark2 || video.no_watermark || 'https://tikcdn.net' + video.no_watermark_raw || video.no_watermark_hd;
          await conn.sendMessage(m.chat, {video: {url: url}}, {quoted: m});
        } catch {
          throw `${tradutor.texto9}`;
        }
      }
    }
  }
};

handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm|tt|ttnowm|tiktokaudio)$/i;
export default handler;

async function tiktokdlF(url) {
  if (!/tiktok/.test(url)) return `${tradutor.texto10} _${usedPrefix + command} https://vm.tiktok.com/ZM686Q4ER/_`;
  const gettoken = await axios.get('https://tikdown.org/id');
  const $ = cheerio.load(gettoken.data);
  const token = $('#download-form > input[type=hidden]:nth-child(2)').attr('value');
  const param = {url: url, _token: token};
  const {data} = await axios.request('https://tikdown.org/getAjax?', {method: 'post', data: new URLSearchParams(Object.entries(param)), headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'}});
  const getdata = cheerio.load(data.html);
  if (data.status) {
    return {status: true, thumbnail: getdata('img').attr('src'), video: getdata('div.download-links > div:nth-child(1) > a').attr('href'), audio: getdata('div.download-links > div:nth-child(2) > a').attr('href')};
  } else {
    return {status: false};
  }
}
