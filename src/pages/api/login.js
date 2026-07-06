import { withSessionRoute } from "../../lib/withSession";
export default withSessionRoute(loginRoute);
async function loginRoute(req, res) {
  const userData = { ...req.body };
  if (userData.personalData?.embed_wajah) {
    delete userData.personalData.embed_wajah;
  }
  req.session.user = {
    user_id: userData.user_id,
    role: userData.role,
    nama_lengkap: userData.nama_lengkap,
    email: userData.email,
    token: userData.token,
    is_logged_in: true,
  };
  await req.session.save();
  res.status(200).send({
    status_code: 200,
    data: userData,
    message: "Successfully Logged In",
  });
}
