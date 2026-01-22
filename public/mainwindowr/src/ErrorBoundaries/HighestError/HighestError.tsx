import React, { Component, ReactNode } from 'react';
import './HighestError.scss';
import { ErrorInfo } from 'react-dom/client';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class HighestError extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Критическая ошибка React:", error, errorInfo);
  }
  private handleGlobalErrors = (event: ErrorEvent | PromiseRejectionEvent) => {
    const error = event instanceof ErrorEvent 
        ? event.error 
        : new Error(event.reason?.message || "Unhandled Promise Rejection");

    this.setState({
      hasError: true,
      error: error
    });
  }

  public componentDidMount() {
    // Вешаем слушателей на все ошибки в окне браузера
    window.addEventListener('error', this.handleGlobalErrors);
    window.addEventListener('unhandledrejection', this.handleGlobalErrors);
    
  }

  public componentWillUnmount() {
    // Обязательно чистим за собой
    window.removeEventListener('error', this.handleGlobalErrors);
    window.removeEventListener('unhandledrejection', this.handleGlobalErrors);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="HighestError">
          <span className='error_text'>Упс! Что-то пошло не так :C</span>
          <div className="error_action_row">
            <button className='btn btn_primary' onClick={() => window.location.reload()}>Перезагрузить</button>
            <button className='btn btn_danger' onClick={() => mw.closeWindow()}>Закрыть</button>
          </div>
        </div>
      );
    }
    return this.props.children
  }
}

