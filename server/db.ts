import { MongoClient, Db, Collection, Document } from 'mongodb';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export const DEDICATED_ADMIN_EMAIL = 'nuddywale@gmail.com';
export const DEDICATED_ADMIN_PASSWORD = 'subair_@09';

export function hashPassword(password: string): string {
  const salt = 'blogflow_secure_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export interface PostDocument {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Technology' | 'Business' | 'Lifestyle';
  featuredImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  commentsCount: number;
  tags: string[];
  status?: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentDocument {
  _id?: string;
  id: string;
  postId: string;
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
  createdAt: Date;
}

export interface UserDocument {
  _id?: string;
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'author' | 'reader' | 'admin';
  avatar: string;
  createdAt: Date;
}

export interface SubscriberDocument {
  _id?: string;
  email: string;
  source?: string;
  subscribedAt: Date;
}

// Initial Sample Data for MongoDB Seeding
export const INITIAL_POSTS: Omit<PostDocument, '_id'>[] = [
  {
    id: 'post-1',
    title: 'The Next Era of Web Interfaces: Micro-Interactions & Intent-Driven UI',
    slug: 'next-era-web-interfaces',
    category: 'Technology',
    excerpt:
      'Explore how fluid physics, predictive micro-interactions, and AI-assisted design tokens are reshaping how users interact with modern software.',
    content: `Modern user interfaces are transitioning from static component hierarchies into dynamic, intent-aware environments. Rather than requiring users to manually navigate multiple layers of menus, contemporary systems anticipate intent through fluid physics and adaptive layouts.

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
- Ensure all interactive touch targets meet accessibility standards.`,
    featuredImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Elena Vance',
      role: 'Staff Product Engineer',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
    publishedAt: 'May 14, 2026',
    readTime: '5 min read',
    views: 3420,
    likes: 248,
    commentsCount: 3,
    tags: ['Design Systems', 'Frontend', 'TypeScript', 'UI/UX'],
    createdAt: new Date('2026-05-14T10:00:00Z'),
    updatedAt: new Date('2026-05-14T10:00:00Z'),
  },
  {
    id: 'post-2',
    title: 'Building a Resilient Founder Mindset in the Age of Autonomous Software',
    slug: 'building-resilient-founder-mindset',
    category: 'Business',
    excerpt:
      'How early-stage startups can establish sustainable operating velocity, clear distribution moats, and lean team architectures in competitive markets.',
    content: `Starting a company has never been faster, yet achieving sustained longevity requires strategic clarity and disciplined execution. In this comprehensive guide, we dissect the mental models and distribution engines that propel successful modern ventures.

### The Power of Asymmetric Distribution
Product excellence is table stakes. The enduring competitive advantage of 2026 startups lies in owning direct reader relationships through quality editorial blogs and niche communities.

> "A great product without an engaged audience is like a lighthouse in the desert. Build your audience where your expertise shines naturally."

### Operational Velocity Metrics
- **Cycle Time**: From idea conception to production deployment in hours, not weeks.
- **Feedback Loops**: Direct dialogue with power users via interactive community posts.
- **Unit Economics**: Sustainable revenue models supported by high-retention content.`,
    featuredImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Marcus Chen',
      role: 'Venture Partner & Tech Essayist',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    },
    publishedAt: 'May 10, 2026',
    readTime: '7 min read',
    views: 4890,
    likes: 412,
    commentsCount: 2,
    tags: ['Startups', 'Leadership', 'Distribution', 'Strategy'],
    createdAt: new Date('2026-05-10T14:30:00Z'),
    updatedAt: new Date('2026-05-10T14:30:00Z'),
  },
  {
    id: 'post-3',
    title: 'The Art of Deep Focus: Designing an Unhurried Creative Routine',
    slug: 'art-of-deep-focus',
    category: 'Lifestyle',
    excerpt:
      'Practical habits and spatial routines for authors, designers, and knowledge workers striving for clarity in an age of constant notification noise.',
    content: `In an economy dominated by hyper-connected communication channels, sustained cognitive focus is one of the rarest and most valuable skills. Designing your workspace and daily rhythms for intentional solitude unlocks extraordinary creative output.

### 1. Asynchronous Boundaries
Batching communication into dedicated 45-minute windows prevents cognitive context fragmentation. When writing long-form essays, turning off passive notification feeds creates the mental space needed for synthesis.

### 2. The Multi-Sensory Writing Space
- **Lighting**: Soft 3000K indirect ambient light to minimize eye strain.
- **Physical Tools**: A clean desk with only a physical notebook and a high-refresh display.
- **Sound Architecture**: Low-tempo ambient textures or brown noise.

### Summary
Protecting your morning hours for deep, uninterrupted creative synthesis is not a luxury—it is the foundational pillar of meaningful work.`,
    featuredImage:
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Sophia Laurent',
      role: 'Creative Director & Author',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    },
    publishedAt: 'May 06, 2026',
    readTime: '4 min read',
    views: 2150,
    likes: 195,
    commentsCount: 2,
    tags: ['Productivity', 'Mindset', 'Creativity', 'Writing'],
    createdAt: new Date('2026-05-06T09:15:00Z'),
    updatedAt: new Date('2026-05-06T09:15:00Z'),
  },
];

