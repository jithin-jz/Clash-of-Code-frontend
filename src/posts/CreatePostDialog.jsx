import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea"; // Assuming simple textarea or needs shadcn one
import { ImagePlus, X, Loader2 } from "lucide-react";
import { notify } from "../services/notification";
import { postsAPI } from "../services/api";

const CreatePostDialog = ({ open, onOpenChange, onPostCreated }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      await postsAPI.createPost(formData);
      notify.success("Post created successfully!");
      onPostCreated();
      onOpenChange(false);
      // Reset state
      setImage(null);
      setPreview(null);
      setCaption("");
    } catch (error) {
      console.error(error);
      notify.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Image Upload Area */}
          <div
            className={`
                            relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] transition-colors
                            ${preview ? "border-transparent bg-zinc-950/50" : "border-zinc-700 hover:border-zinc-500 bg-zinc-800/20"}
                        `}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="relative w-full h-full">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-[300px] object-contain rounded-md"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 text-zinc-400 hover:text-white border border-white/10"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center cursor-pointer">
                <ImagePlus className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
                <p className="text-sm text-zinc-400 font-medium">
                  Click to upload photo
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  PEG, PNG up to 10MB
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full bg-zinc-800/50 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-white/20 min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!image || loading}
            className="w-full bg-white text-black hover:bg-zinc-200 font-medium"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? "Posting..." : "Share"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
