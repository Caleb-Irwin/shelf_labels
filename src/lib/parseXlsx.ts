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

	// let allItems: guild[] = allItemsRaw.map((item): guild => {
	// 	return {
	// 		venderName: item['Vendor Name'],
	// 		venderCode: item['Vndr. Code'],
	// 		guildProductId: item['Product#'],
	// 		upcId: item['UPC#'],
	// 		upcIdShort: item['UPC#'].slice(1, 11),
	// 		sprId: item['SPR#'] || undefined,
	// 		basicsId: item['Basics#'] || undefined,
	// 		cisId: item['CIS#'] || undefined,
	// 		description: item['Description'],
	// 		qty: item['Qty/ UoM '],
	// 		unitOfMeasure: item['Unit'],
	// 		shippingWeightInPounds: item['Shipping Weight'],
	// 		priceL0: item['Level 0'],
	// 		priceL1: item['Level 1'],
	// 		priceRetail: item['Retail'],
	// 		webCategory: item['Web Category'] || undefined
	// 		// dateChangedIso: item["Date Changed"].toISOString() || undefined, // day and month backward
	// 	};
	// });

	// allItems = allItems.filter((item) => {
	// 	return (
	// 		item.upcIdShort.length === 10 &&
	// 		//@ts-expect-error simpler then converting to number first
	// 		!isNaN(item.upcIdShort)
	// 	);
	// });

	// console.log(`Transform Guild, get short UPC and filter (${allItems.length} Long)`);
	// return allItems;
	console.log(allItemsRaw.slice(0, 5));

	return allItemsRaw;
};
