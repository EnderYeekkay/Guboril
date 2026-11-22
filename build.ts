import {packager, type Options} from '@electron/packager'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const rootCorePath = path.join(__dirname, 'core');
const rootCoreIgnore = new RegExp(`^${escapeRegExp(rootCorePath)}([\\\\/]|$)`);

const options: Options = {
    dir: '.',
    name: 'Guboril',
    platform: 'win32',
    arch: 'x64',
    overwrite: true,
    out: "dist",
    icon: "public/icon.ico",
    asar: true,
    win32metadata: {
        'requested-execution-level': 'requireAdministrator',
    },
    extraResource: [
        path.join(__dirname, 'core')
    ],
    ignore: [
        /modules\/MakeInstaller\.iss/, // Используйте массив regex напрямую
        /modules\/MakeInstallerRaw\.iss/,
        /tests\//,
        /scripts\/createComponent\.ts/,
        /scripts\/issTemplateParser\.ts/,
        /faq\.md/,
        /build\.ts/,
        /\.vscode/,
        /\.gitignore/,
        /readme\.md/,
        /roadmap\.md/,
        /icon\.bmp/,
        /mainwindowr\/src/,
        /public\/images/,
        rootCoreIgnore,
    ],
   afterCopy: [
        ({ buildPath }) => {
            const localesPath = path.join(buildPath, '../../locales');
            
            // Список языков, которые НУЖНО оставить (без расширения .pak)
            const keepLocales = ['ru', 'en-US'];

            if (fs.existsSync(localesPath)) {
                const files = fs.readdirSync(localesPath);
                files.forEach(file => {
                    const lang = file.replace('.pak', '');
                    if (!keepLocales.includes(lang)) {
                        try {
                            fs.unlinkSync(path.join(localesPath, file));
                        } catch (err) {
                            console.error(`Could not remove locale: ${file}`, err);
                        }
                    }
                });
            }
        }
    ]
} ;

async function bundleApp() {
    try {
        const appPaths = await packager(options);
        console.log(`Successfully   app in: ${appPaths.join(', ')}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
bundleApp();
//electron-packager . Guboril --platform=win32 --arch=x64 --overwrite --out=dist --icon=public/icon.ico --win32metadata.requested-execution-level=requireAdministrator --asar --ignore=modules/MakeInstaller\\.iss --ignore=tests/"
