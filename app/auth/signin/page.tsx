'use client';

import { signIn } from 'next-auth/react';
import { Github, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignIn() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-sm text-muted-foreground">
          <div className="text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
