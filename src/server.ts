import { App } from '@/app';
import { FeedRoute } from '@/routes/feeds.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new FeedRoute()]);

app.listen();
