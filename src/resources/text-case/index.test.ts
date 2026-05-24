import { describe, expect, it } from 'vitest';
import { TextCase } from './index';

describe('TextCase - invertText', () => {
  it('inverts a basic string', () => {
    expect(TextCase.invertText('hello')).toBe('olleh');
  });

  it('inverts a string with spaces', () => {
    expect(TextCase.invertText('hello world')).toBe('dlrow olleh');
  });

  it('returns the same single-character string', () => {
    expect(TextCase.invertText('a')).toBe('a');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.invertText('')).toBe('');
  });
});

describe('TextCase - removeAccents', () => {
  it('removes accents from accented characters', () => {
    expect(TextCase.removeAccents('café')).toBe('cafe');
  });

  it('removes accents from multiple words', () => {
    expect(TextCase.removeAccents('ação')).toBe('acao');
  });

  it('handles strings with multiple different accents', () => {
    expect(TextCase.removeAccents('héllo wörld')).toBe('hello world');
  });

  it('returns the same string when there are no accents', () => {
    expect(TextCase.removeAccents('hello')).toBe('hello');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.removeAccents('')).toBe('');
  });
});

describe('TextCase - uppercase', () => {
  it('converts a lowercase string to uppercase', () => {
    expect(TextCase.uppercase('hello world')).toBe('HELLO WORLD');
  });

  it('returns the same string when already uppercase', () => {
    expect(TextCase.uppercase('HELLO WORLD')).toBe('HELLO WORLD');
  });

  it('converts a mixed-case string to uppercase', () => {
    expect(TextCase.uppercase('hElLo WoRlD')).toBe('HELLO WORLD');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.uppercase('')).toBe('');
  });
});

describe('TextCase - lowercase', () => {
  it('converts an uppercase string to lowercase', () => {
    expect(TextCase.lowercase('HELLO WORLD')).toBe('hello world');
  });

  it('returns the same string when already lowercase', () => {
    expect(TextCase.lowercase('hello world')).toBe('hello world');
  });

  it('converts a mixed-case string to lowercase', () => {
    expect(TextCase.lowercase('hElLo WoRlD')).toBe('hello world');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.lowercase('')).toBe('');
  });
});

describe('TextCase - pascalCase', () => {
  it('converts a space-separated string to PascalCase', () => {
    expect(TextCase.pascalCase('hello world')).toBe('HelloWorld');
  });

  it('converts a snake_case string to PascalCase', () => {
    expect(TextCase.pascalCase('hello_world')).toBe('HelloWorld');
  });

  it('converts a kebab-case string to PascalCase', () => {
    expect(TextCase.pascalCase('hello-world')).toBe('HelloWorld');
  });

  it('converts a camelCase string to PascalCase', () => {
    expect(TextCase.pascalCase('helloWorld')).toBe('HelloWorld');
  });

  it('returns the same single-word string capitalized', () => {
    expect(TextCase.pascalCase('hello')).toBe('Hello');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.pascalCase('')).toBe('');
  });
});

describe('TextCase - camelCase', () => {
  it('converts a space-separated string to camelCase', () => {
    expect(TextCase.camelCase('hello world')).toBe('helloWorld');
  });

  it('converts a snake_case string to camelCase', () => {
    expect(TextCase.camelCase('hello_world')).toBe('helloWorld');
  });

  it('converts a kebab-case string to camelCase', () => {
    expect(TextCase.camelCase('hello-world')).toBe('helloWorld');
  });

  it('converts a PascalCase string to camelCase', () => {
    expect(TextCase.camelCase('HelloWorld')).toBe('helloWorld');
  });

  it('returns a lowercase single-word string unchanged', () => {
    expect(TextCase.camelCase('hello')).toBe('hello');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.camelCase('')).toBe('');
  });
});

describe('TextCase - snakeCase', () => {
  it('converts a space-separated string to snake_case', () => {
    expect(TextCase.snakeCase('hello world')).toBe('hello_world');
  });

  it('converts a camelCase string to snake_case', () => {
    expect(TextCase.snakeCase('helloWorld')).toBe('hello_world');
  });

  it('converts a PascalCase string to snake_case', () => {
    expect(TextCase.snakeCase('HelloWorld')).toBe('hello_world');
  });

  it('converts a kebab-case string to snake_case', () => {
    expect(TextCase.snakeCase('hello-world')).toBe('hello_world');
  });

  it('returns the same lowercase single-word string', () => {
    expect(TextCase.snakeCase('hello')).toBe('hello');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.snakeCase('')).toBe('');
  });
});

describe('TextCase - kebabCase', () => {
  it('converts a space-separated string to kebab-case', () => {
    expect(TextCase.kebabCase('hello world')).toBe('hello-world');
  });

  it('converts a camelCase string to kebab-case', () => {
    expect(TextCase.kebabCase('helloWorld')).toBe('hello-world');
  });

  it('converts a PascalCase string to kebab-case', () => {
    expect(TextCase.kebabCase('HelloWorld')).toBe('hello-world');
  });

  it('converts a snake_case string to kebab-case', () => {
    expect(TextCase.kebabCase('hello_world')).toBe('hello-world');
  });

  it('returns the same lowercase single-word string', () => {
    expect(TextCase.kebabCase('hello')).toBe('hello');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.kebabCase('')).toBe('');
  });
});

describe('TextCase - titleCase', () => {
  it('capitalizes the first letter of each word', () => {
    expect(TextCase.titleCase('hello world')).toBe('Hello World');
  });

  it('lowercases the rest of each word', () => {
    expect(TextCase.titleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('handles a sentence with multiple words', () => {
    expect(TextCase.titleCase('the quick brown fox')).toBe(
      'The Quick Brown Fox',
    );
  });

  it('returns a single capitalized word', () => {
    expect(TextCase.titleCase('hello')).toBe('Hello');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.titleCase('')).toBe('');
  });
});

describe('TextCase - constantCase', () => {
  it('converts a space-separated string to CONSTANT_CASE', () => {
    expect(TextCase.constantCase('hello world')).toBe('HELLO_WORLD');
  });

  it('converts a camelCase string to CONSTANT_CASE', () => {
    expect(TextCase.constantCase('helloWorld')).toBe('HELLO_WORLD');
  });

  it('converts a PascalCase string to CONSTANT_CASE', () => {
    expect(TextCase.constantCase('HelloWorld')).toBe('HELLO_WORLD');
  });

  it('converts a kebab-case string to CONSTANT_CASE', () => {
    expect(TextCase.constantCase('hello-world')).toBe('HELLO_WORLD');
  });

  it('returns a single uppercase word', () => {
    expect(TextCase.constantCase('hello')).toBe('HELLO');
  });

  it('returns an empty string for an empty input', () => {
    expect(TextCase.constantCase('')).toBe('');
  });
});
