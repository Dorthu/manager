
import { setToken } from 'src/actions/authentication';
import store from 'src/store';

import {
  start, refresh, expire,
  AUTH_TOKEN,
  AUTH_SCOPES,
  AUTH_EXPIRE_DATETIME,
} from './session';

const testToken1 = '06daa2107c487107f4125d55790f59e1e41ed8e705ea005ee43495c23c1de76b';
const testToken2 = '9e1e41ed8e705ea005ee43495c23c1de76b06daa2107c487107f4125d55790f5';
const testScopes = '*';
const testExpiry = 'Fri Mar 02 2018 16:52:45 GMT-0500 (EST)';

store.dispatch = jest.fn();

describe('session.start', () => {
  it('stores it\'s arguments in localStorage', () => {
    start(testToken1, testScopes, testExpiry);
    expect(window.localStorage.getItem(AUTH_TOKEN)).toBe(JSON.stringify(testToken1));
    expect(window.localStorage.getItem(AUTH_SCOPES)).toBe(JSON.stringify(testScopes));
    expect(window.localStorage.getItem(AUTH_EXPIRE_DATETIME)).toBe(JSON.stringify(testExpiry));
  });

  it('dispatches setToken with its arguments', () => {
    start(testToken1, testScopes, testExpiry);
    const action = setToken(testToken1, testScopes);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});

describe('session.refresh', () => {
  it('dispatches setToken from values in localStorage', () => {
    window.localStorage.setItem(AUTH_TOKEN, testToken2);
    window.localStorage.setItem(AUTH_SCOPES, testScopes);
    refresh();
    const action = setToken(testToken2, testScopes);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});

describe('session.expire', () => {
  it('removes auth related values from localStorage', () => {
    window.localStorage.setItem(AUTH_TOKEN, testToken2);
    window.localStorage.setItem(AUTH_SCOPES, testScopes);
    window.localStorage.setItem(AUTH_EXPIRE_DATETIME, testExpiry);
    expire();
    expect(window.localStorage.getItem(AUTH_TOKEN)).toBe(JSON.stringify(''));
    expect(window.localStorage.getItem(AUTH_SCOPES)).toBe(JSON.stringify(''));
    expect(window.localStorage.getItem(AUTH_EXPIRE_DATETIME)).toBe(JSON.stringify(''));
  });

  it('clears the token from Redux via setToken', () => {
    expire();
    const action = setToken(null, null);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
