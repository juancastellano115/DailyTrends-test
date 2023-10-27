import { IndexRoute } from '@/routes/index.route';
import { App } from '@/app';
import { FeedRoute } from '@/routes/feeds.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new IndexRoute(), new FeedRoute()]);

app.listen();
