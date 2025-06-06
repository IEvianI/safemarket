/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
    },
    // 👇👇👇 ajoute ceci :
    pageExtensions: ['js', 'jsx'],
  };
  
  export default nextConfig;
  