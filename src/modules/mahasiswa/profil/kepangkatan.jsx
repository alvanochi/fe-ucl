import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";

export default function KepangkatanModule({ baseURL }) {
	return (
		<>
			<div className="flex items-center justify-center gap-2 my-8">
				<Button
					as="a"
					href={`${baseURL}/kepangkatan/create`}
					variant="primary"
					icon={<Icon icon="ic:baseline-plus" width={20} height={20} />}
					pill
				>
					Tambah Kepangkatan
				</Button>
				<Button variant="primary" icon={<Icon icon="iconoir:sort-up" width={20} height={20} />} pill>
					Sortir
				</Button>
				<Button variant="primary" icon={<Icon icon="clarity:filter-line" width={20} height={20} />} pill>
					Filter
				</Button>
			</div>
			<table className="w-full border-collapse rounded-2xl overflow-hidden shadow table-auto" cellPadding={10}>
				<thead>
					<tr>
						<th className="text-sm border-2 border-white bg-gray-200">No</th>
						<th className="text-sm border-2 border-white bg-gray-200">Golongan/Pangkat</th>
						<th className="text-sm border-2 border-white bg-gray-200">No. SK</th>
						<th className="text-sm border-2 border-white bg-gray-200">Terhitung Mulai Tanggal</th>
						<th className="text-sm border-2 border-white bg-gray-200">Tanggal SK</th>
						<th className="text-sm border-2 border-white bg-gray-200"></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="text-sm border-2 border-white bg-gray-50">1</td>
						<td className="text-sm border-2 border-white bg-gray-50">III/b - Penata Muda Tk. I</td>
						<td className="text-sm border-2 border-white bg-gray-50">2755/L4/KP/2018</td>
						<td className="text-sm border-2 border-white bg-gray-50">01 Januari 2019</td>
						<td className="text-sm border-2 border-white bg-gray-50">19 Desember 2018</td>
						<td className="text-sm border-2 border-white bg-gray-50">
							<div className="flex items-stretch gap-1">
								<Button.Icon
									as="a"
									href={`${baseURL}/kepangkatan/detail`}
									variant="info"
									icon={<Icon icon="fluent:info-24-filled" width={20} height={20} />}
								/>
								<Button.Icon
									as="a"
									href={`${baseURL}/kepangkatan/edit`}
									variant="secondary"
									icon={<Icon icon="bx:edit" width={20} height={20} />}
								/>
								<Button.Icon
									variant="danger"
									icon={<Icon icon="solar:trash-bin-2-bold-duotone" width={20} height={20} />}
								/>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<div className="flex justify-center gap-1 my-4">
				<Button.Icon icon={<Icon icon="material-symbols:chevron-left" width={20} height={20} />}></Button.Icon>
				<Button.Icon variant="label-primary" icon={<div className="h-5 w-5">1</div>}></Button.Icon>
				<Button.Icon variant="label-primary" icon={<div className="h-5 w-5">2</div>}></Button.Icon>
				<Button.Icon variant="label-primary" icon={<div className="h-5 w-5">3</div>}></Button.Icon>
				<Button.Icon variant="label-primary" icon={<div className="h-5 w-5">4</div>}></Button.Icon>
				<Button.Icon variant="label-primary" icon={<div className="h-5 w-5">5</div>}></Button.Icon>
				<Button.Icon icon={<Icon icon="material-symbols:chevron-right" width={20} height={20} />}></Button.Icon>
			</div>
		</>
	);
}
