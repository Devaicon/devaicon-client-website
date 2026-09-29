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
      { source: '/api/preferences/:path*', destination: `${EXPRESS_API_URL}/api/preferences/:path*` },
      { source: '/api/users/:path*', destination: `${EXPRESS_API_URL}/api/users/:path*` },
      { source: '/api/roles/:path*', destination: `${EXPRESS_API_URL}/api/roles/:path*` },
      { source: '/api/profile/:path*', destination: `${EXPRESS_API_URL}/api/profile/:path*` },
      { source: '/api/auth', destination: `${EXPRESS_API_URL}/api/auth` },
      { source: '/api/logs', destination: `${EXPRESS_API_URL}/api/logs` },
      { source: '/api/projects', destination: `${EXPRESS_API_URL}/api/projects` },
      { source: '/api/admin', destination: `${EXPRESS_API_URL}/api/admin` },
      { source: '/api/preferences', destination: `${EXPRESS_API_URL}/api/preferences` },
      { source: '/api/users', destination: `${EXPRESS_API_URL}/api/users` },
      { source: '/api/roles', destination: `${EXPRESS_API_URL}/api/roles` },
      { source: '/api/profile', destination: `${EXPRESS_API_URL}/api/profile` },
    ];
  },
};

export default nextConfig;
