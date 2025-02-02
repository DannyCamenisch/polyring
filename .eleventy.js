const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const svgContents = require('eleventy-plugin-svg-contents')
const htmlMinifier = require('html-minifier')

function roundToTwo(x){
    return Math.round((x + Number.EPSILON) * 100) / 100
}

module.exports = function (config) {
    config.addPlugin(syntaxHighlight)
    config.addPlugin(svgContents)

    config.addLayoutAlias('base', 'base.njk')
    config.addLayoutAlias('page', 'page.njk')

    config.addFilter('mapNodes', function (nodes, radius, width, height) {
        return nodes.map((node, index) => {
            const angle = (index / (nodes.length / 2)) * Math.PI
            const x = roundToTwo(radius * Math.cos(angle) + width / 2)
            const y = roundToTwo(radius * Math.sin(angle) + height / 2)

            return {
                title: node.title,
                url: node.url,
                x,
                y
            }
        })
    })

    config.addTransform('htmlmin', function (content, outputPath) {
        if (outputPath.endsWith('.html')) {
            return htmlMinifier.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            })
        }
        return content
    })

    config.addPassthroughCopy('src/assets/images')
    config.addPassthroughCopy('src/assets/themes')
    config.addPassthroughCopy('src/data/members.json')
    config.addPassthroughCopy('src/robots.txt')

    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data'
        },
        templateFormats: ['njk', 'md', '11ty.js'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        passthroughFileCopy: true
    }
}
