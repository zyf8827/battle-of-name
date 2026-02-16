export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            screens: {
                // 自定义方向断点
                'landscape': { 'raw': '(orientation: landscape)' },
                'portrait': { 'raw': '(orientation: portrait)' },
            },
        },
    },
    plugins: [],
};
