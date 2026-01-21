// Optional script for Cloudflare R2 image operations
// Install @aws-sdk/client-s3 if you need this functionality: npm install @aws-sdk/client-s3

import path from "node:path";

// Conditional import to avoid build errors if AWS SDK is not installed
let S3Client: any;
let PutObjectCommand: any;
let DeleteObjectCommand: any;
let s3Client: any = null;
let awsSdkLoadAttempted = false;

function loadAwsSdk() {
	if (awsSdkLoadAttempted) {
		return;
	}
	awsSdkLoadAttempted = true;

	try {
		// Avoid static resolution so the SDK can stay optional.
		const moduleName = "@aws-sdk/client-s3";
		const requireFn = (0, eval)("require") as NodeRequire;
		const awsSDK = requireFn(moduleName);
		S3Client = awsSDK.S3Client;
		PutObjectCommand = awsSDK.PutObjectCommand;
		DeleteObjectCommand = awsSDK.DeleteObjectCommand;
	} catch (error) {
		// Silence warning during build if not needed
		if (process.env.NODE_ENV !== "production") {
			console.warn(
				"AWS SDK not installed. Image operations will be disabled.",
			);
		}
	}
}

const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const R2_ENDPOINT_URL = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_REGION = "auto";

const BUCKET_NAME = process.env.BUCKET_NAME || "ielts-read";

function getS3Client() {
	if (s3Client) {
		return s3Client;
	}

	loadAwsSdk();
	if (!S3Client) {
		return null;
	}

	s3Client = new S3Client({
		region: R2_REGION,
		endpoint: R2_ENDPOINT_URL,
		credentials: {
			accessKeyId: R2_ACCESS_KEY_ID,
			secretAccessKey: R2_SECRET_ACCESS_KEY,
		},
		// Optional: Force path style if you encounter issues
		forcePathStyle: true,
	});

	return s3Client;
}

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
	const client = getS3Client();
	if (!client || !PutObjectCommand) {
		console.warn("AWS SDK not installed. Skipping image upload.");
		return null;
	}
	try {
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
			Key:  targetKey,
			Body: imageBuffer,
			ContentType: contentType,
		};

		await client.send(new PutObjectCommand(uploadParams));
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
	const client = getS3Client();
	if (!client || !DeleteObjectCommand) {
		console.warn("AWS SDK not installed. Skipping image deletion.");
		return false;
	}
	try {
		// Delete the file from R2
		const key = `article/${imageName}.webp`;

		const deleteParams = {
			Bucket: BUCKET_NAME,
			Key: key,
		};

		await client.send(new DeleteObjectCommand(deleteParams));
		console.log(`Successfully deleted ${key} from ${BUCKET_NAME}`);
		return true;
	} catch (error) {
		console.error("Error deleting image from R2:", error);
		return false;
	}
}
