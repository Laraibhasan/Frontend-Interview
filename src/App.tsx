import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/**
 * API LAYER
 * JSON Server runs on http://localhost:3001
 */
const api = axios.create({ baseURL: 'http://localhost:3001' });

const getBlogs = async () => (await api.get('/blogs')).data;
const getBlogById = async (id: string) => (await api.get(`/blogs/${id}`)).data;
const createBlog = async (newBlog: any) => (await api.post('/blogs', newBlog)).data;
const deleteBlog = async (id: string) => (await api.delete(`/blogs/${id}`)).data;

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Task 1: Get All Blogs using TanStack Query
  const { data: blogs, isLoading } = useQuery({ 
    queryKey: ['blogs'], 
    queryFn: getBlogs 
  });

  // Task 3: Create Blog Mutation
  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setIsModalOpen(false);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setSelectedId(null);
    },
  });

  const handleCreate = (e: any) => {
    e.preventDefault();
    const d = new FormData(e.target);
    createMutation.mutate({
      title: d.get('title'),
      category: [(d.get('category') as string).toUpperCase()],
      description: d.get('description'),
      content: d.get('content'),
      date: new Date().toISOString(),
      coverImage: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg"
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this post forever?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* LEFT PANEL: Blog List (Scrollable) */}
      <aside className="w-1/3 min-w-[350px] border-r bg-white flex flex-col shadow-sm">
        <div className="p-6 border-b flex justify-between items-center bg-white shrink-0">
          <h1 className="text-xl font-black text-indigo-700 uppercase tracking-tight">CA Monk Blog</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
          >
            + New Post
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {isLoading ? (
            <p className="text-center py-10 text-slate-400">Loading blogs...</p>
          ) : (
            blogs?.map((blog: any) => (
              <div 
                key={blog.id}
                onClick={() => setSelectedId(blog.id)}
                className={`p-5 border-2 rounded-2xl cursor-pointer transition-all bg-white ${
                  selectedId === blog.id 
                  ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                  : 'border-transparent hover:border-slate-300'
                }`}
              >
                <div className="flex gap-2 mb-2">
                  {blog.category.map((c: string) => (
                    <span key={c} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
                <h2 className="font-bold text-lg leading-tight text-slate-800">{blog.title}</h2>
                <p className="text-sm text-slate-500 line-clamp-2 mt-2">{blog.description}</p>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* RIGHT PANEL: Content Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto bg-white p-12">
        {selectedId ? (
          <BlogDetail id={selectedId} onDelete={handleDelete} isDeleting={deleteMutation.isPending} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-lg font-medium">Select a story to start reading</p>
          </div>
        )}
      </main>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Create New Post</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input name="title" placeholder="Blog Title" className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 ring-indigo-500" required />
              <input name="category" placeholder="Category (e.g. FINTECH)" className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 ring-indigo-500" required />
              <textarea name="content" placeholder="Full Content" className="w-full p-3 bg-slate-50 border rounded-xl h-40 outline-none focus:ring-2 ring-indigo-500" required />
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-slate-500 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 cursor-pointer disabled:opacity-50" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Task 2: Get Blog By ID
function BlogDetail({ id, onDelete, isDeleting }: any) {
  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlogById(id),
  });

  if (isLoading) return <div className="animate-pulse space-y-6 max-w-2xl mx-auto pt-10"><div className="h-80 bg-slate-100 rounded-3xl" /></div>;

  return (
    <article className="max-w-3xl mx-auto">
      <img src={blog.coverImage} className="w-full h-96 object-cover rounded-[2.5rem] shadow-xl mb-10" alt="" />
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-3">
          {blog.category.map((c: string) => (
            <span key={c} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-black uppercase rounded-full border border-indigo-100">{c}</span>
          ))}
        </div>
        <button 
          onClick={() => onDelete(id)} 
          disabled={isDeleting}
          className="text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-700 cursor-pointer disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete Post"}
        </button>
      </div>
      <h1 className="text-5xl font-black text-slate-900 leading-tight mb-6">{blog.title}</h1>
      <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">{blog.content}</p>
    </article>
  );
}