import express from 'express';
import dotenv from 'dotenv';
import {
  getAllPosts,
  getPostByIdOrSlug,
  createPost,
  updatePost,
  deletePost,
  togglePublishPost,
  likePost,
  getCommentsByPostId,
  addComment,
  registerUser,
  authenticateUser,
  addSubscriber,
  getLiveStats,
  getDbStatus,
  resetToDefaultSamples,
} from './db';
import { uploadImage, getCloudinaryStatus } from './cloudinary';

dotenv.config();

export const app = express();

// JSON Body Parser middleware with high limit for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Router for all API routes
const router = express.Router();

// 1. Health & Database connection status
router.get('/health', async (req, res) => {
  try {
    const status = await getDbStatus();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: status,
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// 2. Detailed MongoDB Diagnostics & Status
router.get('/db/status', async (req, res) => {
  try {
    const status = await getDbStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Reseed database samples
router.post('/db/reseed', async (req, res) => {
  try {
    const result = await resetToDefaultSamples();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. GET all posts
router.get('/posts', async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const query = req.query.q as string | undefined;
    const status = req.query.status as string | undefined;
    const includeDrafts = req.query.includeDrafts === 'true';
    const posts = await getAllPosts({ category, query, status, includeDrafts });
    res.json({ success: true, count: posts.length, posts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. GET single post by id or slug
router.get('/posts/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const incViews = req.query.view === 'true';
    const post = await getPostByIdOrSlug(idOrSlug, incViews);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found in MongoDB' });
    }
    res.json({ success: true, post });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. POST create new blog post
router.post('/posts', async (req, res) => {
  try {
    const { title, excerpt, content, category, featuredImage, author, tags, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    const newPost = await createPost({
      title,
      excerpt,
      content,
      category: category || 'Technology',
      featuredImage,
      author,
      status: status || 'published',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    });

    res.status(201).json({ success: true, message: 'Post successfully created in MongoDB', post: newPost });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6b. PUT update existing post
router.put('/posts/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const updated = await updatePost(idOrSlug, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Post not found to update' });
    }
    res.json({ success: true, message: 'Post updated successfully in MongoDB', post: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6c. DELETE a post
router.delete('/posts/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const result = await deletePost(idOrSlug);
    if (!result.success) {
      return res.status(404).json({ success: false, error: 'Post not found or already removed' });
    }
    res.json({ success: true, message: 'Post deleted successfully from MongoDB' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6d. PATCH toggle publish / draft status
router.patch('/posts/:idOrSlug/publish', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const { status } = req.body;
    const updated = await togglePublishPost(idOrSlug, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.json({ success: true, message: `Post status updated to ${updated.status}`, post: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. POST like a blog post
router.post('/posts/:idOrSlug/like', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const result = await likePost(idOrSlug);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.json({ success: true, likes: result.likes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. GET comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await getCommentsByPostId(postId);
    res.json({ success: true, count: comments.length, comments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. POST add a comment to a post
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { author, avatar, content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Comment content cannot be empty' });
    }

    const comment = await addComment(postId, {
      author,
      avatar,
      content: content.trim(),
    });

    res.status(201).json({ success: true, message: 'Comment added to MongoDB collection', comment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. POST User Registration
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required to sign up.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ success: false, error: 'Password must be at least 4 characters long.' });
    }

    const user = await registerUser({ name: name.trim(), email: email.trim(), password });
    res.status(201).json({ success: true, message: 'Account successfully registered in MongoDB', user });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists') ? 409 : 400;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

// 11. POST User Login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email is required to log in.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required to log in.' });
    }

    const user = await authenticateUser(email.trim(), password);
    res.json({ success: true, message: 'Authentication successful', user });
  } catch (error: any) {
    const isNotFound = error.message.includes('No account found');
    const isInvalidPassword = error.message.includes('Invalid password');
    const statusCode = isNotFound ? 404 : isInvalidPassword ? 401 : 400;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

// 12. POST Newsletter subscription
router.post('/subscribe', async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }

    const result = await addSubscriber(email, source);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 13. GET Dynamic platform statistics from MongoDB
router.get('/stats', async (req, res) => {
  try {
    const stats = await getLiveStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 14. GET Cloudinary Configuration Status
router.get('/cloudinary/status', (req, res) => {
  try {
    const status = getCloudinaryStatus();
    res.json({ success: true, ...status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 15. POST Upload image to Cloudinary
router.post('/upload', async (req, res) => {
  try {
    const { image, folder, tags } = req.body;
    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'No image payload provided. Please send a data URI or base64 string.',
      });
    }

    const result = await uploadImage(image, { folder, tags });
    res.json(result);
  } catch (error: any) {
    console.error('[API /api/upload Error]', error);
    res.status(500).json({ success: false, error: error.message || 'Image upload failed' });
  }
});

// Mount router on both '/api' (for local dev / direct calls) and '/' (for Vercel lambda rewrites)
app.use('/api', router);
app.use('/', router);

export default app;
