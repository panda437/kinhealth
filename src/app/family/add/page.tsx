"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function AddMember() {
    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: "",
        gender: "Male",
        bloodGroup: "A+",
        allergies: "",
        chronicConditions: "",
        height: "",
        weight: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/family");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || "Failed to add member");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft size={18} className="mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold flex items-center">
                    <UserPlus className="mr-2 text-primary" size={24} />
                    <span>Add Family Member</span>
                </h1>
            </div>

            <div className="glass p-8 rounded-2xl border border-border shadow-sm">
                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl mb-6 text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Arham Kabeer"
                                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                required
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                required
                            >
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center space-x-2 text-muted-foreground mb-4">
                        <HeartPulse size={18} className="text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wider">Health Details (Optional)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="175"
                                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="70"
                                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Allergies (comma separated)</label>
                        <textarea
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            placeholder="e.g. Peanuts, Penicillin"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all h-20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Chronic Conditions (comma separated)</label>
                        <textarea
                            name="chronicConditions"
                            value={formData.chronicConditions}
                            onChange={handleChange}
                            placeholder="e.g. Asthma, Diabetes"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all h-20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4"
                    >
                        {loading ? "Adding Member..." : "Add Member to Family Orbit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
