import { ipcMain } from 'electron'
import util from 'node:util'

import type ConnectionChecker from './ConnectionCheker/ConnectionChecker.ts'
import type Core from './Core.ts'
import { action, colorize, COLORS, methodOfObject, propertyOfObject, success } from '../decor/decorator.ts'
// type CleanedClass<T extends object> = Exclude<keyof T, 'name' | 'length' | 'prototype'>

export type ClassMethods<T extends object> = Omit<{
  	[K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K]
}, 'init' | 'name' | 'length' | 'prototype'>

export type ReturnTypeOfMethod<T extends object, M extends keyof T> = 
	T[M] extends (...args: any) => any 
		? ReturnType<T[M]>
		: never

export type ParamsTypesOfMethod<T extends object, M extends keyof T> = 
	T[M] extends (...args: any) => any 
		? Parameters<T[M]>
		: never

const systemKeys = ['length', 'name', 'prototype', 'arguments', 'caller'];

/**
 * **VERY UNSAFE TO USE**, *but so chill*... 
 * 
 * Registrate handlers from all members of given **Class**.
 * @param singletone Singletone class like {@link Core} or {@link ConnectionChecker}
 * @param ignore Members of singletone to be ignored
 */
export function RegisterHandlersFor<T extends object & { name: string }>(singletone: T, options: {
	ignoreKeys?: (keyof T)[]
	asyncKeys?: (keyof T)[]
} = {}) {
	const { ignoreKeys, asyncKeys } = options
	const name = singletone.name
	const members = singletone as Record<string, unknown>
	const keys = Object.getOwnPropertyNames(members)
	console.log(action(`Registering handlers for ${name}...`))
	for (let key of keys) {
		
		// Removing private fields.
		if (key.startsWith('_')) continue
    	if (systemKeys.includes(key)) continue;
		if (ignoreKeys && ignoreKeys.includes(key as keyof T)) continue

		const value = members[key]
		ipcMain.removeHandler(`${name}:${key}`)
		ipcMain.removeAllListeners(`${name}:${key}`)
		// Async
		if (asyncKeys && asyncKeys.includes(key as keyof T)) {
			switch (typeof value) {
				case "function":
					// Registering callback with Singletone context
					ipcMain.handle(`${name}:${key}`, (_event, ...args: any[]) => value.call(singletone, ...args))
					console.log(action(`Registering handler for ${methodOfObject(name, key, { isAsync: true })}`))
					break
				case "object": 
					// I don't know why I've written it.
					if (value === null) { ipcMain.handle(`${name}:${key}`, () => null); continue }
					ipcMain.handle(`${name}:${key}`, () => structuredClone(value))
					console.log(action(`Registering handler for ${propertyOfObject(name, key)} = ${util.inspect(value, { colors: true })}`))
					break
				default:
					ipcMain.handle(`${name}:${key}`, () => value)
					console.log(action(`Registering handler for ${propertyOfObject(name, key)}`))
					break
			}
		// Normal (sync)
		} else {
			
			switch (typeof value) {
				case "function":
					ipcMain.on(`${name}:${key}`, (event, ...args: any[]) => {
						const result = value.call(singletone, ...args)
						
						// Защита: проверяем, не вернул ли синхронный хэндлер промис
						if (result instanceof Promise) {
							console.error(colorize(`[ERROR] Sync handler '${name}:${key}' returned a Promise! This will break sendSync on frontend.`, COLORS.red))
						}
						
						event.returnValue = result
					})
					console.log(action(`Registering sync listener for ${methodOfObject(name, key, { isAsync: false })}`))
					break
					
				case "object":
					if (value === null) {
						ipcMain.on(`${name}:${key}`, (event) => { event.returnValue = null })
						console.log(action(`Registering sync listener for ${propertyOfObject(name, key)} = null`))
						continue
					}
					ipcMain.on(`${name}:${key}`, (event) => {
						event.returnValue = structuredClone(value)
					})
					console.log(action(`Registering sync listener for ${propertyOfObject(name, key)} = ${util.inspect(value, { colors: true })}`))
					break
					
				default:
					ipcMain.on(`${name}:${key}`, (event) => { event.returnValue = value })
					console.log(action(`Registering sync listener for ${propertyOfObject(name, key)}`))
					break
			}
		}
	}
	console.log(success(`Registered all handlers for ${colorize(name, COLORS.object)}!`) + '\n')
}
