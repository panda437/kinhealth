"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Settings,
    Stethoscope,
    History,
    Calendar,
    Weight,
    Ruler,
    AlertCircle,
    Filter,
    Plus
} from "lucide-react";
import Link from "next/link";
import { IMember } from "@/models/Member";
import { IHealthEvent } from "@/models/HealthEvent";

export default function MemberDetail() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<{ member: IMember; events: IHealthEvent[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDoctorsView, setIsDoctorsView] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'medical' | 'lifestyle'>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/members/${params.id}`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else {
                    router.push("/family");
                }
            } catch (err) {
                console.error("Failed to fetch member details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id, router]);

    if (loading) return <div className="animate-pulse text-center py-20 font-bold text-primary">Loading Member Profile...</div>;
    if (!data) return null;

    const { member, events } = data;

    const filteredEvents = events.filter(event => {
        if (activeTab === 'all') return true;
        if (activeTab === 'medical') return ['Vaccination', 'Prescription', 'Lab Report', 'Doctor Visit'].includes(event.category);
        if (activeTab === 'lifestyle') return ['Lifestyle', 'Symptom', 'Vitals'].includes(event.category);
        return true;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Link href="/family" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft size={18} className="mr-1" />
                    Back to Family Orbit
                </Link>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsDoctorsView(!isDoctorsView)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${isDoctorsView ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-transparent border-border text-muted-foreground hover:bg-accent'}`}
                    >
                        {isDoctorsView ? "🏥 Exit Doctor's View" : "👨‍⚕️ Doctor's View"}
                    </button>
                    <button className="p-2 border border-border rounded-xl text-muted-foreground hover:bg-accent transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {isDoctorsView ? (
                /* DOCTOR'S VIEW: High contrast, critical info only */
                <div className="glass p-8 rounded-3xl border-4 border-primary/20 space-y-8 bg-white dark:bg-slate-900 shadow-2xl">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-primary text-4xl flex items-center justify-center rounded-2xl text-white font-bold shadow-xl">
                            {member.name[0]}
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-foreground">{member.name}</h1>
                            <p className="text-xl text-muted-foreground font-medium">DOB: {new Date(member.dateOfBirth).toLocaleDateString()} • {member.gender}</p>
                        </div>
                        <div className="ml-auto flex items-center bg-destructive text-white px-6 py-3 rounded-2xl font-black text-2xl shadow-lg shadow-destructive/20">
                            {member.bloodGroup}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-destructive flex items-center">
                                <AlertCircle className="mr-2" size={28} />
                                CRITICAL ALLERGIES
                            </h2>
                            <div className="p-4 bg-destructive/5 border-2 border-destructive/20 rounded-2xl">
                                {member.allergies && member.allergies.length > 0 ? (
                                    <ul className="list-disc list-inside text-lg font-bold text-destructive">
                                        {member.allergies.map(a => <li key={a}>{a}</li>)}
                                    </ul>
                                ) : <p className="text-muted-foreground font-bold">No known allergies</p>}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-primary flex items-center">
                                <Stethoscope className="mr-2" size={28} />
                                CHRONIC CONDITIONS
                            </h2>
                            <div className="p-4 bg-primary/5 border-2 border-primary/20 rounded-2xl">
                                {member.chronicConditions && member.chronicConditions.length > 0 ? (
                                    <ul className="list-disc list-inside text-lg font-bold text-primary">
                                        {member.chronicConditions.map(c => <li key={c}>{c}</li>)}
                                    </ul>
                                ) : <p className="text-muted-foreground font-bold">No chronic conditions reported</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t-2 border-border">
                        <h2 className="text-2xl font-black mb-6">Active Medications & Recent Events</h2>
                        <div className="space-y-4">
                            {events.filter(e => e.category === 'Prescription').length > 0 ? (
                                events.filter(e => e.category === 'Prescription').slice(0, 5).map(e => (
                                    <div key={(e._id as any).toString()} className="p-4 bg-muted/30 rounded-2xl border-2 border-border flex justify-between items-center">
                                        <div>
                                            <p className="font-black text-lg text-foreground">{e.title}</p>
                                            <p className="text-sm font-bold text-muted-foreground">{new Date(e.timestamp).toDateString()}</p>
                                        </div>
                                        <div className="px-4 py-1 bg-primary/10 text-primary font-black rounded-lg text-sm">PRESCRIPTION</div>
                                    </div>
                                ))
                            ) : <p className="text-xl text-muted-foreground font-medium italic">No recent prescriptions recorded.</p>}
                        </div>
                    </div>
                </div>
            ) : (
                /* NORMAL VIEW: Detailed, empathetic, visual */
                <>
                    {/* Member Card */}
                    <section className="glass p-8 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-white to-accent/20 dark:from-slate-900 dark:to-slate-800">
                        <div className="w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center text-5xl shadow-inner group transition-all">
                            {member.gender === 'Male' ? '🧔' : member.gender === 'Female' ? '👩' : '👤'}
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <h1 className="text-4xl font-bold text-foreground">{member.name}</h1>
                                <span className="px-3 py-1 bg-green-500 text-white text-xs font-black rounded-full w-fit mx-auto md:mx-0">HEALTHY</span>
                            </div>
                            <p className="text-lg text-muted-foreground font-medium">
                                {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()} years old • {member.gender}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                                {member.allergies?.map(a => <span key={a} className="px-3 py-1 bg-destructive/10 text-destructive text-[10px] font-bold rounded-lg border border-destructive/20">{a}</span>)}
                                {member.chronicConditions?.map(c => <span key={c} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20">{c}</span>)}
                            </div>
                        </div>
                        <div className="flex gap-4 md:flex-col lg:flex-row">
                            <div className="text-center p-4 bg-background/50 rounded-2xl border border-border min-w-[100px] shadow-sm">
                                <Ruler className="mx-auto mb-1 text-primary" size={20} />
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Height</p>
                                <p className="text-lg font-black text-foreground">{member.height || '--'} <span className="text-xs font-normal">cm</span></p>
                            </div>
                            <div className="text-center p-4 bg-background/50 rounded-2xl border border-border min-w-[100px] shadow-sm">
                                <Weight className="mx-auto mb-1 text-primary" size={20} />
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Weight</p>
                                <p className="text-lg font-black text-foreground">{member.weight || '--'} <span className="text-xs font-normal">kg</span></p>
                            </div>
                            <div className="text-center p-4 bg-background/50 rounded-2xl border border-border min-w-[100px] shadow-sm">
                                <div className="text-lg font-black text-destructive mb-1">{member.bloodGroup}</div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Blood</p>
                                <p className="text-sm font-bold text-foreground">Group</p>
                            </div>
                        </div>
                    </section>

                    {/* Timeline & Filters */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h2 className="text-2xl font-bold flex items-center">
                                <History className="mr-2 text-primary" size={24} />
                                Health Timeline
                            </h2>
                            <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setActiveTab('medical')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'medical' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Medical
                                </button>
                                <button
                                    onClick={() => setActiveTab('lifestyle')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'lifestyle' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Lifestyle
                                </button>
                            </div>
                        </div>

                        {filteredEvents.length === 0 ? (
                            <div className="p-12 text-center glass rounded-3xl border-2 border-dashed border-border opacity-60">
                                <Filter className="mx-auto mb-4 text-muted-foreground/30" size={48} />
                                <p className="text-lg font-medium text-muted-foreground">No records matching your criteria.</p>
                                <button className="mt-4 text-primary font-bold hover:underline flex items-center mx-auto">
                                    <Plus size={16} className="mr-1" /> Add New Entry
                                </button>
                            </div>
                        ) : (
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent">
                                {filteredEvents.map((event) => (
                                    <div key={(event._id as any).toString()} className="relative flex items-start group">
                                        <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary shadow-sm group-hover:scale-110 transition-transform">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                        <div className="ml-16 glass p-6 rounded-2xl border border-border shadow-sm flex-1 group-hover:border-primary/30 transition-all group-hover:shadow-md">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10">
                                                    {event.category}
                                                </span>
                                                <div className="flex items-center text-xs text-muted-foreground font-medium">
                                                    <Calendar size={14} className="mr-1" />
                                                    {new Date(event.timestamp).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-1">{event.title}</h3>
                                            {event.data && (
                                                <div className="mt-3 text-sm text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/50">
                                                    {typeof event.data === 'string' ? event.data : JSON.stringify(event.data)}
                                                </div>
                                            )}
                                            <div className="mt-4 flex items-center text-[10px] text-muted-foreground/50 font-bold uppercase tracking-wider">
                                                Source: {event.source.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
