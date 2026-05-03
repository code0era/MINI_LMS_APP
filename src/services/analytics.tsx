import React, { useEffect } from "react";
import * as Sentry from "@sentry/react-native";
import { usePostHog, PostHogProvider } from "posthog-react-native";
import { SENTRY_DSN, POSTHOG_KEY, POSTHOG_HOST } from "../constants/env";
import { useAuthStore } from "../store/authStore";

// Initialize Sentry
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    _experiments: {
      profilesSampleRate: 1.0,
    },
  });
}

function PostHogAuthSync({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (posthog && user) {
      posthog.identify(user._id, {
        email: user.email,
        username: user.username,
      });
    } else if (posthog && !user) {
      posthog.reset();
    }
  }, [user, posthog]);

  return <>{children}</>;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (!POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider
      apiKey={POSTHOG_KEY}
      options={{
        host: POSTHOG_HOST,
        captureNativeNavigationEvents: false

      }}
    >
      <PostHogAuthSync>{children}</PostHogAuthSync>
    </PostHogProvider>
  );
}

// Export a higher-order component to wrap the root layout with Sentry
export const withAnalytics = (WrappedComponent: React.ComponentType) => {
  const SentryWrapped = SENTRY_DSN ? Sentry.wrap(WrappedComponent) : WrappedComponent;

  return function WithAnalytics(props: any) {
    return (
      <AnalyticsProvider>
        <SentryWrapped {...props} />
      </AnalyticsProvider>
    );
  };
};
