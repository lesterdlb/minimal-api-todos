import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
	return (
		<div
			style={{
				padding: '20px',
				textAlign: 'center',
				backgroundColor: '#f8d7da',
				color: '#721c24',
				borderRadius: '5px',
				margin: '20px',
			}}
		>
			<h2>Something went wrong</h2>
			<p>{error.message || 'Unknown error'}</p>
			<button
				onClick={resetErrorBoundary}
				style={{
					marginTop: '10px',
					padding: '8px 16px',
					backgroundColor: '#721c24',
					color: 'white',
					border: 'none',
					borderRadius: '4px',
					cursor: 'pointer',
				}}
			>
				Try again
			</button>
		</div>
	);
}

const ErrorBoundary = ({ children }: Props) => {
	return (
		<ReactErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={(error, errorInfo) => {
				console.error('Error caught by ErrorBoundary:', error, errorInfo);
			}}
			onReset={() => {
				window.location.href = '/';
			}}
		>
			{children}
		</ReactErrorBoundary>
	);
};

export default ErrorBoundary;
