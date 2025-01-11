export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      REDIS_USERNAME: string;
    }
  }
}
