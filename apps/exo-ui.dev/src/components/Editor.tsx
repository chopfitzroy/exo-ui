import React from 'react';

import { cyberpunk } from "@codesandbox/sandpack-themes";

import {
	SandpackProvider,
	SandpackCodeEditor,
	SandpackPreview,
} from "@codesandbox/sandpack-react";

export const Editor = (props: Parameters<typeof SandpackProvider>) => (
	<SandpackProvider
		{...props}
		theme={cyberpunk}
		template="react-ts"
	>
		<SandpackCodeEditor />
		<SandpackPreview />
	</SandpackProvider>
)