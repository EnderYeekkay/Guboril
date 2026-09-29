import ansi, {type CSPair} from "ansi-styles"
const color = ansi.color
import util from 'node:util'
import hexToRGB, { type HEX } from './hexToRGB.ts'

export const COLORS = {
  blue: '#3b7be3' as `#${string}`,
  lightBlue: '#29a0e6' as `#${string}`,
  red: '#e33b3b' as `#${string}`,
  green: '#3be03b' as `#${string}`,
  lightGreen: '#42f578' as `#${string}`,

  modificator: '#F47067' as `#${string}`,
  object: '#F69D50' as `#${string}`,
  property: '#57B6FF' as `#${string}`,
  func: '#D0BDFB' as `#${string}`
}
export const ansiHex = (hex: HEX) => color.ansi16m(...hexToRGB(hex))
    
export const colorizeFirst = (value: string, hex: HEX) => {
  return color.ansi16m(...hexToRGB(hex)) + value[0] + color.close + value.slice(1)
}
export const colorize = (value: string, hex: HEX) => {
  return color.ansi16m(...hexToRGB(hex)) + value + color.close
}

// #region Font decorators
export const bold = (value: string) => {
  return ansi.bold.open + value + ansi.bold.close
}
export const dim = (value: string) => {
  return ansi.dim.open + value + ansi.dim.close
}
export const italic = (value: string) => {
  return ansi.italic.open + value + ansi.italic.close
}
export const hidden = (value: string) => {
  return ansi.hidden.open + value + ansi.hidden.close
}
export const strikethrough = (value: string) => {
  return ansi.strikethrough.open + value + ansi.strikethrough.close
}
// #endregion
export const reverseColors = (value: string, bgColor: CSPair) => {
  value = value.trim()
  return (
    ansi.black.open +
      ansi.bold.open +
        bgColor.open +
          ` ${value} ` +
        bgColor.close +
      ansi.bold.close +
    ansi.black.close
  )
}

export const greatSuccess = (value: string) => {
  return reverseColors(value, ansi.bgGreen)
}

export const writingSquare = (value: string) => {
  return colorizeFirst(`◪ ${value}`, COLORS.lightGreen)
}
export const writingRomb = (value: string) => {
  return colorizeFirst(`◆ ${value}`, COLORS.lightBlue)
}
export const action = (value: string) => {
  return colorizeFirst(`>  ${value}`, COLORS.blue)
}
export const success = (value: string) => {
  return colorizeFirst(`✔ ${value}`, COLORS.green)
}
export const error = (value: string) => {
  return colorizeFirst(`✕ ${value}`, COLORS.red)
}
export const data = (value: string) => {
  return colorizeFirst(`■ ${value}`, COLORS.lightBlue)
}
export const propertyOfObject = (object: string, property: string) => {
  return `${colorize(object, "#F69D50")}.${colorize(property, "#57B6FF")}`
}
interface MethodOfObjectOptions {
  params: {name: string, value: any}[]
  privacy: 'public' | 'protected' | 'private' | '#'
  isStatic: boolean
  isAsync: boolean
}
export const methodOfObject = (object: string, method: string, options: Partial<MethodOfObjectOptions> = {}) => {
  const { isAsync, privacy, isStatic, params } = options
  
  const prefixesList: string[] = [];
  
  if (privacy) prefixesList.push(privacy);
  if (isStatic) prefixesList.push('static');
  if (isAsync) prefixesList.push('async');

  const prefix = prefixesList.length > 0 ? colorize(prefixesList.join(' '), "#F47067") : '';
  const formattedParams = params ? params
    .map(p => `${colorize(p.name, "#F69D50")}: ${typeof p.value !== 'object' ? colorize(p.value, "#57B6FF") : util.inspect(p.value, { colors: true })}`)
    .join(', ')
    : ''
  const result = `${prefix ? prefix + ' ' : ''}` + 
  `${colorize(object, "#F69D50")}.${colorize(method, "#D0BDFB")}` +
  `(${formattedParams})`
  
  return result
}
console.log(methodOfObject('Decor', 'test', {
  isAsync: true,
  isStatic: false,
  privacy: "#",
  params: [{
    name: "length",
    value: 1
  }, {
    name: "data",
    value: {a: 'asddsa', b: 5}
  }, {
    name: "strange",
    value: false
  }]
}))