import type { ComponentRef } from 'react';
import type { SandpackFiles } from "@codesandbox/sandpack-react";

import { useRef } from 'react';
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

interface EditorProps {
	dir: string;
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
export const Editor = ({ dir, files }: EditorProps) => {
	// @NOTE
	// - https://github.com/codesandbox/sandpack/issues/730
	const consoleRef = useRef<ComponentRef<typeof SandpackConsole>>(null);

	const link = `https://github.com/chopfitzroy/exo-ui/tree/main/apps/exo-ui.dev/src/examples/${dir}`;

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
					<a href={link} title="View on GitHub" target="_blank" className="playground-button">
						<CodeBracketIcon className="playground-icon" />
					</a>
					<UnstyledOpenInCodeSandboxButton className="playground-button">
						<ArrowTopRightOnSquareIcon className="playground-icon" />
					</UnstyledOpenInCodeSandboxButton>
				</div>
				<div className="playground-editor">
					<SandpackCodeEditor />
				</div>
				<div className="playground-controls">
					<button type="button" onClick={handleClear}>
						<NoSymbolIcon className="playground-icon" />
					</button>
					<RefreshButton />
				</div>
				<div className="playground-preview">
					<SandpackPreview
						showRefreshButton={false}
						showOpenInCodeSandbox={false}
					/>
					<SandpackConsole ref={consoleRef} />
				</div>
			</SandpackProvider>
		</div>
	)
};