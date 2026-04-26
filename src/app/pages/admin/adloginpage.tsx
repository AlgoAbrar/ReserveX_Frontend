import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChefHat } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error('All fields are required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const user = await login(formData.email, formData.password);

      // ✅ Role check
      if (user.role !== 'admin') {
        toast.error('Access denied: Admins only');
        return;
      }

      toast.success('Welcome Admin!');
      navigate('/admin/dashboard');

    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <ChefHat className="h-10 w-10 text-primary mb-2" />
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Access ReserveX Admin Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-primary hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </Card>
    </div>
  );
}