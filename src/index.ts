import { Application } from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as path from 'path';
import * as helmet from 'helmet';
import * as winston from 'winston';
import * as fs from 'fs';
import { WriteStream } from "fs"
import Routes from './routes';
import { unCaughtErrorHandler } from './handlers/errorHandler';
import ratelimiter from './middlewares/middleware';

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  public function config(app: Application): void {
    const accessLogsStream: WriteStream = fs.createWriteStream(
      path.join(__dirname, "./logs/access.log"),
      { flags: 'a' }
    );
    app.use(morgan("combined", { streams: accessLogsStream }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(helmet());
    app.use(ratelimiter());
    app.use(unCaughtErrorHandler());
  }

}

process.on('beforeExit', function (err) {
  winston.error(JSON.stringify(err));
  console.error(err);

});