const visit = require('unist-util-visit')

const DEMO_REGEX = /^demo: *(.+)$/

const i = 0

module.exports = function () {
  return function (tree) {
    visit(tree, 'link', (node) => {
      const url = node.url
      const matches = url.match(DEMO_REGEX)
      if(!matches) {
          return
      }
      const path = matches[1]
      const Component = `DEMO_${i}`
      tree.children.unshift({
          type: 'import',
          value: `import ${Component} from '${path}'`
      })
      console.log(tree)
      node.type = 'jsx'
      node.value = `<DemoBox><${Component}/></DemoBox>`
    })
  }
}
