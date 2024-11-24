'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/auth/user-nav";
import { Bot } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from 'react';
import { ChatbotsModal } from './chatbots/chatbots-modal';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showChatbots, setShowChatbots] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Chatbots", onClick: () => setShowChatbots(true) },
    { name: "Analytics", href: "/analytics" },
  ];

  return (
    <>
      <ChatbotsModal isOpen={showChatbots} onClose={() => setShowChatbots(false)} />
      
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="font-bold">AI Chat Platform</span>
          </Link>
          <nav className="flex items-center space-x-6 ml-6">
            {navigation.map((item) => (
              item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/chat"
                      ? "text-foreground"
                      : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </button>
              )
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            {session ? (
              <UserNav user={session.user} />
            ) : (
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}