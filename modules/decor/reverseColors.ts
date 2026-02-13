import ansi, {type CSPair} from "ansi-styles"

export default function reverseColors(value: string, bgColor: CSPair) {
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