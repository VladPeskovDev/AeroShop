import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import useAuth from '../hooks/useAuth';

export default function SignInPage(): JSX.Element {
  const { signInHandler } = useAuth();
  return (
    <Flex justify="center">
      <Box
        as="form"
        onSubmit={signInHandler}
        bg={useColorModeValue('', 'gray.900')}
        w="lg"
        p={8}
        borderRadius="md"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          align="center"
          mb={4}
          color={useColorModeValue('gray.900', 'gray.100')}
        >
          Sign In
        </Text>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel color={useColorModeValue('gray.900', 'gray.100')}>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              name="email"
              bg={useColorModeValue('gray.100', 'gray.900')}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={useColorModeValue('gray.900', 'gray.100')}>Password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              bg={useColorModeValue('gray.100', 'gray.900')}
            />
            <Text mt={1} color={useColorModeValue('gray.900', 'gray.100')}>
              At least 8 characters long
            </Text>
          </FormControl>

          <Button type="submit" colorScheme="blue" w="full" mt={4}>
            sign in
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}