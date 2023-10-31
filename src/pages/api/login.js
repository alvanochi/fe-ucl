import useCekDataPribadi from "../../hooks/useCekDataPribadi";
import { withSessionRoute } from "../../lib/withSession";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
  const userData = {
    ...req.body,
    is_logged_in: true,
  };

  req.session.user = userData;

  await req.session.save();
  res.status(200).send({
    status_code: 200,
    data: userData,
    message: "Successfully Logged In",
  });
}
