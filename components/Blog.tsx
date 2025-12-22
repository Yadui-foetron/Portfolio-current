
import React from 'react';
import { BLOG_POSTS } from '../constants';

const Blog: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#FFF9E6] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="cartoon-btn bg-white text-black px-6 py-2 font-black mb-12 uppercase"
        >
          ← Back to Lab
        </button>

        <header className="mb-20">
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-6">
            GOSSIP <br /> <span className="text-[#FF4B4B]" style={{ WebkitTextStroke: '2px black' }}>LOGS</span>
          </h1>
          <p className="text-2xl font-bold text-gray-700">Latest discoveries from the 22nd century.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post) => (
            <div 
              key={post.id}
              className="bg-white border-[6px] border-black shadow-[10px_10px_0px_#000] p-8 flex flex-col hover:-translate-y-2 transition-transform cursor-pointer group"
            >
              <div 
                className="w-full h-12 mb-6 border-b-4 border-black font-black uppercase flex items-center justify-between"
                style={{ color: post.color }}
              >
                <span>{post.category}</span>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 leading-tight group-hover:text-blue-600">
                {post.title}
              </h3>
              <p className="text-gray-700 font-bold mb-8 flex-1">
                {post.excerpt}
              </p>
              <button className="cartoon-btn self-start bg-black text-white px-6 py-2 text-sm font-black uppercase">
                Read Entry
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
