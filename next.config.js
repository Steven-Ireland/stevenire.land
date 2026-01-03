/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: Change the output directory `out` to `public` if you want to keep the same structure,
  // but `out` is the default for Next.js static exports. 
  // I will update netlify.toml to point to `out`.
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
