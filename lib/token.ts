
import { randomBytes } from "crypto";

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

export function generateNumericToken(length: number = 6): string {
  const digits = "0123456789";
  let token = "";
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    token += digits[randomIndex];
  }
  
  return token;
}