"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setError(errorText || "Registration failed");
      } else {
        // Auto sign-in after registration
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ag-bg-primary relative overflow-hidden p-4">
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-ag-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-ag-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="flex items-center gap-2 mb-8 relative z-10 hover:scale-105 transition-transform">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ag-primary to-ag-accent flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold gradient-text">TradeMind AI</span>
      </Link>

      <div className="w-full max-w-md glass-card p-8 relative z-10 animate-fade-in">
        <h2 className="text-2xl font-bold text-ag-text-primary mb-2 text-center">Create an account</h2>
        <p className="text-sm text-ag-text-secondary text-center mb-8">
          Join TradeMind AI and start understanding your trades
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-ag-loss-dim border border-ag-loss/30 flex items-center gap-2 text-ag-loss text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ag-text-secondary mb-1">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="bg-ag-bg-secondary border-ag-border text-ag-text-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ag-text-secondary mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@trademind.ai"
              required
              className="bg-ag-bg-secondary border-ag-border text-ag-text-primary"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-ag-text-secondary mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-ag-bg-secondary border-ag-border text-ag-text-primary"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-ag-primary hover:bg-ag-primary/90 text-white shadow-glow-blue mt-2"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ag-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-ag-primary hover:text-ag-accent transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
