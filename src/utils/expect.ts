export function expectNever(value: never): never {
  throw new Error(`Unexpected value "${value}"!`);
}
