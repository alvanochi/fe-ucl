import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import useUser from "../../../hooks/useUser";
import useForm from "../../../hooks/useForm";
import { toastAlert } from "../../../lib/sweetalert";
import { useRouter } from "next/router";
import axios from "axios";
import _ from "underscore";

export default function Setting() {
	const router = useRouter();
	const { user } = useUser({ redirectTo: "/login" });
	const { prefix, menu, setActive } = useMenu();

	const INITIAL_FORM = {
		oldPassword: "",
		password: "",
		confirmPassword: "",
	};

	const { form, inputHandler } = useForm(INITIAL_FORM, {});

	async function submitHandler(event) {
		event.preventDefault();
		if (form.password != form.confirmPassword) return toastAlert("error", "Password baru tidak sesuai!");

		try {
			const request = await axios({
				url: `${process.env.API_ENDPOINT}/auth/changePassword`,
				method: "PATCH",
				data: _.omit(form, ["confirmPassword"]),
			});
			const response = await request.data;
			if (response) {
				toastAlert("success", "Sukses mengubah passoword");
				return router.reload();
			}

			toastAlert("error", response.message);
			router.push("/");
		} catch (error) {
			if (error.name === "AxiosError") {
				const { status_code, message, data } = error.response.data;
				toastAlert("error", message);
				console.error(status_code, message, data);

				return;
			}

			console.error(error.message);
		}
	}

	if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;
	return (
		<Layout>
			<PageHeader title="Ubah Kata Sandi" icon={menu.icon} items={menu.submenus} handler={setActive} />
			<Form onSubmit={submitHandler}>
				<Card className="mt-4">
					<Card.Header className="text-center">Form ubah Kata Sandi</Card.Header>
					<Card.Body className="space-y-4">
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kata Sandi Lama <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="password"
								className="flex-1"
								name="oldPassword"
								onChange={inputHandler}
								value={form.oldPassword}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Kata Sandi Baru <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="password"
								className="flex-1"
								name="password"
								onChange={inputHandler}
								value={form.password}
								required
							/>
						</Form.Group>
						<Form.Group className="flex items-baseline gap-3">
							<Form.Label className="min-w-[18rem]">
								Konfirmasi Sandi Baru <span className="text-danger-600">*</span>
							</Form.Label>
							<span>:</span>
							<Form.Input
								type="password"
								className="flex-1"
								name="confirmPassword"
								onChange={inputHandler}
								value={form.confirmPassword}
								required
							/>
						</Form.Group>
					</Card.Body>
				</Card>
				<div className="flex gap-4 mt-4">
					<Button as="a" href={prefix + menu.url} variant="secondary" className="w-full h-12">
						Batal
					</Button>
					<Button type="submit" variant="primary" className="w-full h-12">
						Konfirmasi
					</Button>
				</div>
			</Form>
		</Layout>
	);
}
