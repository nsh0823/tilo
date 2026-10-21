import { Button, ButtonSpinner, ButtonText } from '@tilo/ui/components/button';
import { Input, InputField } from '@tilo/ui/components/input';
import { Text } from '@tilo/ui/components/text';
import { VStack } from '@tilo/ui/components/vstack';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSignIn } from '@/hooks/useAuth';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignIn();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <VStack className="flex-1 justify-center gap-space-lg px-margin-mobile">
        <VStack className="gap-space-xs">
          <Text variant="display-xl-mobile">Welcome</Text>
          <Text variant="body-lg" className="text-muted-foreground">
            Sign in to continue to tilo.
          </Text>
        </VStack>

        <VStack className="gap-space-sm">
          <Input>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </Input>
          <Input>
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </Input>
        </VStack>

        {signIn.error ? (
          <Text variant="body-sm" className="text-destructive">
            {signIn.error.message}
          </Text>
        ) : null}

        <Button
          onPress={() => signIn.mutate({ email, password })}
          isDisabled={signIn.isPending || !email || !password}
        >
          {signIn.isPending ? <ButtonSpinner /> : null}
          <ButtonText>Sign In</ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
}
