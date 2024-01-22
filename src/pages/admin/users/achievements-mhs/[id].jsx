import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form from "../../../../components/Form";
import Layout from "../../../../components/Layout";
import PageHeader from "../../../../components/PageHeader";
import useMenu from "../../../../hooks/useMenu";
import useUser from "../../../../hooks/useUser";
import axios from "axios";
import { toastAlert } from "../../../../lib/sweetalert";

export default function Achievements() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const userId = router.query.id;
  const API_URL = `${process.env.API_ENDPOINT}/achievments/by-mhsId/${userId}`;
  const UPDATE_URL = `${process.env.API_ENDPOINT}/achievments/update-status`;

  const [form, setForm] = useState({
    npm: "",
    nama_lengkap: "",
    total_point: "",
    achievements: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const sortedAchievements = response.data.data.achievements.sort((a, b) => a.points - b.points);
        const updatedFormData = { ...response.data.data, achievements: sortedAchievements };
        setForm(updatedFormData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleStatusChange = (event, index) => {
    const { value } = event.target;
    const updatedAchievements = form.achievements.map((achievement, i) =>
      i === index ? { ...achievement, status: parseInt(value, 10) } : achievement
    );

    setForm((prevForm) => ({ ...prevForm, achievements: updatedAchievements }));
  };

  const handleSaveClick = async (achievementId, status) => {
    try {
      const response = await axios.post(UPDATE_URL, {
        user_id: form.user_id,
        achievement_id: achievementId,
        status: status,
      });

      if (response.data) {
        toastAlert("success", response.data.message);
      }
    } catch (error) {
      toastAlert("error", error.message);
    }
  };

  if ([user, menu].some((item) => item == null)) return <p>Loading...</p>;

  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />

      <Card className="mt-4">
        <Card.Header className="text-center">Achievements</Card.Header>
        <Card.Body className="space-y-4">
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Nama Lengkap <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="nama_lengkap"
              value={form.nama_lengkap}
              readOnly
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              NPM <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="npm"
              value={form.npm}
              readOnly
            />
          </Form.Group>
          <Form.Group className="flex items-baseline gap-3">
            <Form.Label className="min-w-[18rem]">
              Total Point <span className="text-danger-600">*</span>
            </Form.Label>
            <span>:</span>
            <Form.Input
              type="text"
              className="flex-1"
              name="total_point"
              value={form.total_point}
              readOnly
            />
          </Form.Group>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-2 gap-4" style={{ flexDirection: 'row-reverse' }}>
        {form.achievements.map((achievement, index) => (
          <Card key={index} className="mt-4" style={{ width: "20rem" }}>
            <Card.Header className="text-center">
              {achievement.name} - ({achievement.points})
            </Card.Header>
            <Card.Body className="flex flex-col items-center space-y-4">
              <Form.Input
                type="hidden"
                className="flex-1"
                name="user_id"
                value={form.user_id}
                disabled
              />
              <Form.Input
                type="hidden"
                className="flex-1"
                name="achievement_id"
                value={achievement.id}
                disabled
              />
              <Form.Group className="flex items-baseline gap-3">
                <Form.Label className="min-w-[10rem]">
                  Status <span className="text-danger-600">*</span>
                </Form.Label>
                <span>:</span>
                <div className="flex gap-4">
                  <Form.Label>
                    <Form.Radio
                      name={`status_${index}`}
                      value={0}
                      checked={achievement.status === 0}
                      onChange={(event) => handleStatusChange(event, index)}
                    />
                    Belum Diambil
                  </Form.Label>
                  <Form.Label>
                    <Form.Radio
                      name={`status_${index}`}
                      value={1}
                      checked={achievement.status === 1}
                      onChange={(event) => handleStatusChange(event, index)}
                    />
                    Diambil
                  </Form.Label>
                </div>
              </Form.Group>
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  className="w-24 h-8"
                  onClick={() => handleSaveClick(achievement.id, achievement.status)}
                >
                  Save
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          as="a"
          href={prefix + menu.url}
          variant="secondary"
          className="w-full h-12"
        >
          Kembali
        </Button>
      </div>
    </Layout>
  );
}
