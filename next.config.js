/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    unoptimized: true, // รูปถูกบีบอัดเป็น WebP ไว้แล้วตอนอัพโหลด ไม่ต้องให้ Vercel optimize ซ้ำ (เลี่ยง quota 402)
  },
};

module.exports = nextConfig;
