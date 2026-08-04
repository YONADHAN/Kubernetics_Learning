import express , {type Express} from 'express';

export class App {
    private readonly app: Express;

    constructor(){
        this.app = express();

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandlers();
    }

    public getApp(): Express {
        return this.app;
    }

    private initializeMiddlewares():void{

    }


    private initializeRoutes(): void {

        this.app.get("/health",(_, res) => {
            res.status(200).json({
                success: true,
                message: "API Gateway is running",
            })
        })
        
    }

    private initializeErrorHandlers(): void {

    }
}