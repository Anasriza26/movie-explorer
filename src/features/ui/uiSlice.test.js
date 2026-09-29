import reducer, { toggleMode } from './uiSlice';

test('toggles light <-> dark', () => {
  expect(reducer({ mode: 'light' }, toggleMode())).toEqual({ mode: 'dark' });
  expect(reducer({ mode: 'dark' }, toggleMode())).toEqual({ mode: 'light' });
});
