import { assert, describe, expect, it } from 'vitest';
import state from '../src/state';

describe('The State object', () => {
  it('will set initial values on its target object', () => {
    const div = document.createElement("div");

    const initial = {
      "hello": "old",
      "world": "old"
    };
    const props = Object.keys(initial);

    const _state = state(div, initial);
    for (const prop of props) {
      expect(div.getAttribute(prop)).toBe("old");
    }
  });

  it('will set new values on its target object', () => {
    const div = document.createElement("div");

    const initial = {
      "hello": "old",
      "world": "old"
    };
    const props = Object.keys(initial);

    const divState = state(div, initial);
    for (const prop of props) {
      divState[prop] = "new";
    }

    for (const prop of props) {
      expect(div.getAttribute(prop)).toBe("new");
    }
  });
});