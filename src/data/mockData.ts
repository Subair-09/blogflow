import { BlogPost, FeatureItem, StepItem, StatItem } from '../types';

export const STATS_DATA: StatItem[] = [
  {
    value: '10K+',
    label: 'Articles Published',
    sublabel: 'Across 40+ languages and niches',
    iconName: 'FileText',
  },
  {
    value: '5K+',
    label: 'Active Writers',
    sublabel: 'Engineers, founders & thought leaders',
    iconName: 'Users',
  },
  {
    value: '50K+',
    label: 'Monthly Readers',
    sublabel: 'Global engaged audience reach',
    iconName: 'Globe',
  },
  {
    value: '99.9%',
    label: 'Platform Uptime',
    sublabel: 'Ultra-fast global edge CDN',
    iconName: 'ShieldCheck',
  },
];

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'create-edit',
    title: 'Create & Edit Posts',
    description: 'Write and format beautiful articles with ease using our distraction-free markdown and rich-text editor.',
    iconName: 'PenTool',
    badge: 'Pro Editor',
    accentColor: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'publish-instantly',
    title: 'Publish Instantly',
    description: 'Publish your content and make it available to your audience instantly with automated edge cache purging.',
    iconName: 'Zap',
    badge: 'Real-time CDN',
    accentColor: 'from-violet-500 to-purple-600',
  },
  {
    id: 'comment-management',
    title: 'Comment Management',
    description: 'Engage with your readers and manage discussions with built-in spam protection and rich thread replies.',
    iconName: 'MessageSquare',
    badge: 'Community',
    accentColor: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'powerful-search',
    title: 'Powerful Search',
    description: 'Help readers quickly discover relevant content with sub-millisecond semantic search and smart tagging.',
    iconName: 'Search',
    badge: 'Instant Index',
    accentColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Track views, engagement, reading depth, and content performance in real-time with zero cookies needed.',
    iconName: 'BarChart3',
    badge: 'Privacy-first',
    accentColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Manage authors, editors, subscribers, and platform permissions with role-based access control.',
    iconName: 'Users',
    badge: 'Team Roles',
    accentColor: 'from-rose-500 to-pink-600',
  },
];

export const HOW_IT_WORKS_DATA: StepItem[] = [
  {
    number: '01',
    title: 'Create',
    description: 'Write your article using the powerful editor.',
    detail: 'Harness a distraction-free environment equipped with instant markdown support, syntax highlighting, media embeds, and auto-saving drafts.',
    iconName: 'Edit3',
  },
  {
    number: '02',
    title: 'Publish',
    description: 'Publish your content with one click.',
    detail: 'Push live in milliseconds. BlogFlow distributes your content to global edge servers, generates automatic SEO metadata, and notifies your subscriber list.',
    iconName: 'Send',
  },
  {
    number: '03',
    title: 'Grow',
    description: 'Build an audience and track your performance.',
    detail: 'Turn casual readers into dedicated members. Monitor detailed reading stats, curate newsletter digests, and foster active discussions.',
    iconName: 'TrendingUp',
  },
];

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Next Era of Web Interfaces: Micro-Interactions & Intent-Driven UI',
    slug: 'next-era-web-interfaces',
    category: 'Technology',
    excerpt: 'Explore how fluid physics, predictive micro-interactions, and AI-assisted design tokens are reshaping how users interact with modern software.',
    content: `
Modern user interfaces are transitioning from static component hierarchies into dynamic, intent-aware environments. Rather than requiring users to manually navigate multiple layers of menus, contemporary systems anticipate intent through fluid physics and adaptive layouts.

### 1. The Physics of Motion in High-End Applications
When designing interactive feedback, linear transitions often feel mechanical and disconnected. Implementing cubic-bezier dampening curves or spring physics provides an organic feel that mirrors natural physical objects.

\`\`\`typescript
const springConfig = {
  stiffness: 400,
  damping: 30,
  mass: 0.8
};
\`\`\`

### 2. Predictive State & Instantaneous Feedback
User delight stems from latency reduction. By optimistically updating state while background operations synchronize with edge caches, applications achieve perceptible zero-latency responses.

### 3. Key Takeaways for Builders
- Prioritize clear optical hierarchy over decorative clutter.
- Maintain consistent spatial token scales across breakpoints.
- Ensure all interactive touch targets meet accessibility standards.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Elena Vance',
      role: 'Staff Product Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
    publishedAt: 'May 14, 2026',
    readTime: '5 min read',
    views: 3420,
    likes: 248,
    commentsCount: 38,
    tags: ['Design Systems', 'Frontend', 'TypeScript', 'UI/UX'],
  },
  {
    id: 'post-2',
    title: 'Building a Resilient Founder Mindset in the Age of Autonomous Software',
    slug: 'building-resilient-founder-mindset',
    category: 'Business',
    excerpt: 'How early-stage startups can establish sustainable operating velocity, clear distribution moats, and lean team architectures in competitive markets.',
    content: `
