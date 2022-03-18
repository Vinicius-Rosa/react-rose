import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'generate:component',
  alias: ['g:component'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      filesystem,
      template: { generate },
      print,
    } = toolbox

    const name = parameters.first

    if (!name) {
      return print.error('Component name is required!')
    }

    async function isReactNative() {
      const _package = await filesystem.read('package.json', 'json')

      return !!_package.dependencies['react-native']
    }

    const styleTemplate = (await isReactNative())
      ? 'styles-rn.ts.ejs'
      : 'styles-react.ts.ejs'

    print.info(`Generating component styles...`)
    await generate({
      template: styleTemplate,
      target: `src/components/${name}/styles.ts`,
      props: { name },
    })

    print.info(`Generating component structure...`)
    await generate({
      template: 'component.ts.ejs',
      target: `src/components/${name}/index.tsx`,
      props: { name },
    })

    print.info(`Registering component...`)
    await filesystem.append(
      'src/components/index.ts',
      `export * from "./${name}"\n`
    )

    print.success(`Generated component at src/components/${name}!!`)
  },
}
