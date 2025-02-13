import express, { Request, Response } from "express";
import { pool } from "../index";

const router = express.Router();

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string | null;
    description: string | null;
    status: "available" | "borrowed";
    owner_id: number | null;
    created_at: Date;
    updated_at: Date;
}

// 全ての書籍を取得
router.get("/", async (req: Request, res: Response) => {
    try {
        const result = await pool.query<Book>(
            "SELECT * FROM books ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ error: "書籍の取得に失敗しました" });
    }
});

// 新しい書籍を登録
router.post("/", async (req: Request, res: Response) => {
    const { title, author, isbn, description } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: "タイトルと著者は必須です" });
    }

    try {
        const result = await pool.query<Book>(
            "INSERT INTO books (title, author, isbn, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, author, isbn, description, "available"]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating book:", err);
        res.status(500).json({ error: "書籍の登録に失敗しました" });
    }
});

// 特定の書籍を取得
router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query<Book>("SELECT * FROM books WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "書籍が見つかりません" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching book:", err);
        res.status(500).json({ error: "書籍の取得に失敗しました" });
    }
});

// 書籍の貸出状態を更新
router.patch("/:id/status", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["available", "borrowed"].includes(status)) {
        return res.status(400).json({ error: "無効なステータスです" });
    }

    try {
        const result = await pool.query<Book>(
            "UPDATE books SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "書籍が見つかりません" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating book status:", err);
        res.status(500).json({ error: "ステータスの更新に失敗しました" });
    }
});

export default router;
