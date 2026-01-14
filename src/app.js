import express from "express";
import cors from "cors";
import { router as apiRoutes} from "./routes/index.js"


export const app = express();

const corsOptions = {
    origin:[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://nesta-rental-management.vercel.app"
    ],
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use("/api", apiRoutes);

