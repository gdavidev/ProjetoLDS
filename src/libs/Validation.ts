export default class Validation {
  public static isValidEmail(email: string): boolean {
    if (/[0-9a-z]{1,256}@[0-9a-z]{1,256}/i.test(email))
      return true
    return false;
  }

  public static isValidPassword(password: string): boolean {
    let pass = password.trim();
    if (pass === "" || pass.length < 8)
      return false;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%&*])[a-zA-Z0-9@#$%&*]{8,256}$/.test(pass);
  }
}