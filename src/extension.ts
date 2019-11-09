// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "go-local-playground" is now active!');

	let localPlayGround = new LocalPlayGround();
	let disposable = vscode.commands.registerCommand('extension.GoPlayground', () => {
		localPlayGround.newPlayground(context.extensionPath);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('extension.reopenGoPlayground', () => {
		localPlayGround.reopenPlayground(context.extensionPath);
	});
	context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
export function deactivate() { }


class LocalPlayGround {

	private logger: vscode.OutputChannel;

	constructor() {
		this.logger = vscode.window.createOutputChannel('output');
	}

	newPlayground(basePath: string) {
		let playgroundsrc = basePath + '/playgroundsrc/';
		if (!fs.existsSync(playgroundsrc)) {
			fs.mkdirSync(playgroundsrc);
		}
		let maingoFilename = playgroundsrc + new Date().toISOString().substr(0, 10) + '-' + Math.random().toString(36).substr(9) + '/';
		if (!fs.existsSync(maingoFilename)) {
			fs.mkdirSync(maingoFilename);
		}
		maingoFilename = maingoFilename + 'main.go';
		const options = {
			// 是否预览，默认true，预览的意思是下次再打开文件是否会替换当前文件
			preview: false,
		};
		vscode.workspace.fs.copy(vscode.Uri.file(basePath + "/main.go"), vscode.Uri.file(maingoFilename)).then(result => {
			vscode.window.showTextDocument(vscode.Uri.file(maingoFilename), options);
			fs.writeFileSync(basePath + '/current', maingoFilename);
		});
	}

	reopenPlayground(basePath: string) {
		let currentFile = basePath + '/current';
		this.logger.append(fs.readFileSync(currentFile).toString());
		vscode.window.showTextDocument(vscode.Uri.file(fs.readFileSync(currentFile).toString()));
	}
}