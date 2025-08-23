import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Une erreur est survenue</AlertTitle>
            <AlertDescription>
              {this.state.error?.message ||
                "Une erreur inattendue s'est produite"}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
            >
              Réessayer
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
