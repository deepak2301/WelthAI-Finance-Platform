/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Ensure the correct protocol is used
        hostname: "randomuser.me",
        pathname: "/api/portraits/**", // Add pathname to match the image path
      },
    ],
  },
};

export default nextConfig;
