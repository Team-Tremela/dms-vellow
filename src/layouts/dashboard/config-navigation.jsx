import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Motor Management',
    path: '/dashboard/motor',
    icon: icon('ic_user'),
  },
  {
    title: 'Inventory Management',
    path: '/dashboard/inventory',
    icon: icon('ic_inventory'),
  },
  {
    title: 'Dealer Management',
    path: '/dashboard/dealer',
    icon: icon('ic_cart'),
  },
  {
    title: 'Report',
    path: '/#',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;