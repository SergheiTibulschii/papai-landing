const presets = [
    [
        '@babel/preset-env',
        {
            loose: true,
            //"exclude": ["transform-async-to-generator", "transform-regenerator"]
        },
    ],
];

const plugins = [
    [
        'babel-plugin-transform-async-to-promises',
        {
            inlineHelpers: true,
            externalHelpers: false,
        },
    ],
];

module.exports = {presets, plugins};
