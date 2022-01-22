import jsPDF from 'jspdf';
import { Canvg } from 'canvg';

export const genPDF = async (SVGs: string[], c: HTMLCanvasElement): Promise<void> => {
	const jsPDFConf = { unit: 'in', format: 'letter', orientation: 'portrait' };

	const ctx = c.getContext('2d');
	const blobs: Blob[] = [];
	for (let i = 0; i < SVGs.length; i++) {
		const s = SVGs[i];
		const v = await Canvg.fromString(ctx, s);

		await v.render();
		blobs.push(
			await new Promise<Blob>((resolve) => {
				c.toBlob((blob) => {
					resolve(blob);
				});
			})
		);
	}

	blobs.forEach((b) => {
		const url = URL.createObjectURL(b);
		//open blob in new tab
		window.open(url);
	});
};
