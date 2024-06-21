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
    title: 'Motor Managemnet',
    path: '/motor',
    icon: icon('ic_user'),
  },
  {
    title: 'Inventory Managemnet',
    path: '/inventory',
    icon: icon('ic_inventory'),
  },
  {
    title: 'Dealer',
    path: '/#',
    icon: icon('ic_cart'),
  },
  {
    title: 'Report',
    path: '/#',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;