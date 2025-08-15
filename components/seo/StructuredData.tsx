import Script from "next/script";

interface StructuredDataProps {
	data: object | object[];
}

export default function StructuredData({ data }: StructuredDataProps) {
	const jsonLd = Array.isArray(data) ? data : [data];

	return (
		<>
			{jsonLd.map((item, index) => (
				<Script
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					id={`structured-data-${index}`}
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(item, null, 2),
					}}
				/>
			))}
		</>
	);
}
