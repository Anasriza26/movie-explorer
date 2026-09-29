import { getSafeRedirect, validateLogin } from './validation';

describe('validateLogin', () => {
  test('accepts valid input', () => {
    expect(validateLogin({ username: 'demo', password: 'movie123' })).toEqual({});
  });
  test('reports empty and too-short fields', () => {
    expect(validateLogin({ username: '', password: '' })).toEqual({
      username: 'Enter your username.', password: 'Enter your password.',
    });
    expect(validateLogin({ username: 'ab', password: '123' })).toHaveProperty('username');
  });
  test('ignores surrounding spaces in the username', () => {
    expect(validateLogin({ username: '  demo  ', password: 'movie123' })).toEqual({});
  });
});

describe('getSafeRedirect', () => {
  test.each([['/search?q=a', '/search?q=a'], ['//evil.com', '/'], ['https://evil.com', '/'], ['/login', '/'], [undefined, '/'], [42, '/']])(
    '%p -> %p', (input, expected) => expect(getSafeRedirect(input)).toBe(expected)
  );
});
