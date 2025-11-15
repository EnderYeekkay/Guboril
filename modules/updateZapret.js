const { createExtractorFromData } = require('node-unrar-js')
const axios = require('axios');
const path = require('node:path')
const { app } = require('electron/main')
const fs = require('fs');

module.exports = async function updateZapret() {
    const repo = 'Flowseal/zapret-discord-youtube';
    const destDir = path.join(app.getPath('userData'), 'core');
    const rarPath = path.join(destDir, 'zapret.rar');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    if (process.platform === 'win32') {
    }

    console.log('🔍 Проверяю обновления zapret...');

    // 1. Получаем последнюю версию с GitHub
    const { data: latest } = await axios.get(`https://api.github.com/repos/${repo}/releases/latest`);
    const latestTag = latest.tag_name || latest.name;
    const latestUrl = latest.assets.find(a => a.name.endsWith('.rar'))?.browser_download_url;

    if (!latestUrl) throw new Error('RAR-файл не найден в релизах.');

    // 2. Проверяем, есть ли уже такая версия локально
    const versionFile = path.join(destDir, 'version.txt');
    const currentVersion = fs.existsSync(versionFile)
        ? fs.readFileSync(versionFile, 'utf8').trim()
        : null;

    if (currentVersion === latestTag) {
        console.log('✅ У вас уже последняя версия zapret:', currentVersion);
        return 1;
    }

    console.log('⬇️ Скачиваю новую версию zapret:', latestTag);

    // 3. Скачиваем RAR в память
    const response = await axios.get(latestUrl, { responseType: 'arraybuffer' });
    const rarData = new Uint8Array(response.data);
    fs.writeFileSync(rarPath, rarData);

    // 4. Распаковываем в core
    console.log('📦 Распаковываю...');
    const extractor = await createExtractorFromData({ data: rarData });
    const extracted = extractor.extract();

    for (const file of extracted.files) {
        if (file.extraction) {
            const filePath = path.join(destDir, file.fileHeader.name);
            const folder = path.dirname(filePath);
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
            fs.writeFileSync(filePath, file.extraction);
        }
    }

    // 5. Обновляем версию
    fs.writeFileSync(versionFile, latestTag);
    fs.unlinkSync(rarPath);
    console.log('✅ zapret обновлён до', latestTag);
}
