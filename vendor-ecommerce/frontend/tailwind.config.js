/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#8b5cf6', // Vibrant purple
                secondary: '#ec4899', // Pink
                background: '#09090b', // Zinc 950
                surface: '#18181b', // Zinc 900
                surfaceLight: '#27272a', // Zinc 800
                danger: '#ef4444',
                success: '#22c55e',
                gray: '#a1a1aa'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif']
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(to right, #8b5cf6, #ec4899)',
                'gradient-premium': 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            }
        },
        container: {
            center: true,
            padding: '1.5rem',
        }
    },
    plugins: [],
}