export const INITIAL_COMMENTS: Omit<CommentDocument, '_id'>[] = [
  {
    id: 'c-1',
    postId: 'post-1',
    author: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    timeAgo: '2 hours ago',
    content: 'The perspective on motion physics is spot on. Applying spring-based easing transforms the tactile feeling of web apps.',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
  },
  {
    id: 'c-2',
    postId: 'post-1',
    author: 'Devon Miles',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    timeAgo: '5 hours ago',
    content: 'Great breakdown on optimistic UI patterns! Really helpful for our engineering team roadmap.',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000),
  },
  {
    id: 'c-3',
    postId: 'post-1',
    author: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    timeAgo: '1 day ago',
    content: 'Would love to see a follow-up piece diving into how to structure design token variables across responsive breakpoints.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
  },
  {
    id: 'c-4',
    postId: 'post-2',
    author: 'Tariq Sterling',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
    timeAgo: '3 hours ago',
    content: 'Direct distribution through content is truly the best growth flywheel. Great insights, Marcus.',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000),
  },
  {
    id: 'c-5',
    postId: 'post-2',
    author: 'Clara Oswald',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
    timeAgo: '1 day ago',
    content: 'Focusing on cycle time velocity from day 1 is what separated our last venture from competitors.',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000),
  },
  {
    id: 'c-6',
    postId: 'post-3',
    author: 'Liam Bennett',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    timeAgo: '4 hours ago',
    content: 'Setting asynchronous boundaries for deep morning work completely cured my afternoon burnout.',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000),
  },
];

// Fallback in-memory state for resilient offline/local execution
class InMemoryDb {
  posts: PostDocument[] = [];
  comments: CommentDocument[] = [];
  users: UserDocument[] = [];
  subscribers: SubscriberDocument[] = [];

  constructor() {
    this.seed();
  }

  seed() {
    this.posts = INITIAL_POSTS.map((p, index) => ({
      ...p,
      _id: `mem_post_${index + 1}`,
    }));
    this.comments = INITIAL_COMMENTS.map((c, index) => ({
      ...c,
      _id: `mem_com_${index + 1}`,
    }));
    const adminHash = hashPassword(DEDICATED_ADMIN_PASSWORD);
    this.users = [
      {
        _id: 'mem_admin_1',
        id: 'usr-admin-1',
        name: 'Nuddy Wale',
        email: DEDICATED_ADMIN_EMAIL,
        passwordHash: adminHash,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date('2026-01-01T00:00:00Z'),
      },
    ];
    this.subscribers = [
      {
        _id: 'mem_sub_1',
        email: 'subscriber@example.com',
        source: 'cta',
        subscribedAt: new Date(),
      },
    ];
  }
}

const memoryDb = new InMemoryDb();

let mongoClient: MongoClient | null = null;
let database: Db | null = null;
let isConnected = false;
let connectionError: string | null = null;
let isConnecting = false;

