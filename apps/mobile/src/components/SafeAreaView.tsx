import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

/**
 * `SafeAreaView` from react-native-safe-area-context with `className` support.
 * Uniwind only styles React Native's core components; third-party ones need `withUniwind`,
 * otherwise their `className` is silently dropped.
 */
export const SafeAreaView = withUniwind(RNSafeAreaView);
