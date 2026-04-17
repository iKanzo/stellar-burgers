import store from '../services/store';

describe('root reducer initialization', () => {
  it('should return initial state on unknown action', () => {
    const state = store.getState();

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('order');
  });

  it('should not change state on unknown action', () => {
    const prevState = store.getState();

    store.dispatch({ type: 'UNKNOWN_ACTION' });

    const nextState = store.getState();

    expect(nextState).toEqual(prevState);
  });
});