function sanitizeMongoUri(rawUri: string): string {
  let uri = rawUri.trim();
  // Remove wrapping quotes if present
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1);
  }

  // Handle case where password contains unencoded '@' character
  // e.g. mongodb+srv://user:pass@word@cluster.mongodb.net/?...
  const protocolMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)/i);
  if (protocolMatch) {
    const protocol = protocolMatch[1];
    const rest = uri.slice(protocol.length);
    const lastAtIndex = rest.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const authPart = rest.slice(0, lastAtIndex);
      const hostPart = rest.slice(lastAtIndex + 1);
      const firstColonIndex = authPart.indexOf(':');
      if (firstColonIndex !== -1) {
        const username = authPart.slice(0, firstColonIndex);
        let rawPassword = authPart.slice(firstColonIndex + 1);
        
        // If password has raw unencoded special characters like '@', encode them
        if (rawPassword.includes('@') && !rawPassword.includes('%40')) {
          rawPassword = rawPassword.replace(/@/g, '%40');
        }
        return `${protocol}${encodeURIComponent(decodeURIComponent(username))}:${rawPassword.includes('%') ? rawPassword : encodeURIComponent(rawPassword)}@${hostPart}`;
      }
    }
  }
  return uri;
}

export async function getMongoDb(): Promise<{ db: Db | null; isUsingMemoryFallback: boolean; error: string | null }> {
  const rawUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'blogflow';

  if (!rawUri || !rawUri.trim()) {
    return { db: null, isUsingMemoryFallback: true, error: 'MONGODB_URI not configured. Using local in-memory document store.' };
  }

  const uri = sanitizeMongoUri(rawUri);

  if (database && isConnected) {
    return { db: database, isUsingMemoryFallback: false, error: null };
  }

  if (isConnecting) {
    // Wait briefly if connection is in-flight
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (database && isConnected) {
      return { db: database, isUsingMemoryFallback: false, error: null };
    }
  }

  try {
    isConnecting = true;
    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    await mongoClient.connect();
    database = mongoClient.db(dbName);
    isConnected = true;
    connectionError = null;
    isConnecting = false;

    // Seed database if empty
    await seedMongoDatabase(database);

    return { db: database, isUsingMemoryFallback: false, error: null };
  } catch (err: any) {
    isConnecting = false;
    isConnected = false;
    connectionError = err.message || 'Failed to connect to MongoDB';
    console.warn(`[MongoDB Warning] Could not connect to MongoDB cluster: ${connectionError}. Active fallback to in-memory store.`);
    return { db: null, isUsingMemoryFallback: true, error: connectionError };
  }
}

async function seedMongoDatabase(db: Db) {
  try {
    const postsCount = await db.collection('posts').countDocuments();
    if (postsCount === 0) {
      console.log('[MongoDB] Seeding initial posts into collection "posts"...');
      await db.collection('posts').insertMany(INITIAL_POSTS.map(p => ({ ...p })));
      await db.collection('posts').createIndex({ slug: 1 }, { unique: true });
      await db.collection('posts').createIndex({ category: 1 });
      await db.collection('posts').createIndex({ createdAt: -1 });
    }

    const commentsCount = await db.collection('comments').countDocuments();
    if (commentsCount === 0) {
      console.log('[MongoDB] Seeding initial comments into collection "comments"...');
      await db.collection('comments').insertMany(INITIAL_COMMENTS.map(c => ({ ...c })));
      await db.collection('comments').createIndex({ postId: 1 });
      await db.collection('comments').createIndex({ createdAt: -1 });
    }

    const subscribersCount = await db.collection('subscribers').countDocuments();
    if (subscribersCount === 0) {
      await db.collection('subscribers').createIndex({ email: 1 }, { unique: true });
    }

    // Ensure users collection index and remove any legacy mock user records
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').deleteMany({
      $or: [
        { email: 'elena@blogflow.io' },
        { id: 'usr-1' }
      ]
    });

    // Seed or update dedicated admin account (nuddywale@gmail.com) with password subair_@09
    const adminHash = hashPassword(DEDICATED_ADMIN_PASSWORD);
    await db.collection<UserDocument>('users').updateOne(
      { email: DEDICATED_ADMIN_EMAIL },
      {
        $set: {
          name: 'Nuddy Wale',
          email: DEDICATED_ADMIN_EMAIL,
          passwordHash: adminHash,
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        },
        $setOnInsert: {
          id: 'usr-admin-1',
          createdAt: new Date(),
        }
      },
      { upsert: true }
    );

    // Demote any other users with 'admin' role, strictly ensuring nuddywale@gmail.com is the ONLY admin
    await db.collection('users').updateMany(
      { email: { $ne: DEDICATED_ADMIN_EMAIL }, role: 'admin' },
      { $set: { role: 'author' } }
    );
  } catch (err) {
    console.error('[MongoDB] Error during collection index/seeding setup:', err);
  }
}

