// Этот файл нужен для того, чтобы TypeScript понимал, что модули CSS это объекты
declare module '*.module.css' {
    const content: Record<string, string>;
    export default content;
}