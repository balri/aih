import { get } from "@vercel/global-config";

export const config = { runtime: "edge" };

const FRESH = "public, s-maxage=86400, stale-while-revalidate=604800";
const EMPTY = "public, s-maxage=60";

export default async function handler(): Promise<Response> {
	const data = await get("testimonials");
	return Response.json(data ?? [], {
		headers: { "cache-control": data ? FRESH : EMPTY },
	});
}
