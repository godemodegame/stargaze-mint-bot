import express, { Express, Request, Response } from "express";

const startApp = () => {
    const app: Express = express();
    const port = process.env.SERVER_PORT;

    app.post("/createMint", (req: Request, res: Response) => {
        console.log("createMint", req.body);
        res.send("created");
    });

    app.get("/", (req: Request, res: Response) => {
        console.log("createMint", req.body);
        res.send("created");
    });

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

export default startApp;