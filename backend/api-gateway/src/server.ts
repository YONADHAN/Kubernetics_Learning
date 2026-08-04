import type {Express} from 'express';
import type {Server as HttpServer} from 'http';
import { env } from './config/env';
import { App } from './app';
import { logger } from './config/logger';

export class Server {
    private readonly app: Express;

    private httpServer?: HttpServer;

    constructor() {
        const application = new App();
        this.app = application.getApp();
    }

    public start(port: number): void {
        this.httpServer = this.app.listen(port, () => {
            
            logger.info(`API Gateway running on port ${port}`);
        });
    };


    public stop(): void {
        if(!this.httpServer) {
            return;
        }

        this.httpServer.close(()=> {
            console.log("API Gateway stopped.")
        })
    }
}


const server = new Server();

server.start(env.PORT)