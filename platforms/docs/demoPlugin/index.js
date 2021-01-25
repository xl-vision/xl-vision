/* eslint-disable prefer-destructuring */
const visit = require('unist-util-visit')
const fs = require('fs')
const path = require('path')


let i = 0

const TYPE = 'demo'

const TYPE_TITLE = TYPE + '_title'
const TYPE_DESC = TYPE + '_desc'

module.exports = function () {
  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  blockTokenizers[TYPE] = blockTokenizer

  blockMethods.unshift(TYPE)


  return function parse(tree, vfile) {
    const basePath = vfile.dirname
    visit(tree, TYPE, node => {
      const filePath = node.path
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(basePath, filePath)
      
      const code = fs.readFileSync(absolutePath)

      const demoName = `Demo_${i++}`

      node.type = 'element'


      tree.children.unshift({
        type: 'import',
        value: `import ${demoName} from '${filePath}'`
      })


      node.children.unshift({
        type: 'jsx',
        value: '<DemoBox>'
      })

      node.children.push({
        type: 'code',
        value: code
      })

      node.children.push({
        type: 'jsx',
        value: `<${demoName} />`
      })

      node.children.push({
        type: 'jsx',
        value: '</DemoBox>'
      })
      
    })
  }
}

const REGEX_START = /^:::[\t\f ]*demo +(\S+)[\t\f ]*\n+(.*)\n+((.+\n+)+):::(\n|$)/

function blockTokenizer(eat, value) {
  const now = eat.now()

  const matches = value.match(REGEX_START)

  if (!matches) {
    return
  }

  const matchString = matches[0]

  const filePath = matches[1]
  const title = matches[2]
  const desc = matches[3]

  const add = eat(matchString)

  const exit = this.enterBlock()

  const descContent = {
    type: TYPE_DESC,
    children: this.tokenizeBlock(desc, now)
  }

  exit()

  const titleContent = {
    type: TYPE_TITLE,
    children: this.tokenizeInline(title, now)
  }

  return add({
    type: TYPE,
    path: filePath,
    children: [titleContent, descContent]
  })
}
