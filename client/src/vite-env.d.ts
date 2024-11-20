/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ImportMetaEnv {
    VITE_API_URL: string;
  }

  interface ImportMeta {
    env: ImportMetaEnv;
  }
}
