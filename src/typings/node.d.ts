interface ImportMeta {
  env: {
    SAITURI_ENV: "test" | "development" | "production";
  };
}

declare module "process" {
  namespace NodeJS {
    interface ProcessEnv {
      SAITURI_ENV: "test" | "development" | "production";
    }
  }
}
