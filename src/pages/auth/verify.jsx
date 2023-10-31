import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import Slider from "react-slick";
import Button from "../../components/Button";
import useForm from "../../hooks/useForm";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./register.module.css";
import Link from "next/link";
import { toastAlert } from "../../lib/sweetalert";

export const Verify = () => {
	const INITIAL_FORM = {
		token: "",
	};

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		dotsClass: styles["slick-dots"],
		customPaging: function (i) {
			return <div className="w-full rounded-full h-1 bg-white bg-opacity-20 dots"></div>;
		},
	};

	const { form, inputHandler } = useForm(INITIAL_FORM, {});

	async function submitHandler(event) {
		event.preventDefault();
		try {
			const request = await axios({
				url: `${process.env.API_ENDPOINT}/auth/verifyUser/${form.token}`,
				method: "PATCH",
			});
			const response = await request.data;
			if (response.message == "Account verification successfully") {
				toastAlert("success", response.message);
			}

			toastAlert("error", response.message);
			Router.push("/");
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

	return (
		<>
			<Head>
				<title>{`Verifikasi - ${process.env.APP_NAME}`}</title>
			</Head>
			<div className="flex w-full min-h-screen bg-motion bg-cover bg-no-repeat">
				<div className="relative flex flex-col grow py-12 px-10">
					<div className="block mb-16">
						<img src="/img/app_logo.png" alt="App Logo" />
					</div>
					<div className="block relative w-[32rem] mx-auto my-auto">
						{/* SLIDER HERE */}
						<Slider {...settings} arrows={false}>
							<div>
								<div className="w-full rounded-2xl bg-opacity-20 bg-white p-8">
									<h3 className="block text-3xl text-white font-bold mb-12">
										Platform <br /> Digital Untuk <br /> Mempermudah <br /> Administrasi
									</h3>
									<p className="block text-white text-sm font-semibold">
										Kembangkan karir dan relasi anda dengan daftar menjadi keluarga TIAS
									</p>
								</div>
							</div>
							<div>
								<div className="w-full rounded-2xl bg-opacity-20 bg-white p-8">
									<img src="/img/login/vector-1.png" alt="Login slider" className="mx-auto mb-2 h-72" />
									<p className="block text-white text-sm font-semibold">
										Kembangkan karir dan relasi anda dengan daftar menjadi keluarga TIAS
									</p>
								</div>
							</div>
							<div>
								<div className="w-full rounded-2xl bg-opacity-20 bg-white p-8">
									<img src="/img/login/vector-2.png" alt="Login slider" className="mx-auto mb-2 h-72" />
									<p className="block text-white text-sm font-semibold">
										Kembangkan karir dan relasi anda dengan daftar menjadi keluarga TIAS
									</p>
								</div>
							</div>
						</Slider>
					</div>
				</div>
				<form
					onSubmit={submitHandler}
					className="flex items-center justify-center w-2/5 shrink-0 h=full bg-white ml-auto rounded-l-3xl"
				>
					<div className="block w-3/5">
						<div className="block mb-6">
							<h1 className="block text-2xl font-bold text-primary-600">Verifikasi Akun</h1>
							<p className="block text-gray-600 text-sm">
								Verifikasi akunmu dengan kode verifikasi yang kami kirimkan ke emailmu!
							</p>
						</div>
						<div className="block mb-6">
							<label className="block text-sm font-medium mb-1">Kode Verifikasi</label>
							<input type="text" className="form-input" name="token" onChange={inputHandler} value={form.token} required />
						</div>
						<Button variant="primary" className="w-full h-12">
							Verifikasi
						</Button>
					</div>
				</form>
			</div>
		</>
	);
};

export default Verify;
