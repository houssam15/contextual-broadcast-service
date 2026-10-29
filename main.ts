const { App } = require('./infrastructure/app');
const { container } = require('./infrastructure/container');

["uncaughtException", "unhandledRejection"].forEach((event) => {
    process.on(event, (err) => container.logger.error(`Fatal ${event}:`, err));
});

const app = new App(container);

app.listen();