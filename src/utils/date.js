export default {
	formatToID: (date, option = { dateStyle: "long" }) => Intl.DateTimeFormat("id", option).format(date),
	formatToInput: (date) => date.split("T")[0],
	different: (a, b) => {
		const NUM_OF_DAYS = 1000 * 3600 * 24;

		const differentInTime = b.getTime() - a.getTime();
		const differentInDays = Math.ceil(differentInTime / NUM_OF_DAYS);

		return differentInDays;
	},
};
