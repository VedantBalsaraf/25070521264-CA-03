
import { AuthLayout } from '../components/layout/PageWrapper';
import { LoginForm } from '../components/auth/LoginForm';
import { Package, Shield, Users, TrendingUp } from 'lucide-react';

const features = [
  { title: 'Easy Discovery', description: 'Find items shared by your campus community with smart search and filters.', icon: Package },
  { title: 'Secure Borrowing', description: 'Built-in approval system with due dates and return tracking.', icon: Shield },
  { title: 'Community Driven', description: 'Connect with students across departments and build trust scores.', icon: Users },
  { title: 'Impact Tracking', description: 'See your personal and community impact with detailed analytics.', icon: TrendingUp }
];

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your BorrowCircles account to start borrowing and sharing."
      illustration={
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl" />
            <div className="relative w-full h-full flex items-center justify-center">
              <Package size={80} className="text-primary-300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left max-w-md">
            {features.map((feature, i) => (
              <div key={feature.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                  <feature.icon size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}