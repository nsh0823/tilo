import { Icon } from '@tilo/ui/components/icon';
import { Link } from 'expo-router';
import { User } from 'lucide-react-native';
import { Pressable } from 'react-native';

/** Header-right avatar from the Stitch header; opens the profile screen. */
export function HeaderAvatar() {
  return (
    <Link href="/profile" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile"
        hitSlop={6}
        className="h-8 w-8 items-center justify-center rounded-full bg-primary active:opacity-80"
      >
        <Icon as={User} size="md" className="text-primary-foreground" />
      </Pressable>
    </Link>
  );
}
