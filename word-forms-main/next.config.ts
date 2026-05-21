import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Permite qualquer subdomínio em *.localhost / *.forms.localhost durante o dev,
  // necessário porque o formulário é resolvido pelo host (ex.: demo.forms.localhost).
  allowedDevOrigins: ['*.localhost', '*.forms.localhost'],

  async headers() {
    return [
      {
        // Permite que /embed/<sub> seja embedado em qualquer site cliente (landing page).
        source: '/embed/:subdomain',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors *" },
          { key: 'X-Frame-Options', value: 'ALLOWALL' }
        ]
      },
      {
        // Script público de embed: cacheável e cross-origin.
        source: '/embed.js',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=300, s-maxage=300' }
        ]
      }
    ]
  }
}

export default nextConfig
