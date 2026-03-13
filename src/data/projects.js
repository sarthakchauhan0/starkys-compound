// ============================================
// PROJECT DATA FOR THE PORTFOLIO COMPOUND
// ============================================

export const websiteProjects = [
  {
    id: 'minteddao',
    title: 'MintedDAO',
    description: 'A decentralized autonomous organization platform for NFT minting and governance. Built with Solidity smart contracts, React frontend, and IPFS storage.',
    techStack: ['React', 'Solidity', 'Web3.js', 'IPFS', 'Hardhat'],
    liveUrl: 'https://minteddao.io',
    githubUrl: 'https://github.com/starky/minteddao',
    color: '#00ff88',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with real-time inventory management, Stripe payment integration, and admin analytics dashboard.',
    techStack: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'TailwindCSS'],
    liveUrl: 'https://shopstarky.com',
    githubUrl: 'https://github.com/starky/ecommerce',
    color: '#ff6b35',
  },
  {
    id: 'socialapp',
    title: 'Social Connect',
    description: 'Real-time social media platform with live messaging, stories, and AI-powered content recommendation engine.',
    techStack: ['React', 'Firebase', 'Socket.io', 'TensorFlow.js', 'Express'],
    liveUrl: 'https://socialconnect.dev',
    githubUrl: 'https://github.com/starky/socialconnect',
    color: '#a855f7',
  },
  {
    id: 'portfolio-builder',
    title: 'Portfolio Builder',
    description: 'A drag-and-drop portfolio website builder with custom themes, domain hosting, and SEO optimization tools.',
    techStack: ['Vue.js', 'Django', 'PostgreSQL', 'AWS S3', 'Docker'],
    liveUrl: 'https://buildfolio.dev',
    githubUrl: 'https://github.com/starky/portfolio-builder',
    color: '#06b6d4',
  },
]

export const dataProjects = [
  {
    id: 'market-analysis',
    title: 'Market Trend Analyzer',
    description: 'Machine learning pipeline for predicting cryptocurrency market trends using LSTM networks and sentiment analysis on social media data.',
    techStack: ['Python', 'TensorFlow', 'Pandas', 'PostgreSQL', 'Plotly'],
    insights: 'Achieved 78% prediction accuracy on 30-day BTC price movements',
    color: '#00ffcc',
  },
  {
    id: 'data-viz',
    title: 'Urban Data Visualizer',
    description: 'Interactive data visualization dashboard analyzing urban development patterns, traffic flow, and population density across major cities.',
    techStack: ['Python', 'D3.js', 'SQL', 'GeoPandas', 'Mapbox'],
    insights: 'Processed 2M+ data points from 50 metropolitan areas',
    color: '#ff00ff',
  },
  {
    id: 'nlp-engine',
    title: 'NLP Sentiment Engine',
    description: 'Natural language processing engine for real-time sentiment analysis of customer reviews and brand monitoring.',
    techStack: ['Python', 'NLTK', 'spaCy', 'FastAPI', 'Redis'],
    insights: 'Processing 10K+ reviews/min with 92% sentiment accuracy',
    color: '#ffff00',
  },
]

export const skills = [
  { id: 'react', name: 'React', xp: 95, years: 4, color: '#61dafb' },
  { id: 'nextjs', name: 'Next.js', xp: 90, years: 3, color: '#ffffff' },
  { id: 'web3', name: 'Web3', xp: 85, years: 2, color: '#f7931a' },
  { id: 'python', name: 'Python', xp: 88, years: 4, color: '#3776ab' },
  { id: 'marketing', name: 'Marketing', xp: 80, years: 3, color: '#ff4444' },
  { id: 'nodejs', name: 'Node.js', xp: 92, years: 4, color: '#339933' },
  { id: 'threejs', name: 'Three.js', xp: 75, years: 2, color: '#049ef4' },
  { id: 'sql', name: 'SQL', xp: 82, years: 3, color: '#cc6699' },
]

export const bossData = {
  id: 'house-of-cards',
  title: 'House of Cards',
  subtitle: 'Collab Management & Community Leadership',
  description: 'Led a thriving community of creators, developers, and artists in the Web3 space. Managed collaborative projects, organized virtual events, and grew the community from 0 to 10,000+ members.',
  achievements: [
    { label: 'Community Members', value: '10,000+', icon: '👥' },
    { label: 'Projects Launched', value: '25+', icon: '🚀' },
    { label: 'Events Organized', value: '50+', icon: '🎯' },
    { label: 'Revenue Generated', value: '$500K+', icon: '💰' },
    { label: 'Artist Collabs', value: '100+', icon: '🎨' },
    { label: 'Discord Servers', value: '5', icon: '💬' },
  ],
  color: '#ffd700',
}
