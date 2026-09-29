import fs from 'fs'
import path, { resolve as pr } from 'path'
import util from 'node:util'

import Core from '../Core.ts'
import { binPath } from "../paths.ts";
import Fake from "./Fake.ts";
import { GuborilStore } from '../../tasks/store.ts';
import InitFakeHandlers from './FakeHandlers.ts';
import { action, bold, colorize, COLORS, data, propertyOfObject, success, writingRomb } from '../../decor/decorator.ts';
const l = console.log
// Full Names of an active Fakes files
const ACTIVE_DISCORD_UDP = 'ACTIVE_DISCORD_UDP.bin'
const ACTIVE_GAME_UDP = 'ACTIVE_GAME_UDP.bin'

// Short Names of an default Fakes files
const defaltFakeDiscordUDPName = 'quic_initial_steamcommunity_com'
const defaultFakeGameFilterUDPName = 'quic_initial_4pda_to'

export default class FakeManager {
    private constructor() {}

    private static _fakes: Fake[]
    public static fakeDiscordUDP: Fake = null!
    public static fakeGameFilterUDP: Fake = null!

    // UNCOMPLETED
    public static init() {
        // Array like ['stun', 'stun2'] from filtered filenames like 'stun.bin', 'stun2.bin'
        const fakeNames = fs.readdirSync(binPath)
            .filter(el => el !== ACTIVE_DISCORD_UDP)
            .filter(el => el !== ACTIVE_GAME_UDP)
        .filter(el => el.endsWith('.bin'))
        .map(el => el.slice(0, -4))
        
        // Setup fakes array
        this._fakes = []
        fakeNames.forEach(fakeName => this._fakes.push(new Fake(fakeName)))

        // Setup fakeDiscordUDP
        const rawFakeDiscordUDP = GuborilStore.get('fakeDiscordUDP')
        if (rawFakeDiscordUDP) {
            this.fakeDiscordUDP = new Fake(rawFakeDiscordUDP.shortName)
        } else {
            this.fakeDiscordUDP = this.restoreFakeDiscordUDP()
        }

        // Setup fakeGameFilterUDP
        const rawFakeGameFilterUDP = GuborilStore.get('fakeGameFilterUDP')
        if (rawFakeGameFilterUDP) {
            this.fakeGameFilterUDP = new Fake(rawFakeGameFilterUDP.shortName)
        } else {
            this.fakeGameFilterUDP = this.restoreFakeGameFilterUDP()
        }
        
    }

    public static All(): readonly Fake[] {
        return this._fakes
    }
    public static withName(fakeName: string): Fake | undefined {
        return this._fakes.find(fake => fake.shortName === fakeName)
    }

    //
    // fakeDiscordUDP
    //
    public static restoreFakeDiscordUDP(): Fake {
        console.log(action(`Restoring ${propertyOfObject('FakeManager', 'FakeDiscordUDP')} to ${bold(defaltFakeDiscordUDPName)}`))
        const fake = FakeManager.withName(defaltFakeDiscordUDPName)
        if (!fake) throw new Error('Default FakeDiscordUDP not found! Try to reinstall the app.')

        fs.copyFileSync(pr(binPath, fake.fullName), pr(binPath, ACTIVE_DISCORD_UDP))
        this.fakeDiscordUDP = fake
        GuborilStore.set('fakeDiscordUDP', fake)
        console.log(success(`Success! Stored data: ${util.inspect(GuborilStore.get('fakeDiscordUDP'), { colors: true })}`))
        Core.restart()
        return fake
    }
    public static changeFakeDiscordUDP(fakeName: string): void {
        // Taking existing Fake
        console.log(action(`Changing ${propertyOfObject('FakeManager', 'FakeDiscordUDP')} to ${bold(fakeName)}`))
        const fake = this._fakes.find(fake => fake.shortName === fakeName)
        if (!fake) throw new Error(`No fake in cache with name ${fakeName}`)
    
        // Copying Fake with replacing last Fake file
        fs.copyFileSync(pr(binPath, fake.fullName), pr(binPath, ACTIVE_DISCORD_UDP))
        this.fakeDiscordUDP = fake
        GuborilStore.set('fakeDiscordUDP', fake)
        Core.restart()
        console.log(success(`Success! Stored data: ${util.inspect(GuborilStore.get('fakeDiscordUDP'), { colors: true })}`))
    }
    public static getFakeDiscordUDP(): Fake {
        return this.fakeDiscordUDP
    }

    // 
    // fakeGameFilterUDP 
    //
    public static restoreFakeGameFilterUDP(): Fake {
        console.log(action(`Restoring ${propertyOfObject('FakeManager', 'FakeGameFilterUDP')} to ${bold(defaultFakeGameFilterUDPName)}`))
        const fake = FakeManager.withName(defaultFakeGameFilterUDPName)
        if (!fake) throw new Error('Default FakeGameFilterUDP not found! Try to reinstall the app.')

        fs.copyFileSync(pr(binPath, fake.fullName), pr(binPath, ACTIVE_GAME_UDP))
        this.fakeGameFilterUDP = fake
        GuborilStore.set('fakeGameFilterUDP', fake)
        Core.restart()
        console.log(success(`Success! Stored data: ${util.inspect(GuborilStore.get('fakeGameFilterUDP'), { colors: true })}`))
        return fake
    }
    public static changeFakeGameFilterUDP(fakeName: string): void {
        console.log(action(`Changing ${propertyOfObject('FakeManager', 'FakeGameFilterUDP')} to ${bold(fakeName)}`))
        // Taking existing Fake
        const fake = this._fakes.find(fake => fake.shortName === fakeName)
        if (!fake) throw new Error(`No fake in cache with name ${fakeName}`)
    
        // Copying Fake with replacing last Fake file
        fs.copyFileSync(pr(binPath, fake.fullName), pr(binPath, ACTIVE_GAME_UDP))
        this.fakeGameFilterUDP = fake
        GuborilStore.set('fakeGameFilterUDP', fake)
        Core.restart()
        console.log(success(`Success! Stored data: ${util.inspect(GuborilStore.get('fakeGameFilterUDP'), { colors: true })}`))
    }
    public static getFakeGameFilterUDP(): Fake {
        return this.fakeGameFilterUDP
    }
}
l(action('Initializing FakeManager...'))
FakeManager.init()
InitFakeHandlers()
l(success(`FakeManager initialized with ${FakeManager.All().length} fakes.`))
l(data(`FakeDiscordUDP: ${FakeManager.getFakeDiscordUDP().shortName}`))
l(data(`FakeGameFilterUDP: ${FakeManager.getFakeGameFilterUDP().shortName}`))
l(data('All filters:'))
l(FakeManager.All().map(fake => '\t' + writingRomb(fake.shortName)).join('\n'))
l()
