import { Icon } from "@iconify-icon/react";
import Button from "../../../components/Button";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import SortIcon from "../../../components/SortIcon";

export default function Sort({ sortBy, getSortBy }) {
	return (
		<>
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button as="div">
						<Button variant="primary" icon={<Icon icon="iconoir:sort" width={20} height={20} />} pill>
							Sortir
						</Button>
					</Menu.Button>
				</div>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="px-1 py-1 ">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => sortBy("nama_tes")}
										className={`${
											active ? "bg-primary-600 text-white" : "text-gray-900"
										} group flex w-full items-center rounded-md px-2 py-2 text-sm justify-between`}
									>
										Nama Tes
										{getSortBy("nama_tes") && <SortIcon sort={getSortBy("nama_tes")} />}
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => sortBy("skor_tes")}
										className={`${
											active ? "bg-primary-600 text-white" : "text-gray-900"
										} group flex w-full items-center rounded-md px-2 py-2 text-sm justify-between`}
									>
										Skor Tes
										{getSortBy("skor_tes") && <SortIcon sort={getSortBy("skor_tes")} />}
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => sortBy("penyelenggara")}
										className={`${
											active ? "bg-primary-600 text-white" : "text-gray-900"
										} group flex w-full items-center rounded-md px-2 py-2 text-sm justify-between`}
									>
										Penyelenggara
										{getSortBy("penyelenggara") && <SortIcon sort={getSortBy("penyelenggara")} />}
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => sortBy("tgl_tes")}
										className={`${
											active ? "bg-primary-600 text-white" : "text-gray-900"
										} group flex w-full items-center rounded-md px-2 py-2 text-sm justify-between`}
									>
										Tanggal Tes
										{getSortBy("tgl_tes") && <SortIcon sort={getSortBy("tgl_tes")} />}
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => sortBy("status")}
										className={`${
											active ? "bg-primary-600 text-white" : "text-gray-900"
										} group flex w-full items-center rounded-md px-2 py-2 text-sm justify-between`}
									>
										Status
										{getSortBy("status") && <SortIcon sort={getSortBy("status")} />}
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</>
	);
}
