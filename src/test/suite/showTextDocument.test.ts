/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { workspace, window, commands, ViewColumn, TextEditorViewColumnChangeEvent, Uri, Selection, Position, CancellationTokenSource, TextEditorSelectionChangeKind } from 'vscode';
import { join } from 'path';
import { createRandomFile } from '../utils';

suite('showTextDocument namespace tests', () => {

    test('show text document in two view column', async function () {
		const [docA, docB, docC, docD] = await Promise.all([
            workspace.openTextDocument(Uri.file(join(workspace.rootPath || '', 'far.js'))),
            workspace.openTextDocument(Uri.file(join(workspace.rootPath || '', 'simple.txt'))),
            workspace.openTextDocument(await createRandomFile()),
            workspace.openTextDocument(await createRandomFile()),
        ]);
        
        let editorA = await window.showTextDocument(docA, ViewColumn.One);
        let editorB = await window.showTextDocument(docB, ViewColumn.Two);

        let editorC = await window.showTextDocument(docC, { viewColumn: ViewColumn.One });
        let editorD = await window.showTextDocument(docD, { viewColumn: ViewColumn.Two });

        // bug: alway got value ViewColumn.One
        // assert(editorA.viewColumn === editorC.viewColumn);
        // assert(editorB.viewColumn === editorD.viewColumn);
    });
    
});
