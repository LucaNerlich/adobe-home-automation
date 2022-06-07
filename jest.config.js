module.exports = async () => {
    return {
        verbose: true,
        transform: {
            '^.+\\.tsx?$': [
                'esbuild-jest',
                {
                    sourcemap: true,
                    loaders: {
                        '.spec.ts': 'tsx'
                    }
                }
            ]
        }
    }
}
