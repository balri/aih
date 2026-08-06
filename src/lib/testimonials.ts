export type Testimonial = {
	name: string;
	rating: number;
	testimonial?: string;
};

let cache: Promise<Testimonial[]> | null = null;

export function fetchTestimonials(): Promise<Testimonial[]> {
	if (!cache) {
		cache = fetch("/api/testimonials")
			.then((res) =>
				res.ok
					? res.json()
					: Promise.reject(new Error(String(res.status))),
			)
			.catch(() => []);
	}

	return cache;
}
