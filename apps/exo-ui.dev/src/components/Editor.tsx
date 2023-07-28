import { cyberpunk } from "@codesandbox/sandpack-themes";

import {
	SandpackProvider,
	SandpackCodeEditor,
	SandpackPreview,
} from "@codesandbox/sandpack-react";

export const Editor = (props: Parameters<typeof SandpackProvider>) => (
	<div className="playground">
		<SandpackProvider
			{...props}
			theme={cyberpunk}
			template="react-ts"
			options={{ bundlerURL: "https://sandpack-bundler.pages.dev" }}
			customSetup={{
				dependencies: {
					"@vistas/exo-ui": "latest"
				}
			}}
		>
			<div className="playground-editor">
				<SandpackCodeEditor />
			</div>
			<div className="playground-preview">
				<SandpackPreview />
			</div>
		</SandpackProvider>
	</div>
)