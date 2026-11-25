import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import classnames from "classnames";

export const Modal = ({ children, title, show, handler, size = "base" }) => {
	const cancelButtonRef = useRef(null);

	return (
		<Transition.Root show={show} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" initialFocus={cancelButtonRef} onClose={handler}>
				<div id="modal" className="relative flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div
							className={classnames(
								"relative inline-block w-full transform rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:align-middle",
								{
									"sm:max-w-7xl": size == "xl",
									"sm:max-w-4xl": size == "lg",
									"sm:max-w-3xl": size == "3xl",
									"sm:max-w-2xl": size == "md",
									"sm:max-w-md": size == "sm",
									"sm:max-w-lg": size == "base" || !["xl", "lg", "3xl", "md", "sm"].includes(size),
								}
							)}
						>
							<div className="relative rounded-2xl bg-white p-4 sm:p-6">
								{typeof handler === "function" && (
									<button
										type="button"
										onClick={handler}
										className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-colors z-10 cursor-pointer"
										aria-label="Tutup"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								)}
								<div className="mt-2 sm:mt-0">
									<Dialog.Title as="h3" className="text-xl font-bold leading-6 text-primary-600 text-center px-8">
										{title}
									</Dialog.Title>
								</div>
								<div className="mt-8">{children}</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default Modal;
