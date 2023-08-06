import type { SandpackFiles } from "@codesandbox/sandpack-react";

import { cyberpunk } from "@codesandbox/sandpack-themes";
import { CodeBracketIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

import {
	SandpackConsole,
	SandpackPreview,
	SandpackProvider,
	SandpackCodeEditor,
	UnstyledOpenInCodeSandboxButton,
} from "@codesandbox/sandpack-react";

interface EditorProps {
	dir: string;
	files: SandpackFiles;
	active: string;
}

// @NOTE
// - Heavily inspired by:
// - https://www.joshwcomeau.com/react/next-level-playground/
export const Editor = ({ dir, files, active }: EditorProps) => {
	const link = `https://github.com/chopfitzroy/exo-ui/tree/main/apps/exo-ui.dev/src/examples/${dir}`;

	return (
		<div className="playground">
			<SandpackProvider
				files={files}
				theme={cyberpunk}
				template="react-ts"
				options={{
					activeFile: active,
					bundlerURL: "https://sandpack-bundler.pages.dev"
				}}
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
				<div className="playground-preview">
					<SandpackPreview
						showRefreshButton={false}
						showOpenInCodeSandbox={false}
					/>
					<SandpackConsole />
				</div>
			</SandpackProvider>
		</div>
	)
};