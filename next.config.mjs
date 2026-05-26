/** @type {import('next').NextConfig} */
const EXPRESS_API_URL =
  process.env.EXPRESS_API_URL ?? 'http://localhost:4000';

const nextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      { source: '/api/auth/:path*', destination: `${EXPRESS_API_URL}/api/auth/:path*` },
      { source: '/api/logs/:path*', destination: `${EXPRESS_API_URL}/api/logs/:path*` },
      { source: '/api/projects/:path*', destination: `${EXPRESS_API_URL}/api/projects/:path*` },
      { source: '/api/admin/:path*', destination: `${EXPRESS_API_URL}/api/admin/:path*` },
      { source: '/api/auth', destination: `${EXPRESS_API_URL}/api/auth` },
      { source: '/api/logs', destination: `${EXPRESS_API_URL}/api/logs` },
      { source: '/api/projects', destination: `${EXPRESS_API_URL}/api/projects` },
      { source: '/api/admin', destination: `${EXPRESS_API_URL}/api/admin` },
    ];
  },
};

export default nextConfig;
