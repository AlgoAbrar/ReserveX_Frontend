import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChefHat, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function AuthPages() {
  const { type } = useParams<{ type: 'login' | 'register' }>();
  const navigate = useNavigate();
  const { user, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'manager'>('customer');
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = type === 'login';

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (user.role === 'customer') {
        navigate('/customer');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          toast.success('Login successful!');
          // Navigation handled by useEffect above
        } else {
          toast.error(result.error || 'Login failed');
        }
      } else {
        if (!name.trim()) {
          toast.error('Name is required');
          setIsLoading(false);
          return;
        }

        const result = await register(email, password, name, role);
        if (result.success) {
          toast.success('Registration successful!');
          // Navigation handled by useEffect above
        } else {
          toast.error(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials info
  const demoCredentials = [
    { role: 'Admin', email: 'admin@reservex.com', password: 'admin123' },
    { role: 'Customer', email: 'customer@test.com', password: 'customer123' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">ReserveX</h1>
                <p className="text-xs text-muted-foreground">Rajshahi, Bangladesh</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <Card className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-muted-foreground">
                {isLogin 
                  ? 'Sign in to your ReserveX account'
                  : 'Join ReserveX and start reserving tables'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="role">I am a</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'customer' | 'manager')}
                      className="w-full mt-2 h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="customer">Customer</option>
                      <option value="manager">Restaurant Manager</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => navigate(isLogin ? '/auth/register' : '/auth/login')}
                  className="text-primary hover:underline font-semibold"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </Card>

          {/* Right Column - Info & Demo Credentials */}
          <div className="space-y-6">
            {/* Demo Credentials */}
            {isLogin && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="text-lg font-semibold mb-4 text-primary">Demo Credentials</h3>
                <div className="space-y-3">
                  {demoCredentials.map((cred, index) => (
                    <div key={index} className="p-3 rounded-lg bg-card border border-border">
                      <p className="font-semibold text-sm mb-2">{cred.role}</p>
                      <p className="text-xs text-muted-foreground mb-1">
                        Email: <span className="text-foreground">{cred.email}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Password: <span className="text-foreground">{cred.password}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Features */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {isLogin ? 'Welcome to ReserveX' : 'Why Join ReserveX?'}
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <ChefHat className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Premium Restaurants</p>
                    <p className="text-sm text-muted-foreground">
                      Access to 10+ top-rated restaurants in Rajshahi
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Easy Reservations</p>
                    <p className="text-sm text-muted-foreground">
                      Book tables with real-time seat availability
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Reviews & Ratings</p>
                    <p className="text-sm text-muted-foreground">
                      Read reviews and share your dining experiences
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Save Favourites</p>
                    <p className="text-sm text-muted-foreground">
                      Build your list of favorite dining spots
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Location Badge */}
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center gap-3">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-semibold">Rajshahi City</p>
                  <p className="text-sm text-muted-foreground">Bangladesh's Premium Dining Hub</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
