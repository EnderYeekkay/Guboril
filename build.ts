import packager from 'electron-packager';
const options = {
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
        /roadmap\.md/
    ]
};

async function bundleApp() {
    try {
        //@ts-ignore
        const appPaths = await packager(options);
        console.log(`Successfully packaged app in: ${appPaths.join(', ')}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
bundleApp();
//electron-packager . Guboril --platform=win32 --arch=x64 --overwrite --out=dist --icon=public/icon.ico --win32metadata.requested-execution-level=requireAdministrator --asar --ignore=modules/MakeInstaller\\.iss --ignore=tests/"