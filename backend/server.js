const express = require("express");
const redis = require("redis");
const cors = require("cors");

const app = express();

app.use(cors());

const client = redis.createClient({
    url: "redis://redis:6379"
});

async function startServer() {

    await client.connect();

    console.log("Connected to Redis");

    app.get("/api", async (req, res) => {

        let visits = await client.get("visits");

        if (!visits) {
            visits = 0;
        }

        visits = parseInt(visits) + 1;

        await client.set("visits", visits);

        res.json({
            message: "Backend working successfully",
            visits: visits,
            container: process.env.HOSTNAME
        });
    });

    app.listen(5000, () => {
        console.log("Backend running on port 5000");
    });
}

startServer();