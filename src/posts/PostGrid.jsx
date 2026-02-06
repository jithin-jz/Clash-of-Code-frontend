import React, { useState, useEffect } from "react";
import { postsAPI } from "../services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Heart, MessageCircle, Trash2, X, Loader2 } from "lucide-react";
import { notify } from "../services/notification";
import useAuthStore from "../stores/useAuthStore";
import { formatDistanceToNow } from "date-fns";

const PostGrid = ({ username, refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, [username, refreshTrigger]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getUserPosts(username);
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (post) => {
    if (!currentUser) return;

    // Optimistic update
    const isLiked = post.is_liked;
    const newLikeCount = isLiked ? post.likes_count - 1 : post.likes_count + 1;

    // Update local state for grid
    const updatePostState = (p) =>
      p.id === post.id
        ? { ...p, is_liked: !isLiked, likes_count: newLikeCount }
        : p;
    setPosts((prev) => prev.map(updatePostState));

    // Update selected post if open
    if (selectedPost && selectedPost.id === post.id) {
      setSelectedPost((prev) => ({
        ...prev,
        is_liked: !isLiked,
        likes_count: newLikeCount,
      }));
    }

    try {
      await postsAPI.toggleLike(post.id);
    } catch (error) {
      // Revert on error
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
      if (selectedPost && selectedPost.id === post.id) setSelectedPost(post);
      notify.error("Failed to like post");
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await postsAPI.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setSelectedPost(null);
      notify.success("Post deleted");
    } catch (error) {
      notify.error("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1 md:gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square bg-zinc-900 animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-zinc-700" />
        </div>
        <h3 className="text-white font-medium mb-1">No posts yet</h3>
        <p className="text-zinc-500 text-sm">
          Photos shared by {username} will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-4 mt-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative aspect-square bg-zinc-900 cursor-pointer overflow-hidden rounded-md"
            onClick={() => setSelectedPost(post)}
          >
            <img
              src={post.image_url}
              alt={post.caption}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Heart className="fill-white" size={20} />
                <span className="font-bold">{post.likes_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Viewer Modal */}
      <Dialog
        open={!!selectedPost}
        onOpenChange={(open) => !open && setSelectedPost(null)}
      >
        <DialogContent className="bg-zinc-950 border border-white/10 p-0 text-white max-w-4xl w-full h-[80vh] flex overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,350px] w-full h-full">
            {/* Image Section */}
            <div className="bg-black flex items-center justify-center relative border-r border-white/5">
              {selectedPost && (
                <img
                  src={selectedPost.image_url}
                  alt="Post"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col h-full bg-zinc-900">
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedPost?.user?.avatar_url} />
                    <AvatarFallback>
                      {selectedPost?.user?.username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-sm">
                    {selectedPost?.user?.username}
                  </span>
                </div>
                {currentUser?.username === selectedPost?.user?.username && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-red-500"
                    onClick={() => handleDelete(selectedPost.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>

              {/* Comments/Caption Area (Scrollable) */}
              <div className="flex-1 p-4 overflow-y-auto">
                {/* Caption */}
                {selectedPost?.caption && (
                  <div className="flex gap-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={selectedPost?.user?.avatar_url} />
                      <AvatarFallback>
                        {selectedPost?.user?.username?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <span className="font-semibold mr-2">
                        {selectedPost?.user?.username}
                      </span>
                      <span className="text-zinc-300">
                        {selectedPost.caption}
                      </span>
                      <div className="text-xs text-zinc-500 mt-1">
                        {formatDistanceToNow(
                          new Date(selectedPost.created_at),
                          { addSuffix: true },
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Comments would go here */}
              </div>

              {/* Actions / Footer */}
              <div className="p-4 border-t border-white/5 space-y-3 bg-zinc-900">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(selectedPost)}
                    className={`transition-colors hover:scale-110 active:scale-95 ${selectedPost?.is_liked ? "text-red-500" : "text-white hover:text-zinc-300"}`}
                  >
                    <Heart
                      size={24}
                      className={selectedPost?.is_liked ? "fill-current" : ""}
                    />
                  </button>
                  <button className="text-white hover:text-zinc-300">
                    <MessageCircle size={24} />
                  </button>
                </div>
                <div className="font-semibold text-sm">
                  {selectedPost?.likes_count} likes
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wide">
                  {selectedPost &&
                    new Date(selectedPost.created_at).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostGrid;