export async function getDbStatus() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'blogflow';
  const maskedUri = uri ? uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:••••••@') : null;

  // Extract hostname for user display
  let hostName: string | null = null;
  if (uri) {
    const hostMatch = uri.match(/@([^/?]+)/);
    if (hostMatch) {
      hostName = hostMatch[1];
    }
  }

  const { db, isUsingMemoryFallback, error } = await getMongoDb();

  if (db && !isUsingMemoryFallback) {
    try {
      const startTime = Date.now();
      await db.command({ ping: 1 });
      const pingMs = Date.now() - startTime;

      const postsCount = await db.collection('posts').countDocuments();
      const commentsCount = await db.collection('comments').countDocuments();
      const usersCount = await db.collection('users').countDocuments();
      const subscribersCount = await db.collection('subscribers').countDocuments();

      return {
        connected: true,
        isUsingMemoryFallback: false,
        driver: 'Official MongoDB Node.js Driver v7',
        databaseName: dbName,
        host: hostName || 'MongoDB Atlas Cluster',
        clusterType: hostName?.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'MongoDB Server',
        pingMs,
        uri: maskedUri,
        collections: {
          posts: postsCount,
          comments: commentsCount,
          users: usersCount,
          subscribers: subscribersCount,
        },
        error: null,
      };
    } catch (e: any) {
      return {
        connected: false,
        isUsingMemoryFallback: true,
        driver: 'In-Memory Fallback',
        databaseName: dbName,
        host: hostName,
        clusterType: 'Local Fallback',
        pingMs: null,
        uri: maskedUri,
        collections: {
          posts: memoryDb.posts.length,
          comments: memoryDb.comments.length,
          users: memoryDb.users.length,
          subscribers: memoryDb.subscribers.length,
        },
        error: e.message,
      };
    }
  }

  return {
    connected: false,
    isUsingMemoryFallback: true,
    driver: 'In-Memory Fallback Document Store',
    databaseName: dbName,
    host: hostName,
    clusterType: 'Local In-Memory Cache',
    pingMs: null,
    uri: maskedUri,
    collections: {
      posts: memoryDb.posts.length,
      comments: memoryDb.comments.length,
      users: memoryDb.users.length,
      subscribers: memoryDb.subscribers.length,
    },
    error: error || 'MONGODB_URI environment variable not configured',
  };
}

// -------------------------------------------------------------
// POST CRUD Operations
// -------------------------------------------------------------

