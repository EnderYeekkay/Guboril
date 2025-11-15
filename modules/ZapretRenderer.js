// const { spawn, ChildProcess } = require('child_process');
// const fs = require('fs');
// const path = require('path');
// const { EventEmitter } = require('stream');
// const events = require('events');
// const l = console.log;
// const $ = require('jquery')
// require('jquery-ui-dist')
// module.exports = class Zapret extends EventEmitter {

//     /**
//      * @type {ChildProcess}
//      */
//     child;

//     isBusy = false;

//     /**
//      * Вывод **stdout**
//      * @type {string}
//      */
//     output = '';

//     constructor() {
//         super();

//         // Жёсткий путь к core
//         const destDir = path.join(process.env.APPDATA, 'Electron', 'core');
//         const originalBat = path.join(destDir, 'service.bat');
//         const patchedBat = path.join(destDir, 'service_patched.bat');

//         // читаем оригинал
//         let code = fs.readFileSync(originalBat, 'utf8');

//         // ########### ПАТЧ .bat ###########
//         code = code.replace(/^\s*start\s+(.*)$/gmi, 'call $1');

//         const menuBlockRegex = new RegExp(
//             [
//                 '^echo =========\\s+v!LOCAL_VERSION!\\s+=========$',
//                 '^echo 1\\. Install Service$',
//                 '^echo 2\\. Remove Services$',
//                 '^echo 3\\. Check Status$',
//                 '^echo 4\\. Run Diagnostics$',
//                 '^echo 5\\. Check Updates$',
//                 '^echo 6\\. Switch Game Filter.*$',
//                 '^echo 7\\. Switch ipset.*$',
//                 '^echo 8\\. Update ipset list$',
//                 '^echo 0\\. Exit$'
//             ].join('\\r?\\n'),
//             'mi'
//         );
//         code = code.replace(menuBlockRegex, '');

//         const adminBlockRegex = /if\s+"%1"=="admin"\s*\([\s\S]*?\)\s*else\s*\([\s\S]*?\)/i;
//         code = code.replace(adminBlockRegex, '');

//         fs.writeFileSync(patchedBat, code);

//         // Child process
//         this.child = spawn('cmd.exe', ['/c', patchedBat], {
//             windowsHide: true,
//             stdio: ['pipe', 'pipe', 'pipe']
//         });

//         this.child.stdout.on('data', chunk => this._onData(chunk));
//         this.child.stderr.on('data', chunk => this._onData(chunk));
//     }

//     _onData(chunk) {
//         chunk = chunk.toString();
//         if (chunk.includes('Press any key') || chunk.includes('Enter choice')) {
//             this.child.stdin.write('\r');
//         }
//         this.output += chunk;
//         this.emit('out', this.output);
//     }

//     static async initialize() {
//         return new this();
//     }

//     write(value) {
//         this.output = '';
//         this.isBusy = true;
//         this.child.stdin.write(`${value.toString()}\n`);
//     }

//     async checkStatus() {
//         l('\x1b[1;35mcheckStatus()\x1b[0m');
//         if (this.isBusy) throw new ZapretError('Queue error');
//         this.write(3);
//         const handler = (output) => {
//             if (output.includes('ACTIVE')) this.emit('complete', true, (output.match(/Service strategy installed from ".*\(([^)]+)\)"/) || [])[1] || null);
//             if (output.includes('NOT FOUND')) this.emit('complete', false, (output.match(/Service strategy installed from ".*\(([^)]+)\)"/) || [])[1] || null);
//         };
//         this.on('out', handler);
//         const res = await events.once(this, 'complete');
//         this.off('out', handler);
//         this.isBusy = false;
//         return res;
//     }

//     async install() {}

//     async remove() {
//         if (this.isBusy) throw new ZapretError('Queue error');
//         this.write(2);
//         const handler = (output) => {
//             if (output.includes('Press any')) this.emit('complete', true);
//         };
//         this.on('out', handler);
//         const res = await events.once(this, 'complete');
//         this.off('out', handler);
//         this.isBusy = false;
//     }

//     async getAllStrategies() {
//         l('\x1b[1;35mgetAllStrategies()\x1b[0m');
//         if (this.isBusy) throw new ZapretError('Queue error');
//         this.write(1);
//         const handler = (output) => {
//             if (output.includes('general.bat')) {
//                 const matches = [...output.matchAll(/(general(?: \([^)]+\))?\.bat)/gi)];
//                 const strategies = matches.map(m => m[1].trim());
//                 this.write(1000000);
//                 this.child.stdin.write('\r');
//                 this.emit('complete', strategies);
//             }
//         };
//         this.on('out', handler);
//         const res = await events.once(this, 'complete');
//         this.off('out', handler);
//         this.isBusy = false;
//         return res[0];
//     }
// }

// class ZapretError extends Error {
//     constructor(message) {
//         super(message);
//         this.name = this.constructor.name;
//         if (Error.captureStackTrace) {
//             Error.captureStackTrace(this, this.constructor);
//         }
//     }
// }
