import styles from "./CertificateCard.module.css";
import Card from "../Card";
import classNames from "classnames";

export const CertificateCard = ({ title, score, provider, year, isVerified, bgPattern = 1, action = null }) => (
	<Card className={classNames("bg-no-repeat bg-cover shrink-0 flex flex-col", styles["bg-pattern-" + bgPattern])}>
		<div className="flex-1 flex flex-col px-4 py-4">
			<p className="block font-bold text-lg text-white mb-4">{title}</p>
			<div className="flex grow items-end justify-between">
				<div className="block py-2 px-8 bg-info-600 text-white rounded-lg">
					<p className="block text-center font-light leading-none">Score</p>
					<p className="block font-bold text-center text-xl tracking-wide font-mono">{score}</p>
				</div>
				{action}
			</div>
		</div>
		<div className="flex items-end rounded-t-2xl bg-white px-4 py-8">
			<div className="block grow">
				<p className="block text-black font-medium mb-2">{provider}</p>
				<p className="flex items-center text-sm text-gray-600">
					<span className="mr-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
							/>
						</svg>
					</span>{" "}
					Tahun {year}
				</p>
			</div>
			{isVerified ? (
				<span className="inline-flex items-center justify-center leading-none text-sm text-white px-4 py-2 bg-success-600 rounded-full">
					Verified
				</span>
			) : (
				<span className="inline-flex items-center justify-center leading-none text-sm text-white px-4 py-2 bg-danger-600 rounded-full">
					Unverified
				</span>
			)}
		</div>
	</Card>
);

export default CertificateCard;
