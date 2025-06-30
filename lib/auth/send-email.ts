import { getSendEmailTime } from "@/lib/data/email-check";
import { Resend } from "resend";

interface Props {
	to: string;
	subject: string;
	text: string;
}

// Make sure to use a default value or throw a clear error if the API key is missing
export async function sendEmail({ to, subject, text }: Props) {
	const resendAPI = process.env.RESEND_API || "";

	if (!resendAPI) {
		return {
			message:
				"Something went wrong, please send email to official@ielts-read.space",
		};
		// You might want to throw an error here depending on your requirements
	}

	const resend = new Resend(resendAPI);

	// Only send the email if we have a valid API key
	if (resendAPI) {
		return await resend.emails.send({
			from: "email@ielts-read.space",
			to: to,
			subject: subject,
			html: text,
		});
	}
}
