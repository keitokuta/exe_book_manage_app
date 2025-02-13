"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBookPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:3001/api/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("書籍の登録に失敗しました");
            }

            router.push("/books");
        } catch (err) {
            setError(err instanceof Error ? err.message : "エラーが発生しました");
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">新規書籍登録</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                        タイトル*
                    </label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="mb-4">
                    <label htmlFor="author" className="block text-gray-700 font-bold mb-2">
                        著者*
                    </label>
                    <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="mb-4">
                    <label htmlFor="isbn" className="block text-gray-700 font-bold mb-2">
                        ISBN
                    </label>
                    <input type="text" id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                        説明
                    </label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                {error && <div className="text-red-600 mb-4">{error}</div>}

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        キャンセル
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                        {loading ? "登録中..." : "登録"}
                    </button>
                </div>
            </form>
        </div>
    );
}
