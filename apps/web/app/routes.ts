import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [index('routes/home.tsx'), 
    route('demo', 'routes/demo.tsx'), 
    route('main', 'routes/landingPage.tsx'),
    route('lobby/:room', 'routes/lobby.tsx'),
    route('leaderboard', 'routes/leaderboard.tsx'),
    route('profile', 'routes/profile.tsx'),
    route('how-to-play', 'routes/howToPlay.tsx'),
    route('privacy', 'routes/privacy.tsx'),
    route('terms', 'routes/terms.tsx'),
    route('*', 'routes/notFound.tsx'), // catch-all
] satisfies RouteConfig
