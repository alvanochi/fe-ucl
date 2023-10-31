import axios from "axios";
import { toastAlert } from "./sweetalert";

export const fetcher = async (url, { params = {}, transformResults = false } = {}) => {
	try {
		const request = await axios({ method: "GET", url: url, params: params });
		const response = await request.data;

		if (typeof transformResults === "function") return response.data.map(transformResults);
		return response.data;
	} catch (error) {
		console.error(error);
		if (error.name == "AxiosError" && error?.response) toastAlert("error", error.response.data.message);
		else toastAlert("error", error.message || "Internal Server Error!");

		return error.response;
	}
};

export default fetcher;
