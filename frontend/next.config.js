/** @type {import("next").NextConfig} */
// "standalone" output is only needed for the Docker image; Vercel builds Next.js natively.
module.exports = process.env.DOCKER_BUILD ? { output: 'standalone' } : {};
