export function assertObject(value: unknown, name: string = 'value'): asserts value is object {
  if (typeof value !== 'object')
    throw new Error(`Expected ${name} to be an object!`);
}

export function assertStringField<T extends string>(
  value: object,
  field: T,
  name: string = 'value'
): asserts value is { [K in T]: string } {
  assertField(value, field, name);
  assertString(value[field], `${name}.${field}`);
}

export function assertField<T extends string>(
  value: object,
  field: T,
  name: string = 'value'
): asserts value is { [K in T]: unknown } {
  if (!(field in value))
    throw new Error(`Expected ${name}.${field} to be defined!`);
}

function assertString(value: unknown, name: string): asserts value is string {
  if (typeof value !== 'string')
    throw new Error(`Expected ${name} to be a string!`);
}

export function assertNumber(value: unknown, name: string = 'value'): asserts value is number {
  if (typeof value !== 'number')
    throw new Error(`Expected ${name} to be a number!`);
}

export function assertUnion<T extends string>(value: unknown, values: readonly T[], name: string = 'value'): asserts value is T {
  if (!values.includes(value as T))
    throw new Error(`Expected ${name} to be of a union type (${values.map(item => `"${item}"`).join(' | ')})`);
}
