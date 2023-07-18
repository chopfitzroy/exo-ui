import React from 'react';

import { cyberpunk } from "@codesandbox/sandpack-themes";

import {
	SandpackProvider,
	SandpackCodeEditor,
	SandpackPreview,
} from "@codesandbox/sandpack-react";

export const Editor = () => (
	<SandpackProvider theme={cyberpunk} template="react">
		<div>
			<SandpackCodeEditor />
			<SandpackPreview />
		</div>
	</SandpackProvider>
)