import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Users, Briefcase, Zap, ArrowRight, Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Users,
      title: 'Connect with Developers',
      description: 'Build meaningful connections with developers from around the world',
    },
    {
      icon: Briefcase,
      title: 'Showcase Projects',
      description: 'Display your amazing work and get feedback from the community',
    },
    {
      icon: Code2,
      title: 'Share Knowledge',
      description: 'Post updates, share insights, and learn from others',
    },
    {
      icon: Zap,
      title: 'Modern Experience',
      description: 'Enjoy a beautiful, fast, and intuitive platform designed for developers',
    },
  ];

  const stats = [
    { label: 'Active Developers', value: '10K+', icon: Users },
    { label: 'Projects Shared', value: '50K+', icon: Briefcase },
    { label: 'Lines of Code', value: '1M+', icon: Code2 },
    { label: 'Technologies', value: '500+', icon: Star },
  ];

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
        <ThemeToggle />
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Welcome back to <span className="bg-gradient-primary bg-clip-text text-transparent">DevConnect</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Continue building connections and sharing your amazing work
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="engineering" size="lg" asChild>
                <Link to="/feed">
                  <Users className="h-5 w-5 mr-2" />
                  View Feed
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/projects">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Browse Projects
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl mb-8 shadow-glass"
          >
            <Code2 className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              DevConnect
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            The modern social network designed exclusively for developers. 
            Connect, collaborate, and showcase your amazing work.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="engineering" size="lg" asChild>
              <Link to="/register">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link to="/login">
                Sign In
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <GlassCard hover="lift" className="text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for Developers, by Developers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to connect with the global developer community and grow your career.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover="lift" className="text-center h-full">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard size="lg" className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to join the community?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start connecting with developers, sharing your projects, and building your network today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="engineering" size="lg" asChild>
                <Link to="/register">
                  Create Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">
                  Already have an account?
                </Link>
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border bg-glass backdrop-blur-glass">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                DevConnect
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                <Github className="h-5 w-5" />
              </a>
              <p className="text-sm text-muted-foreground">
                Built with ❤️ for the developer community
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;