export default class StringFormatter {
  static replaceAll(value: string, from: string, to: string): string {
    while (value.indexOf(from) > -1)
      value = value.replace(from, to)
    return value
  }

  static padLeft(value: string, amount: number, char?: string): string {
    char = char || ' ';

    for (let i = 0; i < amount - 1; i++)
      value = char + value
    return value
  }

  static toUrlSafe(value: string): string {
    value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    value = value.replace(" ", "_");
    return value;
  }
}