import jsPDF from 'jspdf';
import { Canvg } from 'canvg';

export const genPDF = async (SVGs: string[], c: HTMLCanvasElement): Promise<void> => {
	const doc = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });

	const ctx = c.getContext('2d');
	const dataURLs: string[] = [];
	for (let i = 0; i < SVGs.length; i++) {
		const s = SVGs[i];
		const v = await Canvg.fromString(ctx, s);

		await v.render();
		dataURLs.push(c.toDataURL('image/jpeg'));
		// pdf!
		if (i !== 0) doc.addPage();
		doc.addImage(dataURLs[i].toString(), 'png', 0, 0, 8.5, 11);
		console.log(`Page ${i + 1} of ${SVGs.length} added!`);
	}

	doc.save('labels.pdf');
};
