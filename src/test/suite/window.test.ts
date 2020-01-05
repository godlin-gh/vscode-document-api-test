// /*---------------------------------------------------------------------------------------------
//  *  Copyright (c) Microsoft Corporation. All rights reserved.
//  *  Licensed under the MIT License. See License.txt in the project root for license information.
//  *--------------------------------------------------------------------------------------------*/

// import * as assert from 'assert';
// import { workspace, window, commands, ViewColumn, TextEditorViewColumnChangeEvent, Uri, Selection, Position, CancellationTokenSource, TextEditorSelectionChangeKind } from 'vscode';
// import { join } from 'path';
// import { closeAllEditors, pathEquals, createRandomFile } from '../utils';

// suite('window namespace tests', () => {

// 	teardown(closeAllEditors);

//     // y
// 	test('editor, active text editor', async () => {
// 		const doc = await workspace.openTextDocument(join(workspace.rootPath || '', './far.js'));
// 		await window.showTextDocument(doc);
// 		const active = window.activeTextEditor;
// 		assert.ok(active);
// 		assert.ok(pathEquals(active!.document.uri.fsPath, doc.uri.fsPath));
// 	});

//     // y
// 	test('editor, opened via resource', () => {
// 		const uri = Uri.file(join(workspace.rootPath || '', './far.js'));
// 		return window.showTextDocument(uri).then((_editor) => {
// 			const active = window.activeTextEditor;
// 			assert.ok(active);
// 			assert.ok(pathEquals(active!.document.uri.fsPath, uri.fsPath));
// 		});
// 	});

// 	// test('editor, UN-active text editor', () => {
// 	// 	assert.equal(window.visibleTextEditors.length, 0);
// 	// 	assert.ok(window.activeTextEditor === undefined);
// 	// });

//     // vscode can open one same text document at different view columns at the same time, theia can't
// 	test('editor, assign and check view columns', async () => {
// 		// const doc = await workspace.openTextDocument(join(workspace.rootPath || '', './far.js'));
// 		// let p1 = window.showTextDocument(doc, ViewColumn.One).then(editor => {
// 		// 	assert.equal(editor.viewColumn, ViewColumn.One);
// 		// });
// 		// let p2 = window.showTextDocument(doc, ViewColumn.Two).then(editor_1 => {
// 		// 	assert.equal(editor_1.viewColumn, ViewColumn.Two);
// 		// });
// 		// let p3 = window.showTextDocument(doc, ViewColumn.Three).then(editor_2 => {
// 		// 	assert.equal(editor_2.viewColumn, ViewColumn.Three);
//         // });

//         // const [docA, docB, docC] = await Promise.all([
// 		// 	workspace.openTextDocument(await createRandomFile()),
//         //     workspace.openTextDocument(await createRandomFile()),
//         //     workspace.openTextDocument(await createRandomFile()),
//         // ]);
//         const [docA, docB, docC] = await Promise.all([
//             workspace.openTextDocument(join(workspace.rootPath || '', 'far.js')),
//             workspace.openTextDocument(join(workspace.rootPath || '', 'lorem.txt')),
//             workspace.openTextDocument(join(workspace.rootPath || '', 'simple.txt')),
// 		]);
//         let editor1 = await window.showTextDocument(docA, ViewColumn.One);
//         console.log('editor1', editor1.viewColumn);
//         assert.equal(editor1.viewColumn, ViewColumn.One);

//         let editor2 = await window.showTextDocument(docB, ViewColumn.Two);
//         console.log('editor2', editor2.viewColumn);
//         assert.equal(editor2.viewColumn, ViewColumn.Two);

//         let editor3 = await window.showTextDocument(docC, ViewColumn.Three);
//         console.log('editor3', editor3.viewColumn);
//         assert.equal(editor3.viewColumn, ViewColumn.Three);
// 	});

// 	test('editor, onDidChangeVisibleTextEditors', async () => {
// 		let eventCounter = 0;
// 		let reg = window.onDidChangeVisibleTextEditors(_editor => {
// 			eventCounter += 1;
// 		});

// 		const doc = await workspace.openTextDocument(join(workspace.rootPath || '', './far.js'));
// 		await window.showTextDocument(doc, ViewColumn.One);
// 		assert.equal(eventCounter, 1);

// 		await window.showTextDocument(doc, ViewColumn.Two);
// 		assert.equal(eventCounter, 2);

// 		await window.showTextDocument(doc, ViewColumn.Three);
// 		assert.equal(eventCounter, 3);

// 		reg.dispose();
// 	});

// 	test('editor, onDidChangeTextEditorViewColumn (close editor)', () => {

// 		let actualEvent: TextEditorViewColumnChangeEvent;

