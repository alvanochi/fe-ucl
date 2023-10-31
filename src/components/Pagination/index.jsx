import classNames from "classnames";
import { Icon } from "@iconify-icon/react";
import Button from "../Button";
import Form from "../Form";

export default function Pagination({ current, max, handler, canPrev, canNext, className }) {
	return (
		<div className={classNames("flex", className)}>
			<div className="flex gap-1 ml-auto">
				<Button.Icon
					type="button"
					variant="outline-primary"
					icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}
					onClick={() => handler(current - 1)}
					disabled={!canPrev}
					pill
				/>
				<Button
					type="button"
					variant="primary"
					icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}
					iconPosition="right"
					onClick={() => handler(current + 1)}
					disabled={!canNext}
					pill
				>
					Next Page
				</Button>
			</div>
			<div className="ml-auto whitespace-nowrap flex items-center gap-2">
				<p className="">Page</p>
				<Form.Input
					type="number"
					min="1"
					max={max}
					className="w-20"
					value={current}
					onChange={(event) => event.target.valueAsNumber <= max && handler(event.target.value)}
				/>
				of {max || 1}
			</div>
		</div>
	);
}
