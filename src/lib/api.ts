import { BlogPost, CommentItem, MongoDbStatus, StatItem, AuthUser } from '../types';

export async function fetchPosts(params?: { category?: string; query?: string; status?: string; includeDrafts?: boolean }): Promise<BlogPost[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      searchParams.set('category', params.category);
    }
    if (params?.query && params.query.trim()) {
      searchParams.set('q', params.query.trim());
    }
    if (params?.status) {
      searchParams.set('status', params.status);
    }
    if (params?.includeDrafts) {
      searchParams.set('includeDrafts', 'true');
    }

    const url = `/api/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch posts from MongoDB');
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function fetchAdminPosts(params?: { category?: string; query?: string; status?: string }): Promise<BlogPost[]> {
  return fetchPosts({ ...params, includeDrafts: true });
}

export async function fetchPostById(idOrSlug: string, incrementViews = false): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/posts/${encodeURIComponent(idOrSlug)}${incrementViews ? '?view=true' : ''}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.post || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function createPostInMongo(postData: {
  title: string;
  excerpt?: string;
  content: string;
  category: 'Technology' | 'Business' | 'Lifestyle';
  tags?: string[];
  featuredImage?: string;
  status?: 'published' | 'draft';
  author?: {
    name: string;
    role: string;
    avatar: string;
  };
}): Promise<BlogPost> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create post in MongoDB');
  }

  const data = await response.json();
  return data.post;
}

export async function updatePostInMongo(
  idOrSlug: string,
  updates: Partial<BlogPost>
): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  try {
    const response = await fetch(`/api/posts/${encodeURIComponent(idOrSlug)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to update post in MongoDB' };
    }
    return { success: true, post: data.post };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error updating post' };
  }
}

export async function deletePostFromMongo(
  idOrSlug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/posts/${encodeURIComponent(idOrSlug)}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to delete post from MongoDB' };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error deleting post' };
  }
}

export async function togglePostPublishStatus(
  idOrSlug: string,
  status?: 'published' | 'draft'
): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  try {
    const response = await fetch(`/api/posts/${encodeURIComponent(idOrSlug)}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to update publish status' };
    }
    return { success: true, post: data.post };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error updating status' };
  }
}

export async function likePostInMongo(idOrSlug: string): Promise<number | null> {
  try {
    const response = await fetch(`/api/posts/${encodeURIComponent(idOrSlug)}/like`, {
      method: 'POST',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.likes ?? null;
  } catch (error) {
    console.error('Error liking post in MongoDB:', error);
    return null;
  }
}

export async function fetchCommentsFromMongo(postId: string): Promise<CommentItem[]> {
  try {
    const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/comments`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function addCommentToMongo(postId: string, content: string, author = 'Elena Vance'): Promise<CommentItem | null> {
  try {
    const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author,
        content,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author)}`,
      }),
    });
    if (!response.ok) throw new Error('Failed to post comment');
    const data = await response.json();
    return data.comment || null;
  } catch (error) {
    console.error('Error adding comment to MongoDB:', error);
    return null;
  }
}

export async function fetchDatabaseStatus(): Promise<MongoDbStatus | null> {
  try {
    const response = await fetch('/api/db/status');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching DB status:', error);
    return null;
  }
}

export async function fetchLiveStats(): Promise<StatItem[]> {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return data.stats || [];
  } catch (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
}

export async function subscribeEmailToMongo(email: string, source = 'newsletter'): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error.message || 'Subscription failed' };
  }
}

export async function reseedMongoData(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/db/reseed', { method: 'POST' });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to log in' };
    }
    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred while logging in' };
  }
}

export async function registerUserAccount(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to register account' };
    }
    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred while registering' };
  }
}

export interface CloudinaryUploadResponse {
  success: boolean;
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  provider: 'cloudinary' | 'local_storage';
  warning?: string;
  error?: string;
}

export async function uploadImageToCloudinary(
  imageDataUriOrBase64: string,
  options?: { folder?: string; tags?: string[] }
): Promise<CloudinaryUploadResponse> {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageDataUriOrBase64,
        folder: options?.folder || 'blogflow_posts',
        tags: options?.tags,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to upload image');
    }
    return data;
  } catch (error: any) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error(error.message || 'Network error uploading image');
  }
}

export async function fetchCloudinaryStatus(): Promise<{
  success: boolean;
  configured: boolean;
  cloudName: string | null;
  provider: string;
}> {
  try {
    const response = await fetch('/api/cloudinary/status');
    if (!response.ok) return { success: false, configured: false, cloudName: null, provider: 'unknown' };
    return await response.json();
  } catch (error) {
    return { success: false, configured: false, cloudName: null, provider: 'unknown' };
  }
}


