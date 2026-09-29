export type domainString = `${string}.${string}` & { __brand: 'LGBT sosat'}
const urls = [
        "cloudflare-ech.com",
        "cloudflare.com",
        'cloudflare.net',
        'youtube.com',
        'discord.com',
        'facebook.com',
        'discordcdn.com',
        'discord.media',
        'discordactivities.com',
        'discord.app',
        'discord-attachments-uploads-prd.storage.googleapis.com',
        'discord.store',
        'discordmerch.com',
        'discord.com',
        'stable.dl2.discordapp.net',
        'discord.new',
        'discord.gift',
        "discord.gift",
        "discord.gg",
        "discord.co",
        "discordapp.com",
        "discordsays.com",
        "dis.gd",
        "discord.gifts",
        "discordsez.com",
        "yt4.ggpht.com",
        "i.ytimg.com",
        "yt3.ggpht.com",
        "i9.ytimg.com",
        "jnn-pa.googleapis.com",
        "googleusercontent.com",
        "googleapis.com",
        "yt3.googleusercontent.com",
        "manifest.googlevideo.com",
        "youtubei.googleapis.com",
        "signaler-pa.youtube.com",
        "youtu.be",
        "youtube.com",
        "googleapis.com",
        "yt3.googleusercontent.com",
        "manifest.googlevideo.com",
        "youtubei.googleapis.com",
        "signaler-pa.youtube.com",
        "youtu.be",
        "discord.dev",
        "discord.design",
] as any as domainString[]
export default urls

interface List {
    listName: string
    urls: domainString[]
}
export class URLsToCheck {
    private constructor() {}
    public static get all(): domainString[] {
        const lists = ([] as domainString[]).concat(...this.lists.map(list => list.urls))
        return [...new Set(lists)]
    }
    public static lists: List[] = [ { 
            listName: "Стандартный",
            urls: [
                'youtube.com',
                'discord.com',
                'facebook.com',
            ] as any as domainString[]
        }, { 
            listName: "Discord",
            urls: [
                'discord.media',
                'discordactivities.com',
                'discord.app',
                'discord-attachments-uploads-prd.storage.googleapis.com',
                'discord.store',
                'discordmerch.com',
                'discord.com',
                'stable.dl2.discordapp.net',
                'discord.new',
                'discord.gift',
                "discord.gift",
                "discord.gg",
                "discord.co",
                'discordcdn.com',
                "discordapp.com",
                "discordsays.com",
                "dis.gd",
                "discord.gifts",
                "discordsez.com",
                "discord.dev",
                "discord.design",
            ] as any as domainString[]
        }, { 
            listName: "Cloudflare",
            urls: [
                "cloudflare-ech.com",
                "cloudflare.com",
                'cloudflare.net',
            ] as any as domainString[]
        }, { 
            listName: "Google",
            urls: [
                "yt4.ggpht.com",
                "i.ytimg.com",
                "yt3.ggpht.com",
                "i9.ytimg.com",
                "jnn-pa.googleapis.com",
                "googleusercontent.com",
                "googleapis.com",
                "yt3.googleusercontent.com",
                "manifest.googlevideo.com",
                "youtubei.googleapis.com",
                "signaler-pa.youtube.com",
                "youtu.be",
            ] as any as domainString[]
        }
    ]
}