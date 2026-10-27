import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [index('routes/home.tsx'), 
    route('demo', 'routes/demo.tsx'), 
    route('main', 'routes/landingPage.tsx'),
    route('*', 'routes/notFound.tsx'), // catch-all
] satisfies RouteConfig
