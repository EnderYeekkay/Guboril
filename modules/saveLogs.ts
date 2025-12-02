import { BrowserWindow, dialog, app } from 'electron'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

export async function saveLogsArchive(win: BrowserWindow): Promise<string | null> {
  // Определяем logsDir тут — внутри модуля
  const logsDir = path.join(app.getPath('userData'), 'logs')

  // Диалог сохранения
  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    title: 'Сохранить логи',
    defaultPath: 'logs.zip',
    filters: [
      { name: 'ZIP Archive', extensions: ['zip'] }
    ]
  })

  if (canceled || !filePath) return null

  // Создаём стрим для записи ZIP
  const output = fs.createWriteStream(filePath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(filePath))
    archive.on('error', err => reject(err))

    archive.pipe(output)

    // Добавляем всю папку logs рекурсивно
    archive.directory(logsDir, false)

    archive.finalize()
  })
}