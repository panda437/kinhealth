import Link from 'next/link';
import { LayoutDashboard, Users, MessageSquare, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/family', label: 'Family Orbit', icon: Users },
        { href: '/chat', label: 'AI Inbox', icon: MessageSquare },
    ];

    return (
        <nav className="sticky top-0 z-50 glass border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">K</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">KinHealth</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                <link.icon size={18} />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <span className="text-xs font-semibold text-accent-foreground">AK</span>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden glass border-t border-border animate-in slide-in-from-top duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                            >
                                <link.icon size={20} />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
