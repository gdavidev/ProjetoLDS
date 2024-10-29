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

  toUrlSafe(): string {
    this.value = this.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    this.value = this.value.replace(" ", "_");
    return this.value;
  }
}