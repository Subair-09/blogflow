import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
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
} from './server/db';
import { uploadImage, getCloudinaryStatus } from './server/cloudinary';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser middleware with high limit for image uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // 1. Health & Database connection status
  app.get('/api/health', async (req, res) => {
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
  app.get('/api/db/status', async (req, res) => {
    try {
      const status = await getDbStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Reseed database samples
  app.post('/api/db/reseed', async (req, res) => {
    try {
      const result = await resetToDefaultSamples();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4. GET all posts (with optional category, search filter & status/drafts)
  app.get('/api/posts', async (req, res) => {
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

  // 5. GET single post by id or slug (and optionally increment views)
  app.get('/api/posts/:idOrSlug', async (req, res) => {
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

  // 6. POST create new blog post in MongoDB
  app.post('/api/posts', async (req, res) => {
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
  app.put('/api/posts/:idOrSlug', async (req, res) => {
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
  app.delete('/api/posts/:idOrSlug', async (req, res) => {
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
  app.patch('/api/posts/:idOrSlug/publish', async (req, res) => {
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
  app.post('/api/posts/:idOrSlug/like', async (req, res) => {
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
  app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await getCommentsByPostId(postId);
      res.json({ success: true, count: comments.length, comments });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 9. POST add a comment to a post
  app.post('/api/posts/:postId/comments', async (req, res) => {
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
  app.post('/api/auth/register', async (req, res) => {
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
  app.post('/api/auth/login', async (req, res) => {
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
  app.post('/api/subscribe', async (req, res) => {
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
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await getLiveStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 14. GET Cloudinary Configuration Status
  app.get('/api/cloudinary/status', (req, res) => {
    try {
      const status = getCloudinaryStatus();
      res.json({ success: true, ...status });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 15. POST Upload image to Cloudinary (from base64/data URI or URL)
  app.post('/api/upload', async (req, res) => {
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

  // -------------------------------------------------------------
  // VITE & STATIC FILE SERVING
  // -------------------------------------------------------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BlogFlow Server] Running on http://0.0.0.0:${PORT} with MongoDB persistence enabled.`);
  });
}

startServer().catch((err) => {
  console.error('[BlogFlow Server Error]', err);
});
