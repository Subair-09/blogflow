export interface BlogPost {
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
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface MongoDbStatus {
  connected: boolean;
  isUsingMemoryFallback: boolean;
  driver: string;
  databaseName: string;
  host?: string | null;
  pingMs?: number | null;
  clusterType?: string;
  uri: string | null;
  collections: {
    posts: number;
    comments: number;
    users: number;
    subscribers: number;
  };
  error: string | null;
}


export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  accentColor: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
  detail: string;
  iconName: string;
}

export interface StatItem {
  value: string;
  label: string;
  sublabel: string;
  iconName: string;
}

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'author' | 'reader' | 'admin';
  avatar: string;
  createdAt?: string | Date;
}
