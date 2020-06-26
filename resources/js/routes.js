// pages
const Story = () => import("./pages/Story");
const Scenarios = () => import("./pages/Scenarios");
const Achievements = () => import("./pages/Achievements");
const Map = () => import("./pages/Map");
const Info = () => import("./pages/Info");
const Campaigns = () => import("./pages/Campaigns");
const Login = () => import("./pages/Login");

export default [
    {path: '/', redirect: '/story'},
    {path: '/story', component: Story},
    {path: '/scenarios', component: Scenarios},
    {path: '/map', component: Map},
    {path: '/achievements', component: Achievements},
    {path: '/info', component: Info},
    {path: '/campaigns', component: Campaigns},
    {path: '/login/:id/:token', component: Login},
];
