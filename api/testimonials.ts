export const config = { runtime: "edge" };

type Testimonial = {
	name: string;
	rating: number;
	testimonial?: string;
};

const FRESH = "public, s-maxage=86400, stale-while-revalidate=604800";
const EMPTY = "public, s-maxage=60";

export default async function handler(): Promise<Response> {
	const endpoint = process.env.TESTIMONIALS_ENDPOINT;

	if (!endpoint) {
		return Response.json([], { headers: { "cache-control": EMPTY } });
	}

	try {
		const res = await fetch(endpoint);
		if (!res.ok) throw new Error(String(res.status));
		const data: Testimonial[] = await res.json();
		return Response.json(data, { headers: { "cache-control": FRESH } });
	} catch {
		return Response.json([], { headers: { "cache-control": EMPTY } });
	}
}
