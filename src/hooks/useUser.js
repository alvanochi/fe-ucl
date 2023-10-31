import { useEffect, useState } from "react";
import Router from "next/router";
import useSWR from "swr";
import axios from "axios";

export default function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
	const { data: user, mutate: mutateUser } = useSWR("/api/user");
	if (user && user.is_logged_in) axios.defaults.headers.common["token"] = user.token;

	const [profile, setProfile] = useState({});

	async function logout() {
		return mutateUser(axios.post("/api/logout").then(() => Router.push("/login")));
	}

	async function getProfile() {
		return axios({ url: `${process.env.API_ENDPOINT}/profile/getDataPribadi` })
			.then((response) => {
				const data = response.data.data;
				setProfile((state) => ({ ...state, ...data }));
			})
			.catch((error) => console.error(error));
	}

	async function getEducations() {
		return axios({ url: `${process.env.API_ENDPOINT}/kualifikasi/getDataPend`, params: { page: 1, limit: 1000 } })
			.then((response) => {
				const data = response.data.data;
				const sorted = data.sort((a, b) => b.tahun_lulus - a.tahun_lulus);
				setProfile((state) => ({ ...state, educations: sorted }));
			})
			.catch((error) => console.error(error));
	}

	useEffect(() => {
		if (!redirectTo || !user) return;
		if ((redirectTo && !redirectIfFound && !user?.is_logged_in) || (redirectIfFound && user?.is_logged_in)) {
			Router.push(redirectTo);
		}
	}, [user, redirectIfFound, redirectTo]);

	useEffect(() => {
		if (!redirectTo || !user) return;
		getProfile();
		getEducations();
	}, [user]);

	return { user, profile, mutateUser, logout };
}
