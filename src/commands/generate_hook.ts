import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'generate:hook',
  alias: ['g:hook'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      template: { generate },
      print,
    } = toolbox

    const name = parameters.first

    if (!name) {
      return print.error('Custom hook name is required!')
    }

    const upperCasedFirstLetter = name[0].toUpperCase()
    const restStr = name.substring(1)
    const formattedName = 'use' + upperCasedFirstLetter + restStr

    print.info(`Generating custom hook...`)
    await generate({
      template: 'useHook.ts.ejs',
      target: `src/app/hooks/${formattedName}.ts`,
      props: { name: formattedName },
    })

    print.success(`Generated hook at src/app/hooks/${formattedName}!!`)
  },
}
