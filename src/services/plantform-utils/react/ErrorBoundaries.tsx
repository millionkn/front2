import { Component, createContext, FC } from "react";

export const ErrorBoundariesContext = createContext<(e: any) => JSX.Element>(() => <></>)

type ErrorBoundariesProps = {
  hasError: boolean,
  error: any,
}

export class ErrorBoundaries extends Component<{}, ErrorBoundariesProps> {
  static getDerivedStateFromError(error: any): ErrorBoundariesProps {
    return {
      hasError: true,
      error,
    }
  }
  constructor(props: {}) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }
  static contextType = ErrorBoundariesContext
  declare context: React.ContextType<typeof ErrorBoundariesContext>
  componentDidCatch(e:any){
    console.log(e)
  }
  render() {
    if (this.state.hasError) {
      return this.context(this.state.error)
    } else {
      return this.props.children
    }
  }
}