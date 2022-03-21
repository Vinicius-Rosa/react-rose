import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'generate:screen',
  alias: ['g:screen'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      filesystem,
      template: { generate },
      print,
    } = toolbox

    const name = parameters.first

    if (!name) {
      return print.error('Screen name is required!')
    }

    async function isReactNative() {
      const _package = await filesystem.read('package.json', 'json')

      return !!_package.dependencies['react-native']
    }

    const styleTemplate = (await isReactNative())
      ? 'styles-rn.ts.ejs'
      : 'styles-react.ts.ejs'

    print.info(`Generating screen styles...`)
    await generate({
      template: styleTemplate,
      target: `src/screens/${name}/styles.ts`,
      props: { name },
    })

    print.info(`Generating screen structure...`)
    await generate({
      template: 'component.ts.ejs',
      target: `src/screens/${name}/index.tsx`,
      props: { name },
    })

    print.info(`Registering screen...`)
    await filesystem.append(
      'src/screens/index.ts',
      `export * from "./${name}"\n`
    )

    print.success(`Generated screen at src/screens/${name}!!`)
  },
}
