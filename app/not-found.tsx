import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[600px] px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-6 w-6 text-muted-foreground" />
            <CardTitle>Page Not Found</CardTitle>
          </div>
          <CardDescription>
            The page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            The page you requested could not be found. Please check the URL or
            navigate back to the homepage.
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
