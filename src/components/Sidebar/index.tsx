'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import { MENU_CONFIG, IMenuItem } from '@/config/menu.config';

import { StyledDrawer } from './styles';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const handleItemClick = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const renderMenuItems = (items: IMenuItem[], level = 0) => {
    return items.map((item) => (
      <React.Fragment key={item.path}>
        <ListItem disablePadding>
          <ListItemButton sx={{ pl: 2 + level * 2 }} onClick={() => handleItemClick(item.path)}>
            {item.icon && (
              <ListItemIcon>
                <Box
                  sx={(theme) => ({ width: 24, height: 24, textAlign: 'center', color: theme.palette.primary.main })}
                >
                  <Icon className={item.icon} />
                </Box>
              </ListItemIcon>
            )}
            <ListItemText primary={item.title} />
          </ListItemButton>
        </ListItem>
        {item.children && (
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {renderMenuItems(item.children, level + 1)}
          </List>
        )}
      </React.Fragment>
    ));
  };

  return (
    <StyledDrawer component="nav" variant="persistent" open>
      <List>{MENU_CONFIG.map((section) => renderMenuItems([section]))}</List>
    </StyledDrawer>
  );
};

export default Sidebar;
