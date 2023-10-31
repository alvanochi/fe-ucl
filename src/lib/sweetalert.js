import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const MySwal = withReactContent(Swal);

export const toastAlert = (type, text, timer = 3600) => {
	return MySwal.fire({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: timer,
		timerProgressBar: true,
		icon: type,
		title: text,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", MySwal.stopTimer);
			toast.addEventListener("mouseleave", MySwal.resumeTimer);
			toast.addEventListener("click", MySwal.close);
		},
	});
};

export const warningAlert = async (
	callback,
	text = "Data Akan Dihapus Permanen!",
	title = "Anda Yakin?",
	loadingText = "Menghapus Data..."
) => {
	const result = await MySwal.fire({
		title: title,
		text: text,
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Ya",
		cancelButtonText: "Tidak",
	});
	if (result.isConfirmed) {
		loadingAlert("Harap Tunggu", "Menghapus Data...");
		if (typeof callback == "function") {
			return callback();
		}
	}
};

export const loadingAlert = (title = "Harap Tunggu", text = "Memuat data...") => {
	return MySwal.fire({
		title: title,
		text: text,
		didOpen: () => {
			MySwal.showLoading();
		},
	});
};
