/* This class models the state of a web component.
 * 
 */
export default function state<T extends object>(el: HTMLElement, initial: T) : T {
    const props = Object.keys(initial);

    // Set initial values on the element
    for (const prop of props) {
      // @ts-ignore
      el.setAttribute(prop.toString(), initial[prop]);
    }

    const value = new Proxy(initial, {
      set(_obj, prop, newval) {
        if (props.includes(prop.toString())) {
          el.setAttribute(prop.toString(), newval);
        }
  
        // Indicate success
        return true;
      },
    });

    return value;
}