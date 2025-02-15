// import { BUBO } from './const.js'
import { Bubo } from './bubo.js';

let history = [];

export function pushHistory(...args) {
	const maxHistoryLength = game.settings.get(Bubo.const.ID, 'contextLength');

	history.push(...args);
	if (history.length > maxHistoryLength) {
		history = history.slice(history.length - maxHistoryLength);
	}

	return history;
}
