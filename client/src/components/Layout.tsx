import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import NavBar from './ui/NavBar';

export default function Layout():JSX.Element {
  return (
    <Container maxW="container.xl">
      <NavBar/>
      <Outlet />
    </Container>
  );
}
