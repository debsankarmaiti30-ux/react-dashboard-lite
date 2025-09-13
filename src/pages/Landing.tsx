import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  Upload, 
  Files, 
  HardDrive, 
  Users, 
  ArrowRight,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag and drop files or browse to upload. Support for all file types with instant processing."
    },
    {
      icon: Files,
      title: "File Management",
      description: "Organize, search, and manage your files with powerful tools and intuitive interface."
    },
    {
      icon: HardDrive,
      title: "Smart Storage",
      description: "Monitor usage, optimize space, and get insights into your storage patterns."
    },
    {
      icon: Users,
      title: "Community Sharing",
      description: "Share files publicly, discover community content, and collaborate seamlessly."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your files are encrypted and secure. Choose what to share and what to keep private."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed with real-time updates and instant file processing."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="FileHub" className="w-8 h-8" />
              <span className="font-bold text-xl">FileHub</span>
            </div>
            
            <div className="flex items-center gap-4">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Button onClick={() => navigate("/dashboard")}>
                      Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={() => navigate("/auth")}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Your Files,
                <span className="text-primary"> Simplified</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Upload, organize, and share your files with ease. Built for modern workflows 
                with powerful features and beautiful design.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Button size="lg" onClick={() => navigate("/dashboard")}>
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" onClick={() => navigate("/auth")}>
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button size="lg" variant="outline">
                        <Globe className="mr-2 h-5 w-5" />
                        Explore Public Files
                      </Button>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-30">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-primary/50 rotate-[30deg]" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need for file management
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to make file handling effortless
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of users who trust FileHub for their file management needs
            </p>
            
            {!isLoading && !isAuthenticated && (
              <div className="mt-8">
                <Button size="lg" onClick={() => navigate("/auth")}>
                  Start for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src="/logo.svg" alt="FileHub" className="w-6 h-6" />
              <span className="font-semibold">FileHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using modern web technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}