import type { ComponentRef } from 'react';
import type { SandpackFiles } from "@codesandbox/sandpack-react";

import { useRef, useState } from 'react';
import { cyberpunk } from "@codesandbox/sandpack-themes";
import { NoSymbolIcon, ArrowPathIcon, CodeBracketIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

import {
	useSandpack,
	SandpackConsole,
	SandpackPreview,
	SandpackProvider,
	SandpackCodeEditor,
	UnstyledOpenInCodeSandboxButton,
} from "@codesandbox/sandpack-react";

type Tabs = 'preview' | 'console';

interface EditorProps {
	dir: string;
	title: string;
	files: SandpackFiles;
}

const RefreshButton = () => {
	const { dispatch } = useSandpack();

	const handleRefresh = () => {
		dispatch({ type: "refresh" });
	};

	return (
		<button type="button" onClick={handleRefresh}>
			<ArrowPathIcon className="playground-icon" />
		</button>
	);
};

// @NOTE
// - Heavily inspired by:
// - https://www.joshwcomeau.com/react/next-level-playground/
export const Editor = ({ dir, title, files }: EditorProps) => {
	// @NOTE
	// - https://github.com/codesandbox/sandpack/issues/730
	const consoleRef = useRef<ComponentRef<typeof SandpackConsole>>(null);

	const [activeTab, setActiveTab] = useState<Tabs>('preview');

	const link = `https://github.com/chopfitzroy/exo-ui/tree/main/apps/exo-ui.dev/src/examples/${dir}`;

	const isPreviewActive = activeTab === 'preview';
	const isConsoleActive = activeTab === 'console';

	const handlePreviewTab = () => setActiveTab('preview');
	const handleConsoleTab = () => setActiveTab('console');

	const handleClear = () => {
		if (consoleRef.current !== null) {
			consoleRef.current.reset();
		}
	}

	return (
		<div className="playground">
			<SandpackProvider
				files={files}
				theme={cyberpunk}
				template="react-ts"
				customSetup={{
					dependencies: {
						"@vistas/exo-ui": "latest"
					}
				}}
			>
				<div className="playground-controls">
					<p>{title}</p>
					<div className="playground-external">
						<a href={link} title="View on GitHub" target="_blank" className="playground-button">
							<CodeBracketIcon className="playground-icon" />
						</a>
						<UnstyledOpenInCodeSandboxButton className="playground-button">
							<ArrowTopRightOnSquareIcon className="playground-icon" />
						</UnstyledOpenInCodeSandboxButton>
					</div>
				</div>
				<div className="playground-editor">
					<SandpackCodeEditor />
				</div>
				<div className="playground-controls">
					<div className="playground-tabs">
						<button onClick={handlePreviewTab} className={`playground-tab ${isPreviewActive ? 'active' : ''}`}>Preview</button>
						<button onClick={handleConsoleTab} className={`playground-tab ${isConsoleActive ? 'active' : ''}`}>Console</button>
					</div>
					{isPreviewActive && (
						<RefreshButton />
					)}
					{isConsoleActive && (
						<button type="button" onClick={handleClear}>
							<NoSymbolIcon className="playground-icon" />
						</button>
					)}
				</div>
				<div className="playground-outputs">
					<div className={`playground-preview ${isPreviewActive ? 'active' : ''}`}>
						<SandpackPreview
							showRefreshButton={false}
							showOpenInCodeSandbox={false}
						/>
					</div>
					<div className={`playground-console ${isConsoleActive ? 'active' : ''}`}>
						<SandpackConsole ref={consoleRef} />
					</div>
				</div>
			</SandpackProvider>
		</div>
	)
};