/**
 * 路由
 */
import { importAll, ImportMap, RequireContext } from '../utils'
import config, { Lang } from '../config'
import { NavsItem } from '../type'

export interface RouteType {
	component: any;
	path: string;
}

const routes: RouteType[] = []
const componentMap: ImportMap = {}
const packages: RequireContext = require.context(
  '../../src/components',
  true,
  /demo\/index\.tsx$/
)

importAll(componentMap, packages)


function findNav (nav: NavsItem, lang: string): void {
  if (nav.list) {
    nav.list.forEach((item) => findNav(item, lang))
  } else {
    let { path } = nav

    if (path) {
      path = path.replace('/', '')

      const module = componentMap[`./${path}/demo/index.tsx`]
      // @ts-ignore
      const component = module ? module.default : null

      if (component) {
        routes.push({
          path: `/${lang}/${path}`,
          component
        })
      }
    }
  }
}

Object.keys(config).forEach((key: string) => {
  const lang = key as Lang
  const navs = config[lang].navs || []

  navs.forEach((nav) => {
    findNav(nav, lang)
  })
})

export default routes
