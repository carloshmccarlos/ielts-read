"use client";
import BackToTop from "@/components/BackToTop";
import Link from "next/link";

function Footer() {
	return (
		<footer className="bg-black mt-12 text-white">
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-12">
				<span className=" text-center text-lg text-gray-300 mb-4 leading-relaxed ">
					I READ offers high-quality, AI-generated articles based on over 3600
					core IELTS vocabulary words, designed to help you enhance your reading
					skills and master essential vocabulary. If you encounter any bugs or
					have suggestions to improve the platform, please send an email to
				</span>
				<span className={"font-bold text-xl"}>
					<Link href={"mailto:i-read-offcial@ielts-read.space"}>
						{" "}
						i-read-offcial@ielts-read.space.
					</Link>
				</span>
				{/*<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					 About Section
					<div className="col-span-1 px-4 md:px-8lg:px-0">
						<h3 className="text-center  text-2xl font-bold mb-4 text-white">
							About
						</h3>
						<p className=" text-center text-lg text-gray-300 mb-4 leading-relaxed">
							Your trusted source for IELTS reading practice and preparation. We
							provide high-quality articles and resources to help you achieve
							your desired score.
						</p>
					</div>

							 Quick Links
					<div className={"justify-self-center"}>
						<h3 className="text-center text-2xl font-bold mb-4 text-white">
							Quick Links
						</h3>
						<ul className="text-lg space-y-3 flex flex-col items-center">
							<li>
								<Link
									href="/"
									className="hover:underline text-gray-300 hover:text-white transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/articles"
									className="hover:underline text-gray-300 hover:text-white transition-colors"
								>
									Articles
								</Link>
							</li>
							<li>
								<Link
									href="/practice"
									className="hover:underline text-gray-300 hover:text-white transition-colors"
								>
									Practice Tests
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="hover:underline text-gray-300 hover:text-white transition-colors"
								>
									About Us
								</Link>
							</li>
						</ul>
					</div>

					 Contact
					<div className={" lg:justify-self-end"}>
						<h3 className="text-2xl font-bold mb-4 text-white  text-center">
							Contact
						</h3>
						<ul className="text-lg space-y-3 text-center">
							<li className="text-gray-300">Email: contact@ieltsreading.com</li>
							<li className="text-gray-300">Follow us on social media:</li>
							<li className="justify-center flex space-x-6 mt-2">
								<Link
									href="#"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Twitter
								</Link>
								<Link
									href="#"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Facebook
								</Link>
								<Link
									href="#"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Instagram
								</Link>
							</li>
						</ul>
					</div>
				</div>*/}

				{/* Bottom Bar */}
				<div
					className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row
				 justify-between items-center"
				>
					<p className="text-gray-400 text-sm mb-4 md:mb-0">
						© {new Date().getFullYear()} IELTS Reading. All rights reserved.
					</p>
					<BackToTop />
				</div>
			</div>
		</footer>
	);
}

export default Footer;
