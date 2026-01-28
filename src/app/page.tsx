"use client";

import { Plus, Activity, Heart, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { IMember } from '@/models/Member';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickLogInput, setQuickLogInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session) {
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
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickLogInput.trim()) {
      router.push(`/chat?msg=${encodeURIComponent(quickLogInput)}`);
    }
  };

  const firstName = session?.user?.name?.split(' ')[0] || 'there';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-primary font-bold">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Greeting & Header */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {session ? `Good Morning, ${firstName}` : "Welcome to KinHealth"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {session
              ? "Here's a quick look at your family's health today."
              : "Centralize your family medical data with AI-powered logs."}
          </p>
        </div>
        {session && (
          <Link
            href="/family/add"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <Plus size={20} />
            <span>Add Member</span>
          </Link>
        )}
      </section>

      {session ? (
        <>
          {/* Quick Action AI Trigger */}
          <section className="glass p-6 rounded-2xl border border-border shadow-sm">
            <form onSubmit={handleQuickLog} className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <label htmlFor="quick-log" className="block text-sm font-medium text-foreground mb-2">
                  Quick Log (AI)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="quick-log"
                    value={quickLogInput}
                    onChange={(e) => setQuickLogInput(e.target.value)}
                    placeholder='e.g., "Arham had 101F fever at 10 AM, gave Calpol"'
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-accent rounded-lg transition-colors"
                  >
                    <Activity size={20} />
                  </button>
                </div>
              </div>
              <div className="md:w-48 w-full">
                <p className="text-xs text-muted-foreground italic mb-2">Try voice log</p>
                <button type="button" className="w-full h-11 flex items-center justify-center space-x-2 border-2 border-dashed border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-colors text-sm font-medium">
                  <span>🎙️ Start Recording</span>
                </button>
              </div>
            </form>
          </section>

          {/* Family Overview Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Heart className="text-destructive fill-destructive" size={20} />
                <span>Family Orbit</span>
              </h2>
              <Link href="/family" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>

            {members.length === 0 ? (
              <div className="glass p-8 rounded-2xl border-2 border-dashed border-border text-center">
                <p className="text-muted-foreground mb-4">No family members added yet.</p>
                <Link href="/family/add" className="text-primary font-bold hover:underline">Add someone now →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <Link
                    key={(member._id as any).toString()}
                    href={`/family/${(member._id as any).toString()}`}
                    className="group glass p-5 rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {member.gender === 'Male' ? '🧔' : member.gender === 'Female' ? '👩' : '👤'}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()}y • {member.bloodGroup}
                          </p>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider bg-green-500">
                        Healthy
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>Last update: Today</span>
                      </div>
                      <span className="group-hover:text-primary transition-colors font-medium">Details →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent Activity Mini-Feed */}
          <section className="pb-8">
            <h2 className="text-xl font-bold mb-4">Recent Health Events</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">No recent events to display. Start logging with the AI Inbox!</p>
            </div>
          </section>
        </>
      ) : (
        <section className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <Heart className="text-primary w-12 h-12" />
          </div>
          <h2 className="text-4xl font-extrabold text-foreground mb-4">Health Management, Simplified.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            A professional, empathetic platform for tracking your family's medical journey. From vaccinations to symptom journals, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-xl active:scale-95"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-3 glass border border-border rounded-xl font-bold text-lg hover:bg-accent transition-all active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
