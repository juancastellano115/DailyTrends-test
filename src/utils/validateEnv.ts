import { cleanEnv, port, str } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    URL_EL_MUNDO: str(),
    URL_EL_PAIS: str(),
    REDIS_URL: str(),
    REDIS_HOST: str(),
    REDIS_PORT: port(),
    REDIS_PASSWORD: str(),
  });
};
