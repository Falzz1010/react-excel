import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { ThemeToggle } from '@/components/ThemeToggle';

const authSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  displayName: z.string().optional()
});

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleAuth = async (formData: FormData, isSignUp: boolean) => {
    setLoading(true);
    
    const email = formData.get('email') as string || '';
    const password = formData.get('password') as string || '';
    const displayName = formData.get('displayName') as string || '';

    try {
      const validation = authSchema.parse({ 
        email: email.trim(), 
        password: password.trim(), 
        displayName: displayName.trim() || undefined 
      });
      
      const { error } = isSignUp 
        ? await signUp(validation.email, validation.password, validation.displayName)
        : await signIn(validation.email, validation.password);

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } else if (isSignUp) {
        toast({
          title: 'Berhasil!',
          description: 'Akun berhasil dibuat. Silakan login.'
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Error Validasi',
          description: error.issues[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Terjadi kesalahan tidak terduga',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Dashboard Login</CardTitle>
            <ThemeToggle />
          </div>
          <CardDescription>Masuk atau daftar untuk mengakses dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAuth(formData, false);
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAuth(formData, true);
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nama</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Loading...' : 'Daftar'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}