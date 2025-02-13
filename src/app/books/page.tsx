"use client";

import { useState, useEffect } from "react";

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    status: string;
}

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/books");
            if (!response.ok) {
                throw new Error("書籍データの取得に失敗しました");
            }
            const data = await response.json();
            setBooks(data);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "エラーが発生しました");
            setLoading(false);
        }
    };

    if (loading) return <div>読み込み中...</div>;
    if (error) return <div>エラー: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">書籍一覧</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div key={book.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
                        <p className="text-gray-600 mb-2">著者: {book.author}</p>
                        <p className="text-gray-600 mb-2">ISBN: {book.isbn}</p>
                        <p className="text-gray-600">
                            状態: <span className={`inline-block px-2 py-1 rounded ${book.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{book.status === "available" ? "貸出可能" : "貸出中"}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
