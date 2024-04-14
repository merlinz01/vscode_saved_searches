import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Saved Searches activated.');

	let disposable = vscode.commands.registerCommand('saved-searches.search', () => {
		const values = getSavedSearches();
		if (values.length === 0) {
			vscode.window.showInformationMessage('No saved searches found.');
			return;
		}
		if (values.length === 1) {
			activateSavedSearch(values[0]);
			return;
		}
		vscode.window.showQuickPick(values, {canPickMany: false}).then((value) => {
			activateSavedSearch(value);
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

function activateSavedSearch(value: SavedSearchItem | undefined) {
	if (value) {
		vscode.commands.executeCommand('editor.actions.findWithArgs', { 
			searchString: value.searchString,
			replaceString: value.replaceString,
			isRegex: value.isRegex,
			preserveCase: value.preserveCase,
			findInSelection: value.findInSelection,
			matchWholeWord: value.matchWholeWord,
			isCaseSensitive: value.isCaseSensitive
		});
	}
}

interface SavedSearchItem extends vscode.QuickPickItem {
	searchString: string;
	replaceString: string | undefined;
	isRegex: boolean | undefined;
	preserveCase: boolean | undefined;
	findInSelection: boolean | undefined;
	matchWholeWord: boolean | undefined;
	isCaseSensitive: boolean | undefined;
}

function getSavedSearches(): SavedSearchItem[] {
	const config = vscode.workspace.getConfiguration('saved-searches');
    let savedSearches = config.get<SavedSearchItem[]>('searches', []);
	for (let savedSearch of savedSearches) {
		if (savedSearch.replaceString) {
			savedSearch.detail = `"${savedSearch.searchString}" -> "${savedSearch.replaceString}"`;
		} else {
			savedSearch.detail = `"${savedSearch.searchString}"`;
		}
		if (savedSearch.isRegex) {
			savedSearch.description = 'Regex';
		}
	}
    return savedSearches;
}
