'use client';

import React from 'react';
import { Toolbar, Typography, IconButton, Link, Icon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';

import { StyledAppBar } from './styles';

const Header: React.FC = () => {
  return (
    <StyledAppBar position="fixed" elevation={0}>
      <Toolbar sx={(theme) => ({ color: theme.palette.text.primary })}>
        <IconButton size="large" edge="start" color="primary" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={34} height={38} />
        </Link>
        <Typography variant="h1" component="h1" sx={{ flexGrow: 1, ml: 1 }}>
          Система обеспечения законодательной деятельности
        </Typography>
        <IconButton edge="end" color="primary" aria-label="menu">
          <Icon className="icon-user-round" />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