// 		let registration1 = workspace.registerTextDocumentContentProvider('bikes', {
// 			provideTextDocumentContent() {
// 				return 'mountainbiking,roadcycling';
// 			}
// 		});

// 		return Promise.all([
// 			workspace.openTextDocument(Uri.parse('bikes://testing/one')).then(doc => window.showTextDocument(doc, ViewColumn.One)),
// 			workspace.openTextDocument(Uri.parse('bikes://testing/two')).then(doc => window.showTextDocument(doc, ViewColumn.Two))
// 		]).then(async editors => {

// 			let [one, two] = editors;

// 			await new Promise(resolve => {
// 				let registration2 = window.onDidChangeTextEditorViewColumn(event => {
// 					actualEvent = event;
// 					registration2.dispose();
// 					resolve();
// 				});
// 				// close editor 1, wait a little for the event to bubble
// 				one.hide();
// 			});
// 			assert.ok(actualEvent);
// 			assert.ok(actualEvent.textEditor === two);
// 			assert.ok(actualEvent.viewColumn === two.viewColumn);

// 			registration1.dispose();
// 		});
// 	});

// 	test('editor, onDidChangeTextEditorViewColumn (move editor group)', () => {

// 		let actualEvents: TextEditorViewColumnChangeEvent[] = [];

// 		let registration1 = workspace.registerTextDocumentContentProvider('bikes', {
// 			provideTextDocumentContent() {
// 				return 'mountainbiking,roadcycling';
// 			}
// 		});

// 		return Promise.all([
// 			workspace.openTextDocument(Uri.parse('bikes://testing/one')).then(doc => window.showTextDocument(doc, ViewColumn.One)),
// 			workspace.openTextDocument(Uri.parse('bikes://testing/two')).then(doc => window.showTextDocument(doc, ViewColumn.Two))
// 		]).then(editors => {

// 			let [, two] = editors;
// 			two.show();

// 			return new Promise(resolve => {

// 				let registration2 = window.onDidChangeTextEditorViewColumn(event => {
// 					actualEvents.push(event);

// 					if (actualEvents.length === 2) {
// 						registration2.dispose();
// 						resolve();
// 					}
// 				});

// 				// move active editor group left
// 				return commands.executeCommand('workbench.action.moveActiveEditorGroupLeft');

// 			}).then(() => {
// 				assert.equal(actualEvents.length, 2);

// 				for (const event of actualEvents) {
// 					assert.equal(event.viewColumn, event.textEditor.viewColumn);
// 				}

// 				registration1.dispose();
// 			});
// 		});
// 	});

//     // y
// 	test('active editor not always correct... #49125', async function () {
// 		const [docA, docB] = await Promise.all([
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 		]);
// 		for (let c = 0; c < 4; c++) {
// 			let editorA = await window.showTextDocument(docA, ViewColumn.One);
// 			assert(window.activeTextEditor === editorA);

// 			let editorB = await window.showTextDocument(docB, ViewColumn.Two);
// 			assert(window.activeTextEditor === editorB);
// 		}
// 	});

// 	test('default column when opening a file', async () => {
// 		const [docA, docB, docC] = await Promise.all([
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile())
// 		]);

// 		await window.showTextDocument(docA, ViewColumn.One);
// 		await window.showTextDocument(docB, ViewColumn.Two);

// 		assert.ok(window.activeTextEditor);
// 		assert.ok(window.activeTextEditor!.document === docB);
// 		assert.equal(window.activeTextEditor!.viewColumn, ViewColumn.Two);

// 		const editor = await window.showTextDocument(docC);
// 		assert.ok(
// 			window.activeTextEditor === editor,
// 			`wanted fileName:${editor.document.fileName}/viewColumn:${editor.viewColumn} but got fileName:${window.activeTextEditor!.document.fileName}/viewColumn:${window.activeTextEditor!.viewColumn}. a:${docA.fileName}, b:${docB.fileName}, c:${docC.fileName}`
// 		);
// 		assert.ok(window.activeTextEditor!.document === docC);
// 		assert.equal(window.activeTextEditor!.viewColumn, ViewColumn.Two);
// 	});

// 	test('showTextDocument ViewColumn.BESIDE', async () => {
// 		const [docA, docB, docC] = await Promise.all([
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile())
// 		]);

// 		await window.showTextDocument(docA, ViewColumn.One);
// 		await window.showTextDocument(docB, ViewColumn.Beside);

// 		assert.ok(window.activeTextEditor);
// 		assert.ok(window.activeTextEditor!.document === docB);
// 		assert.equal(window.activeTextEditor!.viewColumn, ViewColumn.Two);

// 		await window.showTextDocument(docC, ViewColumn.Beside);

// 		assert.ok(window.activeTextEditor!.document === docC);
// 		assert.equal(window.activeTextEditor!.viewColumn, ViewColumn.Three);
// 	});

