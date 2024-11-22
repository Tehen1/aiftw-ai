'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An error occurred during authentication';
  if (error === 'AccessDenied') {
    errorMessage = 'Access denied. You may not have permission to sign in.';
  } else if (error === 'Configuration') {
    errorMessage = 'There is a problem with the server configuration.';
  } else if (error === 'Verification') {
    errorMessage = 'The verification link may have expired or already been used.';
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>Authentication Error</CardTitle>
          </div>
          <CardDescription>
            There was a problem signing you in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {errorMessage}
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/auth/signin" className="w-full">
            <Button className="w-full">
              Try Again
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
