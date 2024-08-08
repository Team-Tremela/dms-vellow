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
    title: 'Vendor',
    path: '/dashboard/motor',
    icon: icon('ic_vendor'),
  },
  {
    title: 'Spare',
    path: '/dashboard/spare',
    icon: icon('ic_spare'),
  },
  {
    title: 'Accessory',
    path: '/dashboard/accessory',
    icon: icon('ic_acc'),
  },
  {
    title: 'Vehicle',
    path: '/dashboard/vechicles',
    icon: icon('ic_bike'),
  },
  {
    title: 'Service',
    path: '/dashboard/service',
    icon: icon('ic_service'),
  },
  {
    title: 'Dealer',
    path: '/dashboard/dealer',
    icon: icon('ic_dealer'),
  },
  {
    title: 'Reports',
    path: '/dashboard/reports',
    icon: icon('ic_blog'),
  },
  // {
  //   title: 'login',
  //   path: '/',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;