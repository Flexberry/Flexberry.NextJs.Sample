import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const MainContent = styled(Box)(({ theme }) => ({
  marginTop: theme.mixins.toolbar.minHeight,
  marginLeft: '240px',
  width: 'calc(100% - 240px)',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  height: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2, 2),
}));

export { MainContent };
