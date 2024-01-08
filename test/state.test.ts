import { assert, describe, expect, it } from 'vitest';
import state from '../src/state';

describe('The State object', () => {
  it('will return the initial value if no changes have been made', () => {
    const initial = {
      'hello': 'old',
      'world': 'old'
    };

    const props = state(initial, () => {});

    expect(props['hello']).toBe('old')
    expect(props['world']).toBe('old')
  })

  it('will call the callback if a change has been made', () => {
    const initial = {
      'hello': 'old',
      'world': 'old'
    };

    interface Change {
      prop: string | symbol,
      oldval: any,
      newval: any
    }

    const changes: Change[] = []
    const props = state(initial, (prop, oldval, newval) => {
      changes.push({ prop, oldval, newval })
    });

    props['hello'] = 'new1'
    props['world'] = 'new2'

    expect(changes[0]).toEqual({ prop: 'hello', oldval: 'old', newval: 'new1' })
    expect(changes[1]).toEqual({ prop: 'world', oldval: 'old', newval: 'new2' })
  })

  it('will return the changed value if changes have been made', () => {
    const initial = {
      'hello': 'old',
      'world': 'old'
    };

    const props = state(initial, () => {});

    props['hello'] = 'new1'
    props['world'] = 'new2'

    expect(props['hello']).toBe('new1')
    expect(props['world']).toBe('new2')
  })
});