import { withSessionRoute } from "../../lib/withSession";

export default withSessionRoute(userRoute);

async function userRoute(req, res) {
	req.session.destroy();
	res.send({ status_code: 200, data: null, message: "Successfully logout" });
}
