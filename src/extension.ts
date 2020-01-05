// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as assert from 'assert';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-document-api-test" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
    // 	// The code you place here will be executed every time your command is executed

    // 	// Display a message box to the user
    // 	vscode.window.showInformationMessage('Hello World!');
    // });

    // context.subscriptions.push(disposable);

    await vscode.commands.executeCommand('workbench.action.closeAllEditors');

    context.subscriptions.push(vscode.commands.registerCommand('document.open', async () => {
        // const result = await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(path.join(vscode.workspace.rootPath || '', 'far.js')));
        // const editor = vscode.window.activeTextEditor;
        // if (editor) {
        //     vscode.window.showInformationMessage(`editor viewColumn: ${editor.viewColumn}`);
        // }

        const docA = await vscode.workspace.openTextDocument(path.join(vscode.workspace.rootPath || '', 'lorem.txt'));
        const docB = await vscode.workspace.openTextDocument(path.join(vscode.workspace.rootPath || '', 'simple.txt'));
        
        let editorA = await vscode.window.showTextDocument(docA, vscode.ViewColumn.One);
        let editorB = await vscode.window.showTextDocument(docB, vscode.ViewColumn.Two);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('document.diff', async () => {
        const uri = vscode.Uri.file(path.join(vscode.workspace.rootPath || '', 'far.js'));
        await vscode.commands.executeCommand('vscode.diff', uri, uri, 'diff', { viewColumn: vscode.ViewColumn.One });

        const uriB = vscode.Uri.file(path.join(vscode.workspace.rootPath || '', 'bower.json'));
        await vscode.commands.executeCommand('vscode.diff', uriB, uriB, 'diffB', { viewColumn: vscode.ViewColumn.Two });
    }));


    context.subscriptions.push(vscode.commands.registerCommand('document.showTextDocument', async () => {
        const doc = await vscode.workspace.openTextDocument(path.join(vscode.workspace.rootPath || '', 'far.js'));
        const editor = await vscode.window.showTextDocument(doc, vscode.ViewColumn.One);
        vscode.window.showInformationMessage(`editor viewColumn: ${editor.viewColumn}`);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('document.showTextDocument2', async () => {
        const doc = await vscode.workspace.openTextDocument(path.join(vscode.workspace.rootPath || '', './far.js'));
        const doc2 = await vscode.workspace.openTextDocument(path.join(vscode.workspace.rootPath || '', 'lorem.txt'));
        // const doc3 = await vscode.workspace.openTextDocument(path.join(vscode.workspace.rootPath || '', './simple.txt'));
		const editor = await vscode.window.showTextDocument(doc, vscode.ViewColumn.One);
        vscode.window.showInformationMessage(`editor viewColumn: ${editor.viewColumn}`);

        const editor2 = await vscode.window.showTextDocument(doc2, vscode.ViewColumn.Two);
        vscode.window.showInformationMessage(`editor2 viewColumn: ${editor2.viewColumn}`);
        // let p3 = vscode.window.showTextDocument(doc3, vscode.ViewColumn.Three).then(editor3 => {
		// 	vscode.window.showInformationMessage(`editor3 viewColumn: ${editor3.viewColumn}`);
        // });
        // return Promise.all([p1, p2, p3]);
        // return Promise.all([p1, p2]);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('document.showAllViewColumn', async () => {
        const editors = vscode.window.visibleTextEditors;
        editors.forEach(editor => {
            vscode.window.showInformationMessage(`${editor.document.fileName} viewColumn = ${editor && editor.viewColumn}`);
        });
        
    }));

}

// this method is called when your extension is deactivated
export function deactivate() { }
