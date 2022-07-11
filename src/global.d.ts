/// <reference types="@sveltejs/kit" />
interface Label extends LabelSimple {
	id: number;
}

interface LabelSimple {
	barcode: string;
	name: string;
	price: number;
	lastPrice?: number;
	qbAccount?: string;
	qbName?: string;
	noPrint?: boolean;
}
interface guild {
	venderName: string;
	venderCode: string;
	guildProductId: string;
	upcId: string;
	upcIdShort: string;
	sprId?: string;
	basicsId?: string;
	cisId?: string;
	description: string;
	qty: number;
	unitOfMeasure: string;
	shippingWeightInPounds: number;
	priceL0: number;
	priceL1: number;
	priceRetail: number;
	webCategory?: number;
	dateChangedIso?: string;
	compareAtPrice?: number;
}