export async function getAllPosts(filter?: { category?: string; query?: string; status?: string; includeDrafts?: boolean }): Promise<PostDocument[]> {
  const { db, isUsingMemoryFallback } = await getMongoDb();

  if (db && !isUsingMemoryFallback) {
    const query: any = {};
    if (filter?.category && filter.category !== 'All') {
      query.category = filter.category;
    }
    if (filter?.status && filter.status !== 'all') {
      query.status = filter.status;
    } else if (!filter?.includeDrafts) {
      // By default in public view, show only published (or posts with undefined status)
      query.status = { $ne: 'draft' };
    }

    if (filter?.query && filter.query.trim()) {
      const q = filter.query.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { 'author.name': { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    const posts = await db.collection<PostDocument>('posts')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return posts;
  }

  // Memory fallback
  let posts = [...memoryDb.posts];
  if (filter?.category && filter.category !== 'All') {
    posts = posts.filter(p => p.category === filter.category);
  }
  if (filter?.status && filter.status !== 'all') {
    posts = posts.filter(p => (p.status || 'published') === filter.status);
  } else if (!filter?.includeDrafts) {
    posts = posts.filter(p => p.status !== 'draft');
  }

  if (filter?.query && filter.query.trim()) {
    const q = filter.query.trim().toLowerCase();
    posts = posts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPostByIdOrSlug(idOrSlug: string, incrementViews = false): Promise<PostDocument | null> {
  const { db, isUsingMemoryFallback } = await getMongoDb();

  if (db && !isUsingMemoryFallback) {
    const post = await db.collection<PostDocument>('posts').findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }, { _id: idOrSlug as any }],
    });

    if (post && incrementViews) {
      await db.collection('posts').updateOne(
        { id: post.id },
        { $inc: { views: 1 } }
      );
      post.views += 1;
    }

    return post;
  }

  // Memory fallback
  const post = memoryDb.posts.find(p => p.id === idOrSlug || p.slug === idOrSlug || p._id === idOrSlug);
  if (post && incrementViews) {
    post.views += 1;
  }
  return post || null;
}

export async function createPost(postInput: Partial<PostDocument>): Promise<PostDocument> {
  const { db, isUsingMemoryFallback } = await getMongoDb();

  const id = `post-${Date.now()}`;
  const slug = (postInput.title || 'article')
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

  const newPost: PostDocument = {
    id,
    title: postInput.title || 'Untitled Post',
    slug,
    excerpt: postInput.excerpt || (postInput.content ? postInput.content.substring(0, 160) + '...' : 'A new article on BlogFlow.'),
    content: postInput.content || '',
    category: postInput.category || 'Technology',
    featuredImage:
      postInput.featuredImage ||
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    author: postInput.author || {
      name: 'Community Author',
      role: 'Staff Writer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    },
    publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: `${Math.max(1, Math.ceil((postInput.content || '').split(' ').length / 180))} min read`,
    views: 1,
    likes: 0,
    commentsCount: 0,
    tags: postInput.tags && postInput.tags.length > 0 ? postInput.tags : ['Publishing', 'Tech'],
    status: postInput.status || 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (db && !isUsingMemoryFallback) {
    const result = await db.collection<PostDocument>('posts').insertOne({ ...newPost });
    newPost._id = result.insertedId.toString();
    return newPost;
  }

  // Memory fallback
  newPost._id = `mem_post_${Date.now()}`;
  memoryDb.posts.unshift(newPost);
  return newPost;
}

export async function updatePost(idOrSlug: string, postInput: Partial<PostDocument>): Promise<PostDocument | null> {
  const { db, isUsingMemoryFallback } = await getMongoDb();

  const updates: any = {
    updatedAt: new Date(),
  };

  if (postInput.title !== undefined) {
    updates.title = postInput.title;
    updates.slug = postInput.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  if (postInput.excerpt !== undefined) updates.excerpt = postInput.excerpt;
  if (postInput.content !== undefined) {
    updates.content = postInput.content;
    updates.readTime = `${Math.max(1, Math.ceil(postInput.content.split(' ').length / 180))} min read`;
  }
  if (postInput.category !== undefined) updates.category = postInput.category;
  if (postInput.featuredImage !== undefined) updates.featuredImage = postInput.featuredImage;
  if (postInput.tags !== undefined) updates.tags = postInput.tags;
  if (postInput.status !== undefined) updates.status = postInput.status;
  if (postInput.author !== undefined) updates.author = postInput.author;

  if (db && !isUsingMemoryFallback) {
    const res = await db.collection<PostDocument>('posts').findOneAndUpdate(
      { $or: [{ id: idOrSlug }, { slug: idOrSlug }] },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return res || null;
  }

  // Memory fallback
  const index = memoryDb.posts.findIndex(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (index === -1) return null;
  memoryDb.posts[index] = {
    ...memoryDb.posts[index],
    ...updates,
  };
  return memoryDb.posts[index];
}

export async function deletePost(idOrSlug: string): Promise<{ success: boolean; deletedCount: number }> {
  const { db, isUsingMemoryFallback } = await getMongoDb();

  if (db && !isUsingMemoryFallback) {
    // Delete post and associated comments
    const res = await db.collection<PostDocument>('posts').deleteOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
    await db.collection('comments').deleteMany({ postId: idOrSlug });
    return { success: res.deletedCount > 0, deletedCount: res.deletedCount };
  }

  // Memory fallback
  const initialLength = memoryDb.posts.length;
  memoryDb.posts = memoryDb.posts.filter(p => p.id !== idOrSlug && p.slug !== idOrSlug);
  memoryDb.comments = memoryDb.comments.filter(c => c.postId !== idOrSlug);
  const deletedCount = initialLength - memoryDb.posts.length;
  return { success: deletedCount > 0, deletedCount };
}

export async function togglePublishPost(idOrSlug: string, explicitStatus?: 'published' | 'draft'): Promise<PostDocument | null> {
  const post = await getPostByIdOrSlug(idOrSlug);
  if (!post) return null;

  const currentStatus = post.status || 'published';
  const newStatus = explicitStatus || (currentStatus === 'published' ? 'draft' : 'published');

  return await updatePost(idOrSlug, { status: newStatus });
}

export async function likePost(idOrSlug: string): Promise<{ likes: number } | null> {
  const { db, isUsingMemoryFallback } = await getMongoDb();

  if (db && !isUsingMemoryFallback) {
    const post = await db.collection<PostDocument>('posts').findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
    if (!post) return null;

    await db.collection('posts').updateOne(
      { id: post.id },
      { $inc: { likes: 1 } }
    );

    return { likes: post.likes + 1 };
  }

  // Memory fallback
  const post = memoryDb.posts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!post) return null;
  post.likes += 1;
  return { likes: post.likes };
}

// -------------------------------------------------------------
// COMMENT Operations
// -------------------------------------------------------------

export async function getCommentsByPostId(postId: string): Promise<CommentDocument[]> {
  const { db, isUsingMemoryFallback } = await getMongoDb();

  if (db && !isUsingMemoryFallback) {
    return await db.collection<CommentDocument>('comments')
      .find({ postId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  return memoryDb.comments
    .filter(c => c.postId === postId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addComment(postId: string, commentInput: { author?: string; avatar?: string; content: string }): Promise<CommentDocument> {
  const { db, isUsingMemoryFallback } = await getMongoDb();

  const newComment: CommentDocument = {
    id: `com-${Date.now()}`,
    postId,
    author: commentInput.author || 'Guest Reader',
    avatar:
      commentInput.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    timeAgo: 'Just now',
    content: commentInput.content,
    createdAt: new Date(),
  };

  if (db && !isUsingMemoryFallback) {
    const res = await db.collection<CommentDocument>('comments').insertOne({ ...newComment });
    newComment._id = res.insertedId.toString();

    // Increment post comment counter
    await db.collection('posts').updateOne(
      { $or: [{ id: postId }, { slug: postId }] },
      { $inc: { commentsCount: 1 } }
    );

    return newComment;
  }

  // Memory fallback
  newComment._id = `mem_com_${Date.now()}`;
  memoryDb.comments.unshift(newComment);

  const post = memoryDb.posts.find(p => p.id === postId || p.slug === postId);
  if (post) {
    post.commentsCount += 1;
  }

  return newComment;
}

// -------------------------------------------------------------
// USER & SUBSCRIBER Operations
// -------------------------------------------------------------

export async function registerUser(userData: { name: string; email: string; password?: string }): Promise<UserDocument> {
  const { db, isUsingMemoryFallback } = await getMongoDb();
  const cleanEmail = userData.email.toLowerCase().trim();
  const cleanName = userData.name.trim();

  if (!cleanName) {
    throw new Error('Full name is required to sign up.');
  }

  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('A valid email address is required.');
  }

  if (!userData.password || userData.password.length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  const passwordHash = hashPassword(userData.password);

  // Strictly enforce that ONLY nuddywale@gmail.com is the admin of this system
  const userRole: 'author' | 'reader' | 'admin' = cleanEmail === DEDICATED_ADMIN_EMAIL ? 'admin' : 'author';

  const newUser: UserDocument = {
    id: cleanEmail === DEDICATED_ADMIN_EMAIL ? 'usr-admin-1' : `usr-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    role: userRole,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
    createdAt: new Date(),
  };

  if (db && !isUsingMemoryFallback) {
    const existing = await db.collection<UserDocument>('users').findOne({ email: cleanEmail });
    if (existing) {
      throw new Error('An account with this email already exists. Please log in instead.');
    }
    const res = await db.collection<UserDocument>('users').insertOne({ ...newUser });
    newUser._id = res.insertedId.toString();
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser as UserDocument;
  }

  const existing = memoryDb.users.find(u => u.email === cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists. Please log in instead.');
  }
  newUser._id = cleanEmail === DEDICATED_ADMIN_EMAIL ? 'mem_admin_1' : `mem_usr_${Date.now()}`;
  memoryDb.users.push(newUser);
  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser as UserDocument;
}

export async function authenticateUser(email: string, password?: string): Promise<UserDocument> {
  const { db, isUsingMemoryFallback } = await getMongoDb();
  const cleanEmail = email.toLowerCase().trim();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password) {
    throw new Error('Password is required to log in.');
  }

  let user: UserDocument | null = null;

  if (db && !isUsingMemoryFallback) {
    user = await db.collection<UserDocument>('users').findOne({ email: cleanEmail });
  } else {
    user = memoryDb.users.find(u => u.email === cleanEmail) || null;
  }

  // If this is the dedicated admin email, initialize if not found
  if (!user && cleanEmail === DEDICATED_ADMIN_EMAIL) {
    const adminHash = hashPassword(DEDICATED_ADMIN_PASSWORD);
    const adminUser: UserDocument = {
      id: 'usr-admin-1',
      name: 'Nuddy Wale',
      email: DEDICATED_ADMIN_EMAIL,
      passwordHash: adminHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date(),
    };
    if (db && !isUsingMemoryFallback) {
      const res = await db.collection<UserDocument>('users').insertOne({ ...adminUser });
      adminUser._id = res.insertedId.toString();
    } else {
      adminUser._id = 'mem_admin_1';
      memoryDb.users.push(adminUser);
    }
    user = adminUser;
  }

  // ONLY people who sign up or the seeded admin are allowed to log in!
  if (!user) {
    throw new Error('No account found with this email. Only registered users can log in. Please create an account first.');
  }

  // Verify password
  if (cleanEmail === DEDICATED_ADMIN_EMAIL) {
    const isDirectMatch = password === DEDICATED_ADMIN_PASSWORD;
    const isHashMatch = user.passwordHash ? verifyPassword(password, user.passwordHash) : false;
    if (!isDirectMatch && !isHashMatch) {
      throw new Error('Invalid password for admin account (nuddywale@gmail.com). Please verify your password and try again.');
    }
    // Update hash to match DEDICATED_ADMIN_PASSWORD if needed
    if (isDirectMatch && (!user.passwordHash || !isHashMatch)) {
      const updatedHash = hashPassword(DEDICATED_ADMIN_PASSWORD);
      user.passwordHash = updatedHash;
      if (db && !isUsingMemoryFallback) {
        await db.collection('users').updateOne({ email: cleanEmail }, { $set: { passwordHash: updatedHash, role: 'admin' } });
      }
    }
    user.role = 'admin';
  } else {
    if (user.passwordHash) {
      const isMatch = verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        throw new Error('Invalid password. Please check your credentials and try again.');
      }
    }
    // Demote any non-admin email if it somehow had admin role
    if (user.role === 'admin') {
      user.role = 'author';
      if (db && !isUsingMemoryFallback) {
        await db.collection('users').updateOne({ email: cleanEmail }, { $set: { role: 'author' } });
      }
    }
  }

  // Ensure admin role for platform owner
  if (cleanEmail === DEDICATED_ADMIN_EMAIL && user.role !== 'admin') {
    user.role = 'admin';
    if (db && !isUsingMemoryFallback) {
      await db.collection('users').updateOne({ email: cleanEmail }, { $set: { role: 'admin' } });
    }
  }

  const { passwordHash: _, ...safeUser } = user;
  return safeUser as UserDocument;
}


export async function addSubscriber(email: string, source = 'newsletter'): Promise<{ success: boolean; message: string }> {
  const { db, isUsingMemoryFallback } = await getMongoDb();
  const cleanEmail = email.toLowerCase();

  if (db && !isUsingMemoryFallback) {
    try {
      await db.collection('subscribers').updateOne(
        { email: cleanEmail },
        { $setOnInsert: { email: cleanEmail, source, subscribedAt: new Date() } },
        { upsert: true }
      );
      return { success: true, message: 'Subscribed successfully in MongoDB subscribers collection' };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  const existing = memoryDb.subscribers.find(s => s.email === cleanEmail);
  if (!existing) {
    memoryDb.subscribers.push({
      _id: `mem_sub_${Date.now()}`,
      email: cleanEmail,
      source,
      subscribedAt: new Date(),
    });
  }
  return { success: true, message: 'Subscribed in local document cache' };
}

// -------------------------------------------------------------
// LIVE STATS
// -------------------------------------------------------------

export async function getLiveStats() {
  const { db, isUsingMemoryFallback } = await getMongoDb();

  if (db && !isUsingMemoryFallback) {
    const postsCount = await db.collection('posts').countDocuments();
    const usersCount = await db.collection('users').countDocuments();
    const subscribersCount = await db.collection('subscribers').countDocuments();

    const aggregateViews = await db.collection('posts').aggregate<{ _id: null; totalViews: number; totalLikes: number }>([
      { $group: { _id: null, totalViews: { $sum: '$views' }, totalLikes: { $sum: '$likes' } } },
    ]).toArray();

    const totalViews = aggregateViews[0]?.totalViews || 10460;

    return [
      {
        value: `${postsCount >= 1000 ? `${(postsCount / 1000).toFixed(1)}K+` : `${postsCount}`}`,
        label: 'Articles in MongoDB',
        sublabel: 'Persisted across dynamic collections',
        iconName: 'FileText',
      },
      {
        value: `${Math.max(5, usersCount + subscribersCount)}K+`,
        label: 'Active Writers & Readers',
        sublabel: 'Authenticated profiles & subscribers',
        iconName: 'Users',
      },
      {
        value: `${totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K+` : `${totalViews}`}`,
        label: 'Monthly Document Reads',
        sublabel: 'Aggregated live document hits',
        iconName: 'Globe',
      },
      {
        value: '99.99%',
        label: 'MongoDB Cluster Uptime',
        sublabel: 'High-availability replica set',
        iconName: 'ShieldCheck',
      },
    ];
  }

  const totalViews = memoryDb.posts.reduce((acc, curr) => acc + curr.views, 0);

  return [
    {
      value: `${memoryDb.posts.length}`,
      label: 'Articles Stored',
      sublabel: 'Ready to sync with MongoDB cluster',
      iconName: 'FileText',
    },
    {
      value: '5.2K+',
      label: 'Active Creators',
      sublabel: 'Engineers, founders & thought leaders',
      iconName: 'Users',
    },
    {
      value: `${totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K+` : `${totalViews}`}`,
      label: 'Monthly Document Reads',
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
}

export async function resetToDefaultSamples() {
  const { db, isUsingMemoryFallback } = await getMongoDb();
  if (db && !isUsingMemoryFallback) {
    await db.collection('posts').deleteMany({});
    await db.collection('comments').deleteMany({});
    await seedMongoDatabase(db);
    return { success: true, message: 'MongoDB collections reseeded with sample articles' };
  }

  memoryDb.seed();
  return { success: true, message: 'Local in-memory store reseeded' };
}
