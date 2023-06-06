import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { routes } from '../constants/routes';

function BreadcrumbApp() {
    //Map app routes to breadcrumb Name
    const breadcrumbNameMap = routes.reduce((map, route) => {
        if (route.routes) {
            const nestedRoutes = route.routes;
            nestedRoutes.forEach((nestedRoute) => {
                if (nestedRoute.path !== undefined) {
                    const nestedPath = nestedRoute.path;
                    const path = `${route.path}/${nestedPath}`;
                    map[path] = nestedRoute.label;
                }
            });
        } else {
            map[route.path] = route.label;
        }
        map[route.path] = route.label;
        return map;
    }, {});
    //extra breadcrumb items from use location
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return {
            key: url,
            title: <Link to={url}>{breadcrumbNameMap[url]}</Link>
        };
    });

    return <Breadcrumb separator=">" items={extraBreadcrumbItems} />;
}

export default BreadcrumbApp;
