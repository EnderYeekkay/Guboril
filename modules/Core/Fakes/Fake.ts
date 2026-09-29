export interface IFake {
    shortName: string
    fullName: `${string}.bin`
}

export default class Fake {
    shortName: string
    fullName: `${string}.bin`

    public constructor (name: string) {
        if (name.endsWith('.bin')) throw new Error(`Fake ${name} can't ends with .bin!`)

        this.shortName = name
        this.fullName = `${name}.bin`
    }
}