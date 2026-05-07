import { App } from './infrastructure/app.ts';
import { container } from './infrastructure/container.ts';

["uncaughtException", "unhandledRejection"].forEach((event) => {
    process.on(event, (err) => container.logger.error(`Fatal ${event}:`, err));
});

const app = new App(container);

app.listen();