// 	test('showTextDocument ViewColumn is always defined (even when opening > ViewColumn.Nine)', async () => {
// 		const [doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10] = await Promise.all([
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile())
// 		]);

// 		await window.showTextDocument(doc1, ViewColumn.One);
// 		await window.showTextDocument(doc2, ViewColumn.Two);
// 		await window.showTextDocument(doc3, ViewColumn.Three);
// 		await window.showTextDocument(doc4, ViewColumn.Four);
// 		await window.showTextDocument(doc5, ViewColumn.Five);
// 		await window.showTextDocument(doc6, ViewColumn.Six);
// 		await window.showTextDocument(doc7, ViewColumn.Seven);
// 		await window.showTextDocument(doc8, ViewColumn.Eight);
// 		await window.showTextDocument(doc9, ViewColumn.Nine);
// 		await window.showTextDocument(doc10, ViewColumn.Beside);

// 		assert.ok(window.activeTextEditor);
// 		assert.ok(window.activeTextEditor!.document === doc10);
// 		assert.equal(window.activeTextEditor!.viewColumn, 10);
// 	});

// 	test('issue #27408 - showTextDocument & vscode.diff always default to ViewColumn.One', async () => {
// 		const [docA, docB, docC] = await Promise.all([
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile()),
// 			workspace.openTextDocument(await createRandomFile())
// 		]);

// 		await window.showTextDocument(docA, ViewColumn.One);
// 		await window.showTextDocument(docB, ViewColumn.Two);

// 		assert.ok(window.activeTextEditor);
// 		assert.ok(window.activeTextEditor!.document === docB);
// 		assert.equal(window.activeTextEditor!.viewColumn, ViewColumn.Two);

// 		await window.showTextDocument(docC, ViewColumn.Active);

// 		assert.ok(window.activeTextEditor!.document === docC);
// 		assert.equal(window.activeTextEditor!.viewColumn, ViewColumn.Two);
// 	});

//     // y
// 	test('issue #5362 - Incorrect TextEditor passed by onDidChangeTextEditorSelection', (done) => {
// 		const file10Path = join(workspace.rootPath || '', './10linefile.ts');
// 		const file30Path = join(workspace.rootPath || '', './30linefile.ts');

// 		let finished = false;
// 		let failOncePlease = (err: Error) => {
// 			if (finished) {
// 				return;
// 			}
// 			finished = true;
// 			done(err);
// 		};

// 		let passOncePlease = () => {
// 			if (finished) {
// 				return;
// 			}
// 			finished = true;
// 			done(null);
// 		};

// 		let subscription = window.onDidChangeTextEditorSelection((e) => {
// 			let lineCount = e.textEditor.document.lineCount;
// 			let pos1 = e.textEditor.selections[0].active.line;
// 			let pos2 = e.selections[0].active.line;

// 			if (pos1 !== pos2) {
// 				failOncePlease(new Error('received invalid selection changed event!'));
// 				return;
// 			}

// 			if (pos1 >= lineCount) {
// 				failOncePlease(new Error(`Cursor position (${pos1}) is not valid in the document ${e.textEditor.document.fileName} that has ${lineCount} lines.`));
// 				return;
// 			}
// 		});

// 		// Open 10 line file, show it in slot 1, set cursor to line 10
// 		// Open 30 line file, show it in slot 1, set cursor to line 30
// 		// Open 10 line file, show it in slot 1
// 		// Open 30 line file, show it in slot 1
// 		workspace.openTextDocument(file10Path).then((doc) => {
// 			return window.showTextDocument(doc, ViewColumn.One);
// 		}).then((editor10line) => {
// 			editor10line.selection = new Selection(new Position(9, 0), new Position(9, 0));
// 		}).then(() => {
// 			return workspace.openTextDocument(file30Path);
// 		}).then((doc) => {
// 			return window.showTextDocument(doc, ViewColumn.One);
// 		}).then((editor30line) => {
// 			editor30line.selection = new Selection(new Position(29, 0), new Position(29, 0));
// 		}).then(() => {
// 			return workspace.openTextDocument(file10Path);
// 		}).then((doc) => {
// 			return window.showTextDocument(doc, ViewColumn.One);
// 		}).then(() => {
// 			return workspace.openTextDocument(file30Path);
// 		}).then((doc) => {
// 			return window.showTextDocument(doc, ViewColumn.One);
// 		}).then(() => {
// 			subscription.dispose();
// 		}).then(passOncePlease, failOncePlease);
// 	});

//     // y
// 	test('#7013 - input without options', function () {
// 		const source = new CancellationTokenSource();
// 		let p = window.showInputBox(undefined, source.token);
// 		assert.ok(typeof p === 'object');
// 		source.dispose();
// 	});

// });
