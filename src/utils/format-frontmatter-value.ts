export default function formatFrontmatterValue (value: any) {
  switch (typeof value) {
    case 'string':
      return `'${value.replaceAll(/'/g, '')}'`
    default:
      return value
  }
}