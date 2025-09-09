
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
  webpack: (
    config,
    { isServer }
  ) => {
    // This is to prevent the error: "Module not found: Can't resolve 'react-native'"
    // See: https://github.com/facebook/react-native/issues/28773
    config.externals = [...config.externals, 'react-native'];


    return config
  },
};

if (process.env.NODE_ENV === 'development') {
  if (process.env.ALLOWED_DEV_ORIGIN) {
    // The `allowedDevOrigins` config has been removed as it was causing a startup error.
    // Modern Next.js handles CORS for development environments differently.
  }
}

export default nextConfig;
