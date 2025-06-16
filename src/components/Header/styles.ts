import { styled } from '@mui/material/styles';
import { AppBar, IconButton } from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  boxShadow: '0px 2px 2px 0px rgba(157, 172, 207, 0.20)',
  backgroundColor: '#FFF',
  zIndex: theme.zIndex.drawer + 1,

  // Темный режим
  ...theme.applyStyles('dark', {
    backgroundColor: '#000',
  }),
}));

export { StyledAppBar };
