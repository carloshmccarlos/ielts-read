import fs from "node:fs";
import path from "node:path";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";

const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const R2_ENDPOINT_URL = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_REGION = "auto";

const BUCKET_NAME = process.env.BUCKET_NAME || "ielts-read";

const s3Client = new S3Client({
	region: R2_REGION,
	endpoint: R2_ENDPOINT_URL,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
	// Optional: Force path style if you encounter issues
	forcePathStyle: true,
});

/**
 * Uploads an image from the public/content-image directory to R2 bucket
 * @param fileName - The name of the file in public/content-image directory
 * @param targetPath - Optional: The target path in the bucket (defaults to content-image/fileName)
 * @returns Promise with the upload result
 */
export async function uploadArticleImage(
	fileName: string,
	targetPath?: string,
): Promise<string | null> {
	try {
		// Construct the full path to the image file
		const imagePath = path.join(
			process.cwd(),
			"public",
			"content-image",
			fileName,
		);

		// Check if the file exists
		if (!fs.existsSync(imagePath)) {
			console.error(`File not found: ${imagePath}`);
			return null;
		}

		// Read the file content
		const fileContent = fs.readFileSync(imagePath);

		// Determine the file's MIME type based on extension
		const fileExtension = path.extname(fileName).toLowerCase();
		let contentType = "application/octet-stream"; // default

		if (fileExtension === ".png") contentType = "image/png";
		else if (fileExtension === ".jpg" || fileExtension === ".jpeg")
			contentType = "image/jpeg";
		else if (fileExtension === ".gif") contentType = "image/gif";
		else if (fileExtension === ".webp") contentType = "image/webp";

		// Set the target key (path in the bucket)
		const targetKey = targetPath || `article/${fileName}`;

		// Upload to R2
		const uploadParams = {
			Bucket: BUCKET_NAME,
			Key: targetKey,
			Body: fileContent,
			ContentType: contentType,
		};

		await s3Client.send(new PutObjectCommand(uploadParams));
		console.log(
			`Successfully uploaded ${fileName} to ${BUCKET_NAME}/${targetKey}`,
		);
		fs.unlinkSync(imagePath);
		console.log(`Successfully deleted local image: ${fileName}`);
		return `${process.env.CLOUDFLARE_R2_PUBLIC_IMAGE_URL}/${targetKey}`;
	} catch (error) {
		console.error("Error uploading image to R2:", error);
		return null;
	}
}

// uploadContentImage("1.png", "article/1.png");

/**
 * Deletes an image from the R2 bucket
 * @param imageName - The id of the article, the image name of the article.
 * @returns Promise with the delete result
 */
export async function deleteArticleImage(imageName: string): Promise<boolean> {
	try {
		// Delete the file from R2
		const key = `article/${imageName}.webp`;

		const deleteParams = {
			Bucket: BUCKET_NAME,
			Key: key,
		};

		await s3Client.send(new DeleteObjectCommand(deleteParams));
		console.log(`Successfully deleted ${key} from ${BUCKET_NAME}`);
		return true;
	} catch (error) {
		console.error("Error deleting image from R2:", error);
		return false;
	}
}
