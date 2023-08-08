// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const iconimg = <img src={`/assets/images/avatars/user.png`} alt="test" style={{width:'24px'}}/>;
const ticketimg = <img src={`/assets/images/tickets.png`} alt="test" style={{width:'24px'}}/>;

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Customers',
    path: '/customer',
    icon: icon('ic_user'),
  },
  {
    title: 'Tickets',
    path: '/tickets',
    icon: ticketimg,
  },
  {
    title: 'Track Tickets',
    path: '/tracktickets',
    icon: ticketimg,
  },
  {
    title: 'Users Profile',
    path: '/editprofile',
    icon: iconimg,
  },
  
];

export default navConfig;
