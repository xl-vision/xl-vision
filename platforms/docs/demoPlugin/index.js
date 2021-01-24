const visit = require('unist-util-visit')
const fs = require('fs')
const path = require('path')

const DEMO_REGEX = /^demo: *(.+)$/

const i = 0

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


  return function(tree, vfile) {
    const basePath = vfile.dirname
    visit(tree, TYPE, node => {
      const title = node.children[0]
      const desc = node.children[1]
      const filePath = node.path
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(basePath, filePath)
      
      const code = fs.readFileSync(absolutePath)
      
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
