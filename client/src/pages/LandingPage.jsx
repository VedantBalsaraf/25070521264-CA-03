import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useItems } from '../context';
import { cn } from '../utils/formatters';

import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import StrokeText from '../components/ui/StrokeText';
import ParticleText from '../components/ui/ParticleText';
import CrystalizedBall from '../components/ui/CrystalizedBall';
import GlassIcons from '../components/ui/GlassIcons';
import { ItemGrid } from '../components/items';
import { getCommunityStats } from '../services/impactService';
import { Search, Package, TrendingUp, Shield, Users, Leaf, ArrowRight, Camera, Cpu, Wrench, Calculator, BookOpen, Briefcase } from 'lucide-react';

const categoryIcons = {
  Books: BookOpen,
  Electronics: Cpu,
  Tools: Wrench,
  Cameras: Camera,
  Calculators: Calculator,
  'Project Equipment': Briefcase,
  Other: Package
};

const stats = [
  { key: 'itemsShared', label: 'Items Shared', icon: Package, color: 'text-primary-600', bg: 'bg-primary-100' },
  { key: 'activeBorrows', label: 'Active Borrows', icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-100' },
  { key: 'studentsConnected', label: 'Students Connected', icon: Users, color: 'text-secondary-600', bg: 'bg-secondary-100' },
  { key: 'itemsReused', label: 'Items Reused', icon: Leaf, color: 'text-warning-600', bg: 'bg-warning-100' }
];

const features = [
  { title: 'Easy Discovery', description: 'Search and filter items by category, condition, location, and availability.', icon: Search },
  { title: 'Secure Borrowing', description: 'Built-in request approval system with due dates and return confirmation.', icon: Shield },
  { title: 'Impact Tracking', description: 'See your personal and community impact with detailed analytics.', icon: TrendingUp },
  { title: 'Campus Community', description: 'Connect with fellow students across departments and years.', icon: Users }
];

const steps = [
  { number: '01', title: 'Find What You Need', description: 'Browse items shared by your campus community. Filter by category, condition, and location.' },
  { number: '02', title: 'Request to Borrow', description: 'Send a borrow request with your preferred dates. The owner gets notified instantly.' },
  { number: '03', title: 'Pick Up & Return', description: 'Coordinate pickup with the owner. Return on time to build your trust score.' }
];

const testimonials = [
  { content: 'BorrowCircles saved me ₹15,000 on textbooks and equipment last semester. The community is amazing!', author: 'Priya Sharma', role: 'CSE Year 3', avatar: 'PS' },
  { content: 'I shared my DSLR camera and it\'s been borrowed 12 times. Love seeing others benefit from items I rarely use.', author: 'Arjun Patel', role: 'ECE Year 4', avatar: 'AP' },
  { content: 'The impact dashboard shows exactly how much waste we\'re preventing. It feels great to be part of this movement.', author: 'Sneha Reddy', role: 'Mech Year 2', avatar: 'SR' }
];

export function LandingPage() {
  const { featuredItems } = useItems();
  const navigate = useNavigate();
  const [communityStats, setCommunityStats] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCommunityStats()
      .then(data => { if (!cancelled) setCommunityStats(data); })
      .catch(() => { if (!cancelled) setCommunityStats({}); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('.landing-page section.section');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    sections.forEach(section => {
      section.classList.add('reveal-on-scroll');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <ParticleText
            text="BorrowCircles"
            particleSize={3}
            density={4}
            color="#33204f"
            highlightColor="#b932c7"
            intro="gather"
            scatter={110}
            gatherDuration={1300}
            stagger={180}
            clickBurst
            burstStrength={0.65}
            pointerRepel={22}
            repelRadius={100}
            idleDrift={0.14}
            trigger="hover"
            fontSize="clamp(4rem, 8vw, 8rem)"
            fontWeight={800}
            fontFamily="inherit"
            align="left"
            glow
            className="landing-particle-brand"
            style={{ width: '100%', height: 'clamp(140px, 15vw, 190px)', minHeight: '0', color: '#33204f' }}
          />
          <div className="hero-content">
            <h1 id="hero-title" className="hero-title">
              <StrokeText
                text="Share More, Buy Less"
                strokeColor="#A78BFA"
                strokeStyle="solid"
                strokeWidth={1.4}
                dashLength={10}
                drawDuration={1.6}
                fillDelay={0.2}
                stagger={0.05}
                ease="power2.out"
                trigger="mount"
                fillMode="wipe"
                wipeFrom="left"
                fontSize={82}
                fontWeight={800}
                letterSpacing={-3}
                marching={false}
                hoverRedraw
                shadow={false}
                fillColor="#30284a"
                className="hero-stroke-title"
              />
            </h1>
            <p className="hero-description">
              BorrowCircles connects students to share rarely used items — books, cameras, tools, and more.
              Save money, reduce waste, and build community.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link to="/explore" className="btn btn-outline btn-lg">
                Explore Items
              </Link>
            </div>

          </div>

          <div className="hero-visual hero-crystal-stage">
            <CrystalizedBall
              preset="plasma"
              color="#F25BD0"
              size={0.7}
              crackle={0.85}
              fill={0.5}
              interactive
              hoverStrength={0.7}
            />
          </div>
        </div>
      </section>

      <section className="landing-impact-strip section" aria-label="BorrowCircles community impact">
        <div className="container">
          <div className="hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat stagger-container">
                <div className="flex items-center gap-3">
                  <div className={cn('p-3 rounded-xl', stat.bg)}>
                    <stat.icon className={cn(stat.color, 'text-2xl')} size={28} />
                  </div>
                  <div>
                    <div className="hero-stat-value">
                      {communityStats ? Number(communityStats[stat.key] || 0).toLocaleString() : '—'}
                    </div>
                    <div className="hero-stat-label">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="features-title">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why BorrowCircles?</span>
            <h2 id="features-title" className="section-title">Everything you need to share smarter</h2>
            <p className="section-description">
              Designed for campus life with features that make borrowing and sharing effortless.
            </p>
          </div>
          <div className="feature-grid">
            {features.map((feature, i) => (
              <Card key={feature.title} className="feature-card stagger-container" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="feature-icon">
                  <feature.icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="categories-title">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Browse Categories</span>
            <h2 id="categories-title" className="section-title">Find exactly what you need</h2>
            <p className="section-description">
              From textbooks to cameras, discover items shared by your campus community.
            </p>
          </div>
          <div className="landing-glass-categories">
            <GlassIcons
              items={Object.entries(categoryIcons).map(([category, Icon], index) => ({
                id: category,
                icon: <Icon size={30} strokeWidth={1.8} />,
                color: ['purple', 'blue', 'orange', 'pink', 'indigo', 'green', 'teal'][index],
                label: category,
                onClick: () => navigate(`/explore?category=${encodeURIComponent(category)}`)
              }))}
              size={76}
              gap={34}
              columns={4}
              roundness={0.58}
              refraction={0.72}
              bevel={0.58}
              dispersion={0.08}
              frost={0.16}
              shine={0.82}
              tint="#ede7ff"
              tintOpacity={0.22}
              iconColor="#ffffff"
              plate="tilt"
              tilt={24}
              spread={0.46}
              hover="press"
              parallax={0.72}
              labels="always"
              intro
              theme="light"
              className="landing-glass-icons"
            />
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="how-it-works-title">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 id="how-it-works-title" className="section-title">Three simple steps to start sharing</h2>
            <p className="section-description">
              No complicated processes. Just find, request, and borrow.
            </p>
          </div>
          <div className="how-it-works">
            {steps.map((step, i) => (
              <div key={step.number} className="step stagger-container" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Featured Items</span>
            <h2 id="featured-title" className="section-title">Popular items available now</h2>
            <p className="section-description">
              These items are in high demand. Check them out before they're borrowed!
            </p>
          </div>
          <ItemGrid
            items={featuredItems}
            variant="featured"
            emptyMessage="No featured items available right now"
          />
          <div className="text-center mt-8">
            <Link to="/explore" className="btn btn-outline btn-lg">
              View All Items
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-gray-50" aria-labelledby="testimonials-title">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Community Stories</span>
            <h2 id="testimonials-title" className="section-title">Trusted by students across campus</h2>
            <p className="section-description">
              See what fellow students are saying about BorrowCircles.
            </p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial, i) => (
              <Card key={testimonial.author} className="testimonial-card stagger-container" style={{ animationDelay: `${i * 150}ms` }}>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <Avatar name={testimonial.author} size="lg">{testimonial.avatar}</Avatar>
                  <div className="testimonial-info">
                    <p className="testimonial-name">{testimonial.author}</p>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-primary-600 text-white" aria-labelledby="cta-title">
        <div className="container text-center">
          <h2 id="cta-title" className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to start sharing?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are saving money and reducing waste.
            Create your free account in seconds.
          </p>
          <Link to="/signup" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-10">
            Get Started Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
