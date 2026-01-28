"use client";

import { useEffect, useState } from "react";
import { Plus, Users, HeartPulse, ChevronRight } from "lucide-react";
import Link from "next/link";
import { IMember } from "@/models/Member";

export default function FamilyOrbit() {
    const [members, setMembers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch("/api/members");
                if (res.ok) {
                    const data = await res.json();
                    setMembers(data);
                }
            } catch (err) {
                console.error("Failed to fetch members:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-primary font-bold">Loading Family Orbit...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <Users className="mr-2 text-primary" size={32} />
                        Family Orbit
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor health profiles for everyone you love.</p>
                </div>
                <Link
                    href="/family/add"
                    className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add Member</span>
                </Link>
            </div>

            {members.length === 0 ? (
                <div className="glass p-12 rounded-3xl border-2 border-dashed border-border flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4">
                        <HeartPulse size={40} className="text-primary/40" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Your Family Orbit is Empty</h2>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Start by adding your family members to track their vaccinations, symptoms, and health milestones.
                    </p>
                    <Link
                        href="/family/add"
                        className="text-primary font-bold hover:underline underline-offset-4"
                    >
                        Add your first member now →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <Link
                            key={member._id as string}
                            href={`/family/${member._id}`}
                            className="group glass p-6 rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-xl relative overflow-hidden"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                    {member.gender === 'Male' ? '🧔' : member.gender === 'Female' ? '👩' : '👤'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()} years • {member.bloodGroup}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                            Healthy
                                        </span>
                                        {member.allergies && member.allergies.length > 0 && (
                                            <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                                Allergies
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                            </div>

                            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Weight</p>
                                    <p className="text-sm font-bold">{member.weight ? `${member.weight} kg` : '--'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Height</p>
                                    <p className="text-sm font-bold">{member.height ? `${member.height} cm` : '--'}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
