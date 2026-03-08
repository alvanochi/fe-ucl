import { withSessionRoute } from "../../lib/withSession";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
  const userData = { ...req.body };

  if (userData.personalData?.embed_wajah) {
    delete userData.personalData.embed_wajah;
  }

  userData.is_logged_in = true;

  req.session.user = userData;

  await req.session.save();

  res.status(200).send({
    status_code: 200,
    data: userData,
    message: "Successfully Logged In",
  });
}
