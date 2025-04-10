import { Store } from 'vuex'

declare module 'vuex' {
  export function createStore<S>(options: StoreOptions<S>): Store<S>
  export class Store<S> {
    constructor(options: StoreOptions<S>)
  }
  export interface StoreOptions<S> {
    state?: S | (() => S)
    modules?: ModuleTree<S>
  }
  export interface ModuleTree<R> {
    [key: string]: Module<any, R>
  }
}
