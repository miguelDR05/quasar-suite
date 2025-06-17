declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
  /// <reference types="vite/client" />
  interface ImportMeta {
    readonly hot?: {
      accept: (fn: (mod) => void) => void;
      dispose: (fn: () => void) => void;
      // añade otras propiedades de HMR que necesites
    };
  }
}
