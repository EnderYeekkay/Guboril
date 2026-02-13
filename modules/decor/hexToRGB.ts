export type HEX = `#${string}`;

/**
 * Преобразует HEX-строку вида #RGB или #RRGGBB в массив [R, G, B]
 */
export default function hexToRgb(hex: HEX): [number, number, number] {
    // Отсекаем символ #
    let c = hex.slice(1);

    // Если формат #ABC, превращаем в #AABBCC
    if (c.length === 3) {
        c = c.split('').map(char => char + char).join('');
    }

    const num = parseInt(c, 16);

    return [
        (num >> 16) & 255, // Red
        (num >> 8) & 255,  // Green
        num & 255          // Blue
    ];
}
