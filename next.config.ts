
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
  const allowedDevOrigin = 'https://9000-firebase-studio-1756530008162.cluster-yylgzpipxrar4v4a72liastuqy.cloudworkstations.dev';
  nextConfig.experimental = {
    ...nextConfig.experimental,
    allowedDevOrigins: [allowedDevOrigin],
  };
}

export default nextConfig;
