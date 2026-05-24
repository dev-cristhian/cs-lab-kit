export class TextCase {
  /**
   * Inverts the characters of the text.
   *
   * @param text - The text to invert.
   * @returns The inverted text.
   * @example
   * TextCase.invertText('hello'); // 'olleh'
   */
  public static invertText(text: string): string {
    return text.split('').reverse().join('');
  }

  /**
   * Removes accents and diacritics from the text.
   *
   * @param text - The text to remove accents from.
   * @returns The text without accents.
   * @example
   * TextCase.removeAccents('café'); // 'cafe'
   * TextCase.removeAccents('ação'); // 'acao'
   */
  public static removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Converts the text to UPPERCASE.
   *
   * @param text - The text to convert.
   * @returns The text in uppercase.
   * @example
   * TextCase.uppercase('hello world'); // 'HELLO WORLD'
   */
  public static uppercase(text: string): string {
    return text.toUpperCase();
  }

  /**
   * Converts the text to lowercase.
   *
   * @param text - The text to convert.
   * @returns The text in lowercase.
   * @example
   * TextCase.lowercase('HELLO WORLD'); // 'hello world'
   */
  public static lowercase(text: string): string {
    return text.toLowerCase();
  }

  /**
   * Converts the text to PascalCase.
   *
   * Handles space-separated, snake_case, kebab-case, and camelCase inputs.
   *
   * @param text - The text to convert.
   * @returns The text in PascalCase.
   * @example
   * TextCase.pascalCase('hello world'); // 'HelloWorld'
   * TextCase.pascalCase('hello_world'); // 'HelloWorld'
   * TextCase.pascalCase('hello-world'); // 'HelloWorld'
   */
  public static pascalCase(text: string): string {
    return this.toWords(text)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Converts the text to camelCase.
   *
   * Handles space-separated, snake_case, kebab-case, and PascalCase inputs.
   *
   * @param text - The text to convert.
   * @returns The text in camelCase.
   * @example
   * TextCase.camelCase('hello world'); // 'helloWorld'
   * TextCase.camelCase('hello_world'); // 'helloWorld'
   * TextCase.camelCase('HelloWorld');  // 'helloWorld'
   */
  public static camelCase(text: string): string {
    return this.toWords(text)
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join('');
  }

  /**
   * Converts the text to snake_case.
   *
   * Handles space-separated, kebab-case, and camelCase/PascalCase inputs.
   *
   * @param text - The text to convert.
   * @returns The text in snake_case.
   * @example
   * TextCase.snakeCase('hello world'); // 'hello_world'
   * TextCase.snakeCase('helloWorld');  // 'hello_world'
   * TextCase.snakeCase('hello-world'); // 'hello_world'
   */
  public static snakeCase(text: string): string {
    return this.toWords(text).join('_').toLowerCase();
  }

  /**
   * Converts the text to kebab-case.
   *
   * Handles space-separated, snake_case, and camelCase/PascalCase inputs.
   *
   * @param text - The text to convert.
   * @returns The text in kebab-case.
   * @example
   * TextCase.kebabCase('hello world'); // 'hello-world'
   * TextCase.kebabCase('helloWorld');  // 'hello-world'
   * TextCase.kebabCase('hello_world'); // 'hello-world'
   */
  public static kebabCase(text: string): string {
    return this.toWords(text).join('-').toLowerCase();
  }

  /**
   * Converts the text to Title Case.
   *
   * @param text - The text to convert.
   * @returns The text in Title Case.
   * @example
   * TextCase.titleCase('hello world'); // 'Hello World'
   * TextCase.titleCase('the quick brown fox'); // 'The Quick Brown Fox'
   */
  public static titleCase(text: string): string {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Converts the text to CONSTANT_CASE.
   *
   * Handles space-separated, kebab-case, and camelCase/PascalCase inputs.
   *
   * @param text - The text to convert.
   * @returns The text in CONSTANT_CASE.
   * @example
   * TextCase.constantCase('hello world'); // 'HELLO_WORLD'
   * TextCase.constantCase('helloWorld');  // 'HELLO_WORLD'
   * TextCase.constantCase('hello-world'); // 'HELLO_WORLD'
   */
  public static constantCase(text: string): string {
    return this.toWords(text).join('_').toUpperCase();
  }

  /**
   * Splits text into an array of lowercase words.
   *
   * Handles space-separated, snake_case, kebab-case, and camelCase/PascalCase boundaries.
   *
   * @param text - The text to split into words.
   * @returns An array of lowercase words.
   */
  private static toWords(text: string): string[] {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[\s_-]+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean);
  }
}
