import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profilePicUrl?: string;
  };
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: any[];
  tags?: { name: string }[];
  createdAt: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', imageUrl: '', tags: '' });
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiService.getPosts();
      setPosts(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    setCreating(true);
    try {
      const postData = {
        content: newPost.content,
        imageUrl: newPost.imageUrl || undefined,
        tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : undefined,
      };

      await apiService.createPost(postData);
      setNewPost({ content: '', imageUrl: '', tags: '' });
      setShowCreatePost(false);
      await fetchPosts();
      
      toast({
        title: "Success",
        description: "Your post has been created!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await apiService.unlikePost(postId);
      } else {
        await apiService.likePost(postId);
      }
      await fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await apiService.deletePost(postId);
      await fetchPosts();
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-muted rounded"></div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Developer Feed</h1>
          <Button
            variant="engineering"
            onClick={() => setShowCreatePost(!showCreatePost)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Create Post Form */}
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Share your thoughts</h3>
                
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="What's on your mind?"
                  className="bg-glass border-glass-border min-h-[100px]"
                  required
                />

                <Input
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                  placeholder="Image URL (optional)"
                  className="bg-glass border-glass-border"
                />

                <Input
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  placeholder="Tags (comma-separated, optional)"
                  className="bg-glass border-glass-border"
                />

                <div className="flex space-x-2">
                  <Button type="submit" variant="engineering" disabled={creating}>
                    {creating ? "Posting..." : "Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCreatePost(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => {
            const isLiked = user && post.likes.includes(user._id);
            const isOwner = user && post.userId._id === user._id;

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover="lift">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {post.userId.profilePicUrl ? (
                        <img
                          src={post.userId.profilePicUrl}
                          alt={post.userId.username}
                          className="h-10 w-10 rounded-full border border-glass-border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {post.userId.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{post.userId.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post._id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>

                  {/* Post Image */}
                  {post.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-full rounded-lg border border-glass-border max-h-96 object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                        >
                          #{typeof tag === 'string' ? tag : tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-glass-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post._id, isLiked)}
                      className={`${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      {post.likes.length}
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {post.comments.length}
                    </Button>

                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {posts.length === 0 && (
          <GlassCard className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to share something with the community!</p>
            <Button variant="engineering" onClick={() => setShowCreatePost(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Post
            </Button>
          </GlassCard>
        )}
      </motion.div>
    </div>
  );
};

export default Feed;