import { useRouter } from "next/router";
import { Icon } from "@iconify-icon/react";
import Button from "../Button";

export default function BackButton() {
	const router = useRouter();

	return (
		<Button.Icon
			variant="transparent"
			className="w-0 h-0"
			icon={<Icon icon="material-symbols:chevron-left" width={32} height={32} onClick={() => router.back()} />}
		/>
	);
}
