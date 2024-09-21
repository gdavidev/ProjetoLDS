export default class StringFormatter {
  value: string;
  
  constructor(value?: string) {
    this.value = value || ''
  }

  replaceAll(from: string, to: string): string {
    while (this.value.indexOf(from) > -1)
      this.value = this.value.replace(from, to)
    return this.value
  }

  tabLeft(amount: number) {
    for (let i = 0; i < amount - 1; i++)
      this.value = ' ' + this.value
    return this.value
  }

  toString(): string {
    return this.value
  }
}