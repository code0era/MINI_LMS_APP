import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Button } from "./ui/Button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Here we could report to Sentry
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-surface-DEFAULT">
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-6xl mb-4">💥</Text>
            <Text className="text-2xl font-bold text-text-primary mb-2 text-center">
              Oops! Something went wrong.
            </Text>
            <Text className="text-base text-text-secondary text-center mb-8">
              We've been notified and are looking into it.
            </Text>
            
            <Button
              label="Try Again"
              onPress={this.handleReset}
              variant="primary"
              className="min-w-[200px]"
            />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
