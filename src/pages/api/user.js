import { withSessionRoute } from "../../lib/withSession";

export default withSessionRoute(userRoute);

async function userRoute(req, res) {
	res.send({ status_code: 200, data: req.session.user ?? null, message: "Successfully read user data" });
}
