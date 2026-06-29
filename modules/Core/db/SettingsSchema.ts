import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import z from 'zod';
import fs from 'fs'
import path from 'path';

import { coreDir } from '../paths.ts'

const SettingsScheme = z.object({
    gameFilter: z.object({
        legacy:    z.boolean().readonly(),
        TCP:       z.boolean().readonly(),
        UDP:       z.boolean().readonly()
    }),
    autoUpdate:          z.boolean(),
    autoLoad:            z.boolean(),
    status:              z.boolean(),
    selectedStrategy:    z.number().nullable(),
    notifications:       z.boolean(),
    GH_TOKEN:            z.string().nullable()
})
export type Settings = z.infer<typeof SettingsScheme>

let defaultSettings: Settings = {
    gameFilter: {
        legacy: false,
        TCP: false,
        UDP: false
    },
    autoLoad: true,
    autoUpdate: false,
    status: false,
    selectedStrategy: fs.statSync(path.resolve(coreDir, 'general (SIMPLE FAKE).bat')).ino,
    notifications: true,
    GH_TOKEN: null
}

export const settingsInternal = sqliteTable('settings', {
    id: integer('id').notNull().default(1),
    value: text('value', { mode: 'json' })
    .$type<z.infer<typeof SettingsScheme>>()
    .notNull()
    .default(defaultSettings)
})
