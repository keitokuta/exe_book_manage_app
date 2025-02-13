import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import booksRouter from "./routes/books";

// 環境変数の読み込み
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// データベース接続設定
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
});

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// ルーティングの設定
app.use("/api/books", booksRouter);

// ルートエンドポイント
app.get("/", (req, res) => {
    res.json({ message: "Book Management API Server" });
});

// サーバーの起動
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// エラーハンドリング
process.on("unhandledRejection", (err) => {
    console.error("Unhandled promise rejection:", err);
    process.exit(1);
});
