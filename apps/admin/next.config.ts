import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sonica/shared", "@sonica/ui", "@sonica/database"],
};

export default nextConfig;
