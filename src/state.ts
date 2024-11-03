/* This class models the state of a web component.
 *
 */
export default function state<T extends object>(
  initial: T,
  callback: (prop: string | null, oldval: any, newval: any) => void,
): T {
  const props = { ...initial }

  const value = new Proxy(props, {
    set(_obj, prop, newval) {
      // @ts-ignore
      const oldval: any = props[prop]
      callback(prop.toString(), oldval, newval)

      // @ts-ignore
      props[prop] = newval

      // Indicate success
      return true
    },
    get(_target, prop, _receiver) {
      // @ts-ignore
      return props[prop.toString()]
    },
  })

  return value
}
