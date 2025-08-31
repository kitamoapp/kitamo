
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
  if (process.env.ALLOWED_DEV_ORIGIN) {
    const origin = new URL(process.env.ALLOWED_DEV_ORIGIN);
    nextConfig.experimental = {
      ...nextConfig.experimental,
      // The `allowedDevOrigins` config expects a list of protocol://hostname:port strings.
      allowedDevOrigins: [`${origin.protocol}//${origin.host}`],
    };
  }
}

export default nextConfig;
