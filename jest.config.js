export default {
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
