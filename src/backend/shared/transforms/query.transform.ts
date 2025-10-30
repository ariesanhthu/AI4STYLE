import { Transform } from 'class-transformer';

// All these transforms are used for transforming query parameters on GET requests

export type StringTransformOptions = {
  message?: string;
};

export function StringToBooleanTransform({ message }: StringTransformOptions = {}) {
  return Transform(({ value }) => {
    if (value === '') { return undefined; }
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new Error(message || 'Invalid boolean');
  })
}

export function StringToNumberTransform({ message }: StringTransformOptions = {}) {
  return Transform(({ value }) => {
    if (value === '') { return undefined; }
    const val = Number(value);
    if (isNaN(val)) {
      throw new Error(message || 'Invalid number');
    }
    return val;
  });
}

export function StringToDateTransform({ message }: StringTransformOptions = {}) {
  return Transform(({ value }) => {
    if (value === '') { return undefined; }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(message || 'Invalid date');
    }
    return date;
  });
}

export function CommaSeparatedStringToArrayTransform() {
  return Transform(({ value }) => {
    if (value === '') { return undefined; }
    return (value as string).split(',').map(item => item.trim());
  });
}

export function CommaSeparatedStringToNumberArrayTransform({ message }: StringTransformOptions = {}) {
  return Transform(({ value }) => {
    if (value === '') { return undefined; }
    const arr = (value as string).split(',').map(item => {
      const num = Number(item.trim());
      if (isNaN(num)) {
        throw new Error(message || 'Invalid number in array');
      }
      return num;
    });
    return arr;
  });
}

