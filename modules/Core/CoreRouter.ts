import { initTRPC } from '@trpc/server';
import { BrowserWindow } from 'electron';
import { createIPCHandler } from 'electron-trpc/main';

const t = initTRPC.create({ isServer: true });

export const coreRouter = t.router({
  greet: t.procedure.input(String).query(({ input }) => `Привет, ${input}!`),
})

export default function initCoreRouter(win: BrowserWindow): void {
    createIPCHandler({ router: coreRouter, windows: [win] });
}
