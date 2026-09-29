import reducer, { login, logout, clearAuthError, initialState } from './authSlice';

const args = { username: 'demo', password: 'secret-pw-123' };

describe('authSlice', () => {
  test('login success stores the username and never the password', () => {
    const state = reducer(initialState, login.fulfilled({ username: 'demo' }, 'r1', args));
    expect(state.user).toEqual({ username: 'demo' });
    expect(JSON.stringify(state)).not.toContain('secret-pw-123');
  });
  test('login failure stores a message and no user', () => {
    const state = reducer(initialState, login.rejected(null, 'r1', args, 'Invalid username or password.'));
    expect(state).toMatchObject({ user: null, status: 'failed', error: 'Invalid username or password.' });
  });
  test('clearAuthError resets a failed state', () => {
    const failed = reducer(initialState, login.rejected(null, 'r1', args, 'nope'));
    expect(reducer(failed, clearAuthError())).toMatchObject({ status: 'idle', error: null });
  });
  test('logout resets everything', () => {
    const loggedIn = reducer(initialState, login.fulfilled({ username: 'demo' }, 'r1', args));
    expect(reducer(loggedIn, logout())).toEqual(initialState);
  });
});
