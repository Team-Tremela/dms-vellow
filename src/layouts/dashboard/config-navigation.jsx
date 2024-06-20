import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Motor Management',
    path: '/motor-management',
    icon: icon('ic_user'),
  },
  {
    title: 'Inventory Management',
    path: '/inventory-management',
    icon: icon('ic_inventory'),
  },
  {
    title: 'product',
    path: '/#',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/#',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
