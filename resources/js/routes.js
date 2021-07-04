const Story = () => import("./pages/Story");
const Scenarios = () => import("./pages/Scenarios");
const Achievements = () => import("./pages/Achievements");
const Map = () => import("./pages/Map");
const Info = () => import("./pages/Info");
const Campaigns = () => import("./pages/Campaigns");
const Login = () => import("./pages/Login");
const Party = () => import("./pages/Party");
const Characters = () => import("./pages/Characters");
const Items = () => import("./pages/Items");
const Shared = () => import("./pages/Shared");
const Settings = () => import("./pages/Settings");

export default [
    {path: '/', redirect: '/story'},
    {path: '/story/:id?', component: Story},
    {path: '/scenarios', component: Scenarios},
    {path: '/map', component: Map},
    {path: '/achievements', component: Achievements},
    {path: '/info', name: 'info', component: Info, props: true},
    {path: '/campaigns', component: Campaigns},
    {path: '/party', component: Party},
    {path: '/characters', component: Characters},
    {path: '/items', component: Items},
    {path: '/login/:id/:token', component: Login},
    {path: '/settings', component: Settings},
    {path: '/shared/:version/:id/:storage', component: Shared},
    {path: '*', redirect: '/story'},
];