Starting a company has never been faster, yet achieving sustained longevity requires strategic clarity and disciplined execution. In this comprehensive guide, we dissect the mental models and distribution engines that propel successful modern ventures.

### The Power of Asymmetric Distribution
Product excellence is table stakes. The enduring competitive advantage of 2026 startups lies in owning direct reader relationships through quality editorial blogs and niche communities.

> "A great product without an engaged audience is like a lighthouse in the desert. Build your audience where your expertise shines naturally."

### Operational Velocity Metrics
- **Cycle Time**: From idea conception to production deployment in hours, not weeks.
- **Feedback Loops**: Direct dialogue with power users via interactive community posts.
- **Unit Economics**: Sustainable revenue models supported by high-retention content.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Marcus Chen',
      role: 'Venture Partner & Tech Essayist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    },
    publishedAt: 'May 10, 2026',
    readTime: '7 min read',
    views: 4890,
    likes: 412,
    commentsCount: 54,
    tags: ['Startups', 'Leadership', 'Distribution', 'Strategy'],
  },
  {
    id: 'post-3',
    title: 'The Art of Deep Focus: Designing an Unhurried Creative Routine',
    slug: 'art-of-deep-focus',
    category: 'Lifestyle',
    excerpt: 'Practical habits and spatial routines for authors, designers, and knowledge workers striving for clarity in an age of constant notification noise.',
    content: `
In an economy dominated by hyper-connected communication channels, sustained cognitive focus is one of the rarest and most valuable skills. Designing your workspace and daily rhythms for intentional solitude unlocks extraordinary creative output.

### 1. Asynchronous Boundaries
Batching communication into dedicated 45-minute windows prevents cognitive context fragmentation. When writing long-form essays, turning off passive notification feeds creates the mental space needed for synthesis.

### 2. The Multi-Sensory Writing Space
- **Lighting**: Soft 3000K indirect ambient light to minimize eye strain.
- **Physical Tools**: A clean desk with only a physical notebook and a high-refresh display.
- **Sound Architecture**: Low-tempo ambient textures or brown noise.

### Summary
Protecting your morning hours for deep, uninterrupted creative synthesis is not a luxury—it is the foundational pillar of meaningful work.
    `,
    featuredImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Sophia Laurent',
      role: 'Creative Director & Author',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    },
    publishedAt: 'May 06, 2026',
    readTime: '4 min read',
    views: 2150,
    likes: 195,
    commentsCount: 22,
    tags: ['Productivity', 'Mindset', 'Creativity', 'Writing'],
  },
];

export const RECENT_DASHBOARD_POSTS = [
  {
    id: 'rec-1',
    title: 'The Architecture of Scalable UI Systems in 2026',
    status: 'Published',
    date: '2 hours ago',
    reads: '1,248',
    category: 'Tech',
  },
  {
    id: 'rec-2',
    title: 'Why Editorial Content is the Best Growth Channel',
    status: 'Scheduled',
    date: 'Tomorrow, 9:00 AM',
    reads: '—',
    category: 'Growth',
  },
  {
    id: 'rec-3',
    title: 'Essential Guidelines for Fluid Micro-Animations',
    status: 'Draft',
    date: 'Edited 15m ago',
    reads: '—',
    category: 'Design',
  },
];
