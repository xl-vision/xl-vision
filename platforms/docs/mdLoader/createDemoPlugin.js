/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-template */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
const babel = require("@babel/core")
const fs = require('fs')
const path = require('path')

let i = 0

const TYPE = 'demo'

const TYPE_TITLE = TYPE + '_title'
const TYPE_DESC = TYPE + '_desc'

module.exports = function createDemoPlugin(ctx) {
  return function demoPlugin() {
    const Parser = this.Parser

    // Inject blockTokenizer
    const blockTokenizers = Parser.prototype.blockTokenizers
    const blockMethods = Parser.prototype.blockMethods
    blockTokenizers[TYPE] = blockTokenizer

    blockMethods.unshift(TYPE)

    return async function parse(tree, vfile) {
      const basePath = vfile.dirname
      const nodes = visit(tree, TYPE)
      for (const node of nodes) {
        const filePath = node.path

        if (!filePath.match(/.tsx?$/)) {
          throw new Error(`file is not end with '.ts' or '.tsx': ${filePath}`)
        }

        const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(basePath, filePath)

        const tsCode = await new Promise((resolve, reject) => {
          fs.readFile(absolutePath, (err, data) => {
            if (err) {
              return reject(err)
            }
            ctx.addDependency(absolutePath)
            resolve(data)
          })
        })

        const jsCode = (await babel.transformAsync(tsCode, {
          filename: path.basename(filePath),
          presets: [
            // '@babel/preset-react',
            '@babel/preset-typescript'
          ]
        })).code

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
          value: tsCode,
          lang: 'tsx'
        })

        node.children.push({
          type: 'code',
          value: jsCode,
          lang: 'jsx'
        })

        node.children.push({
          type: 'jsx',
          value: `<${demoName} />`
        })

        node.children.push({
          type: 'jsx',
          value: '</DemoBox>'
        })
      }
    }
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

function visit(tree, type) {
  const nodes = []
  if (!tree) {
    return nodes
  }

  if (tree.type === type) {
    nodes.push(tree)
  }

  const children = tree.children || []
  for (const child of children) {
    nodes.push(...visit(child, type))
  }

  return nodes
}
