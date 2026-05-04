import { Outlet } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-surface-dark">
      {/* Left Side - Hero/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-dark-1 border-r border-surface-dark-2 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 w-full flex flex-col justify-between p-12">
          <Logo size="lg" />

          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold font-display leading-tight text-white">
              Intelligent <br />
              <span className="text-primary-500">Resource</span> Management
            </h1>
            <p className="text-lg text-text-secondary max-w-md leading-relaxed">
              Streamline your HR operations with our AI-powered platform.
              Automate payroll, track attendance, and manage talent effortlessly.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-text-tertiary">
            <span>v2.0.0-INDUSTRIAL</span>
            <span className="w-1 h-1 rounded-full bg-surface-dark-3" />
            <span>SYSTEM_ONLINE</span>
            <span className="flex-1" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 h-4 bg-primary-500/20 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent lg:hidden" />

        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="md" />
          </div>
          <Outlet />
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} SmartHR AI. Protected System.
        </div>
      </div>
    </div>
  );
}
