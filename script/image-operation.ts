import fs from "node:fs";
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
 * Uploads an image buffer directly to R2 bucket
 * @param imageBuffer - The image data as a Buffer
 * @param fileName - The name to use for the file in the bucket
 * @param targetPath - Optional: The target path in the bucket (defaults to content-image/fileName)
 * @returns Promise with the upload result
 */
export async function uploadArticleImage(
	imageBuffer: Buffer,
	fileName: string,
	targetPath?: string,
): Promise<string | null> {
	try {
		// Determine the file's MIME type based on extension
		const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
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
			Key:  targetKey,
			Body: imageBuffer,
			ContentType: contentType,
		};

		await s3Client.send(new PutObjectCommand(uploadParams));
		console.log(
			`Successfully uploaded ${fileName} to ${BUCKET_NAME}/${targetKey}`,
		);
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
