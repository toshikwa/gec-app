const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = { output: "export", reactStrictMode: true };
module.exports = withVanillaExtract(nextConfig);
