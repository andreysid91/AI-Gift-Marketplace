module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Замените на домены, с которых вы будете загружать изображения
  },
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },
};