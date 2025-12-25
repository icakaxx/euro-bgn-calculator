import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EuroBG Elka - BGN EUR Калкулатор',
    short_name: 'EuroBG Elka',
    description: 'Безплатен калкулатор за преобразуване на лева в евро',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait',
    lang: 'bg',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['finance', 'utilities', 'shopping'],
  }
}

