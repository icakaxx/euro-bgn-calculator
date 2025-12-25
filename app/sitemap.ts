import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://eurobg-elka.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          bg: 'https://eurobg-elka.vercel.app',
          en: 'https://eurobg-elka.vercel.app',
        },
      },
    },
  ]
}

