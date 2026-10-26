
import { AuthLayout } from '../components/layout/PageWrapper';
import { SignupForm } from '../components/auth/SignupForm';
import { Package, Users, TrendingUp, Leaf, Recycle } from 'lucide-react';

const benefits = [
  { title: 'Save Money', description: 'Borrow instead of buying. Students save an average of ₹15,000 per semester.', icon: Leaf },
  { title: 'Reduce Waste', description: 'Every shared item prevents manufacturing waste and reduces carbon footprint.', icon: Recycle },
  { title: 'Build Community', description: 'Connect with peers across departments. Build your reputation with trust scores.', icon: Users },
  { title: 'Track Impact', description: 'Personal dashboard showing money saved, CO₂ reduced, and community contribution.', icon: TrendingUp }
];

export function SignupPage() {
  return (
    <AuthLayout
      title="Join BorrowCircles"
      subtitle="Create your free account and start sharing with your campus community."
      illustration={
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl" />
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative">
                <Package size={80} className="text-primary-300" />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-success-500 rounded-full flex items-center justify-center">
                  <Leaf size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left max-w-md">
            {benefits.map((benefit, i) => (
              <div key={benefit.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                  <benefit.icon size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{benefit.title}</p>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}