/**
 * 导航守卫
 */
import { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

export default withRouter((props: RouteComponentProps) => {
  useEffect(() => {
    // @ts-ignore
    window.collectEvent('predefinePageView', {
      route: window.location.hash.slice(1),
      type: '0', // PC端窗口 type 为 0
    })
  }, [location.hash])

  return null
});

