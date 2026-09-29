import Store from 'electron-store';
import type { IFake } from '../Core/Fakes/Fake.ts';

interface IStore {
    fakeDiscordUDP: IFake,
    fakeGameFilterUDP: IFake
}

export const GuborilStore = new Store<IStore>()
