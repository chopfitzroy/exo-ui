import React from 'react';
import Styles from './Editor.module.css';

import { cyberpunk } from "@codesandbox/sandpack-themes";

import {
	SandpackProvider,
	SandpackCodeEditor,
	SandpackPreview,
} from "@codesandbox/sandpack-react";

export const Editor = (props: Parameters<typeof SandpackProvider>) => (
	<div className={Styles.editor}>
		<SandpackProvider
			{...props}
			theme={cyberpunk}
			template="react-ts"
		>
			<SandpackCodeEditor />
			<div className={Styles.preview}>
				<SandpackPreview />
			</div>
		</SandpackProvider>
	</div>
)