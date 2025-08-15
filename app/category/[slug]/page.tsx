import { getAllCategories } from "@/lib/actions/category";
import { generateCategoryMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const categories = await getAllCategories();
	const category = categories.find(
		(cat) => cat.name.toLowerCase() === slug.toLowerCase(),
	);

	if (!category) {
		return {};
	}

	return generateCategoryMetadata({
		name: category.name,
		description: category.description || undefined,
		slug: category.name.toLowerCase(),
	});
}

export async function generateStaticParams() {
	const categories = await getAllCategories();
	return categories.map((category) => ({
		slug: category.name.toLowerCase(),
	}));
}

export default async function CategoryPage({ params }: Props) {
	const { slug } = await params;
	const categories = await getAllCategories();
	const category = categories.find(
		(cat) => cat.name.toLowerCase() === slug.toLowerCase(),
	);

	if (!category) {
		notFound();
	}

	// This would typically render your category page content
	// For now, just redirect to home or show a placeholder
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-4">
				{category.name} IELTS Vocabulary Practice
			</h1>
			<p className="text-gray-600 mb-6">
				{category.description ||
					`Master IELTS vocabulary in ${category.name} through contextual reading. Learn and memorize essential IELTS words naturally with our curated ${category.name.toLowerCase()} articles.`}
			</p>
			<div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
				<div className="flex">
					<div className="ml-3">
						<p className="text-sm text-blue-700">
							💡 <strong>Vocabulary Learning Tip:</strong> Read each article
							carefully and pay attention to highlighted IELTS vocabulary words.
							Context helps you remember word meanings more effectively!
						</p>
					</div>
				</div>
			</div>
			{/* Add your category articles listing component here */}
		</div>
	);
}
