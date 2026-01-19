'use client';

import { useEffect, useState } from 'react';
import { checkDatabaseHealth } from '@/app/actions';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type DatabaseStatusState = 'checking' | 'online' | 'offline';

/**
 * Client component that displays database connection status
 */
function DatabaseStatus() {
	const [status, setStatus] = useState<DatabaseStatusState>('checking');

	useEffect(() => {
		async function checkHealth() {
			try {
				const result = await checkDatabaseHealth();
				setStatus(result.status);
			} catch {
				setStatus('offline');
			}
		}

		// Initial check
		checkHealth();
	}, []);

	/**
	 * Get CSS classes for status indicator based on current status
	 */
	function getStatusClasses(): string {
		switch (status) {
			case 'checking':
				return `w-2.5 h-2.5 rounded-full inline-block bg-yellow-500 animate-pulse`;
			case 'online':
				return `w-2.5 h-2.5 rounded-full inline-block bg-green-500`;
			case 'offline':
				return `w-2.5 h-2.5 rounded-full inline-block bg-red-500`;
		}
	}

	/**
	 * Get tooltip message based on current status
	 */
	function getTooltipMessage(): string {
		switch (status) {
			case 'checking':
				return 'Vérification du status...';
			case 'online':
				return `Base de données : connectée`;
			case 'offline':
				return 'Base de données : hors ligne';
		}
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="flex items-center gap-2 cursor-default">
					<span className={getStatusClasses()} aria-hidden="true" />
					<span className="text-sm text-gray-500">Supabase</span>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<p>{getTooltipMessage()}</p>
			</TooltipContent>
		</Tooltip>
	);
}

export default DatabaseStatus;
