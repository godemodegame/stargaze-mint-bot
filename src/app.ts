import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createHmac } from "node:crypto";
import mint from './models/mint';

function HMAC_SHA256(key: string | Buffer, secret: string) {
    return createHmac("sha256", key).update(secret);
}

function getCheckString(data: URLSearchParams) {
	const items: [k: string, v: string][] = [];

	for (const [k, v] of data.entries()) if (k !== "hash") items.push([k, v]);

	return items.sort(([a], [b]) => a.localeCompare(b))
		.map(([k, v]) => `${k}=${v}`)
		.join("\n");
}

function getTelegramId(initData: string) {
    return JSON.parse(new URLSearchParams(initData).get("user")).id;
}

const startApp = () => {
    const app: Express = express();
    const port = process.env.SERVER_PORT;

    app.use(cors());
    app.use(express.json({type: '*/*'}));

    app.post("/createMint", async (req: Request, res: Response) => {
        const data = new URLSearchParams(req.body.initData);
        const data_check_string = getCheckString(data);
        const secret_key = HMAC_SHA256("WebAppData", process.env.BOT_TOKEN!).digest();
	    const hash = HMAC_SHA256(secret_key, data_check_string).digest("hex");

	    if (hash === data.get("hash")) {
            if (req.body.date < Date.now()) {
                return res.status(400).json({error: "Date is in the past"});
            } else if (req.body.amount < 1) {
                return res.status(400).json({error: "Amount is less than 1"});
            } else if (req.body.price < 0) {
                return res.status(400).json({error: "Price is less than 0"});
            } else if (req.body.address === undefined || req.body.address === "") {
                return res.status(400).json({error: "Address is empty"});
            } else if (req.body.address.startsWith("stars")) {
                return res.status(400).json({error: "Address is not a stars address"});
            } else if (req.body.address.length < 45) {
                return res.status(400).json({error: "Address is not a stars address"});
            }

            await new mint({ 
                telegram_id: getTelegramId(req.body.initData),
                contractAddress: req.body.address,
                price: req.body.price,
                amount: req.body.amount,
                mintdate: req.body.date,
            }).save();
            return res.json({ success: true });
        }
        return res.status(401).json({});
    });

    app.post("/mintsList", async (req: Request, res: Response) => {
        const data = new URLSearchParams(req.body.initData);
        const data_check_string = getCheckString(data);
        const secret_key = HMAC_SHA256("WebAppData", process.env.BOT_TOKEN!).digest();
	    const hash = HMAC_SHA256(secret_key, data_check_string).digest("hex");

	    if (hash === data.get("hash")) {
            const mints = await mint.find({ minted: false, telegram_id: getTelegramId(req.body.initData) });
            return res.json({ mints });
        }
        return res.status(401).json({});
    });

    app.get("/", (req: Request, res: Response) => {
        res.send("I'm alive!");
    });

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

export default startApp;