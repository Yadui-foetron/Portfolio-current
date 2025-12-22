
import { Project, Skill, BlogPost, Achievement } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Cartoon RAG Assistant',
    description: 'A retrieval-augmented generation system that talks like your favorite 90s cartoon characters using LLM fine-tuning.',
    image: 'https://images.unsplash.com/photo-1675557009875-436f595b295d?auto=format&fit=crop&q=80&w=800',
    tags: ['Python', 'LangChain', 'OpenAI'],
    color: '#FF4B4B'
  },
  {
    id: '2',
    title: 'Visual Prompt Lab',
    description: 'Interactive playground for engineering visual prompts, specifically designed for comic-style image generation.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    tags: ['Stable Diffusion', 'React', 'FastAPI'],
    color: '#00A1FF'
  },
  {
    id: '3',
    title: 'Agentic Workflow Engine',
    description: 'Autonomous AI agents that collaborate to build software, managed through a playful, high-energy UI.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    tags: ['AutoGPT', 'Docker', 'Go'],
    color: '#6B4BFF'
  }
];

export const SKILLS: Skill[] = [
  { name: 'LLM Architect', level: 95 },
  { name: 'PyTorch / JAX', level: 90 },
  { name: 'Prompt Eng', level: 98 },
  { name: 'Vector DBs', level: 85 },
  { name: 'React/Frontend', level: 80 }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Global GenAI Hackathon Winner',
    issuer: 'Google Cloud',
    date: '2024',
    icon: '🏆',
    color: '#FFD600'
  },
  {
    id: '2',
    title: 'Top AI Contributor',
    issuer: 'Open Source Community',
    date: '2023',
    icon: '🌟',
    color: '#00A1FF'
  },
  {
    id: '3',
    title: 'Neural Arts Certified',
    issuer: 'DeepLearning.AI',
    date: '2023',
    icon: '🎨',
    color: '#FF4B4B'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'guide',
    title: 'Action Bastion Guide to Blogging',
    date: 'Jan 20, 2025',
    excerpt: 'Learn how to use Images, Code, and Notes in your custom blog entries!',
    category: 'Documentation',
    color: '#FFD600',
    sections: [
      { type: 'text', content: 'Welcome to your rich-content editor! Below are examples of everything you can build using the JSON sections in the admin panel.' },
      { type: 'note', content: 'Pro-Tip: You can find the JSON templates for these blocks by clicking "VIEW BLUEPRINT MANUAL" in the Admin Lab!' },
      { type: 'image', content: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200', caption: 'High-tech gadgets for your blog posts.' },
      { type: 'text', content: 'You can also drop code snippets that look like real 22nd-century terminals:' },
      { type: 'code', content: 'const powerUp = () => {\n  console.log("ACTION BASTION!!!");\n  return "🚀 Ready for deployment!";\n};', language: 'javascript' },
      { type: 'text', content: 'Every section is framed with neubrutalist borders to keep that premium Awwwards cartoon aesthetic.' }
    ]
  },
  {
    id: '1',
    title: 'The Secret Life of LLMs',
    date: 'Oct 12, 2024',
    excerpt: 'Exploring how hidden states in transformers resemble 90s cartoon logic.',
    category: 'AI Research',
    color: '#FF4B4B',
    sections: [
      { type: 'text', content: 'Transformers are essentially vast neural stages where attention mechanisms act as directors.' },
      { type: 'image', content: 'https://images.unsplash.com/photo-1620712943543-bcc4628c71d0?auto=format&fit=crop&q=80&w=1200', caption: 'Neural networks visualizing patterns.' },
      { type: 'note', content: 'Attention is all you need, but a good cape helps too!' }
    ]
  }
];

export const CARTOON_ICONS = [
  { id: 'shinchan', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600', x: 5, y: 15, scale: 1.2 },
  { id: 'doraemon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Doraemon&backgroundColor=00A1FF', x: 85, y: 25, scale: 1.5 },
  { id: 'ninja', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ninja&backgroundColor=6B4BFF', x: 15, y: 75, scale: 1.1 },
  { id: 'pika', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Pikachu&backgroundColor=FFD600', x: 80, y: 85, scale: 1.3 },
];
