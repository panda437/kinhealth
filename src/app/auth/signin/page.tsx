"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError("Invalid email or password");
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 glass rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-primary font-medium hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
