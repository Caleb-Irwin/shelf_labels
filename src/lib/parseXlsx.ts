import { read, utils } from 'xlsx';

export const readGuild = (data: ArrayBuffer): unknown[] => {
	console.log('Starting Guild Items');

	const guildSheet = read(data, {
		raw: false,
		type: 'array'
	});
	console.log('Got Guild Worksheet');

	// const sheetNames = guildSheet.SheetNames;
	// console.log(sheetName);

	const sheet = guildSheet.Sheets['Level 1 changes'];
	const allItemsRaw = utils.sheet_to_json(sheet, {
		header: 0
	});
	console.log(`Converted Guild Worksheet to Raw Object Array (${allItemsRaw.length} Long)`);
	// console.log(allItemsRaw.slice(0, 5));
	return allItemsRaw;
};
