import { Plus, Activity, Heart, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  // Mock data for initial UI rendering
  const familyMembers = [
    { name: 'Arham', age: '4y', status: 'Healthy', statusColor: 'bg-green-500', icon: '👶' },
    { name: 'Dad', age: '38y', status: 'Monitoring Cold', statusColor: 'bg-yellow-500', icon: '🧔' },
    { name: 'Mom', age: '35y', status: 'Healthy', statusColor: 'bg-green-500', icon: '👩' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Greeting & Header */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Good Morning, Kabeer</h1>
          <p className="text-muted-foreground mt-1">Here's a quick look at your family's health today.</p>
        </div>
        <Link
          href="/family/add"
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          <span>Add Member</span>
        </Link>
      </section>

      {/* Quick Action AI Trigger */}
      <section className="glass p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <label htmlFor="quick-log" className="block text-sm font-medium text-foreground mb-2">
              Quick Log (AI)
            </label>
            <div className="relative">
              <input
                type="text"
                id="quick-log"
                placeholder='e.g., "Arham had 101F fever at 10 AM, gave Calpol"'
                className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-accent rounded-lg transition-colors">
                <Activity size={20} />
              </button>
            </div>
          </div>
          <div className="md:w-48 w-full">
            <p className="text-xs text-muted-foreground italic mb-2">Try voice log</p>
            <button className="w-full h-12 flex items-center justify-center space-x-2 border-2 border-dashed border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-colors">
              <span>🎙️ Start Recording</span>
            </button>
          </div>
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => (
            <div key={member.name} className="group glass p-5 rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {member.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.age}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${member.statusColor}`}>
                  {member.status}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Next check: Tomorrow</span>
                </div>
                <span className="group-hover:text-primary transition-colors">Details →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity Mini-Feed */}
      <section className="pb-8">
        <h2 className="text-xl font-bold mb-4">Recent Health Events</h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-bold">Arham</span>'s vaccination record updated: <span className="font-medium">Polio Booster</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago • Source: User Chat</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

