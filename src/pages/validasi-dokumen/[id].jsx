import Head from "next/head";
import { Footer } from "../../components/LandingPage/Footer";
import HeaderOnPage from "../../components/LandingPage/HeaderOnPage";
import { Breadcrumb } from "../../components/LandingPage/Breadcrumb";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Icon } from "@iconify-icon/react";
import Button from "../../components/Button";
import Form from "../../components/Form";

const DetailValidasi = () => {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (router.query.id) {
      const fetchData = async () => {
        try {
          const DATA_URL = `${process.env.API_ENDPOINT}/validasi/validasi-dokumen`;

          const response = await axios.get(DATA_URL, {
            params: {
              dataTable: false,
              filter: ["id"],
              filterValue: [router.query.id],
            },
          });
          setData(response.data.data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>UCL</title>
      </Head>
      <div className="bg-color-primary text-color-white tracking-wider">
        <HeaderOnPage />

        <main>
          <section id="validasi-dokumen" className="bg-color-primary-light">
            <div className="container py-20">
              <Breadcrumb title="Detail Validasi" />

              <div className="flex justify-center">
                <div className="card mt-8 w-full lg:w-1/2">
                  <div
                    id="card_1_front"
                    className="front px-7 py-11 rounded-2xl border-2 border-solid border-color-gray text-color-white"
                  >
                    {loading ? (
                      <div
                        role="status"
                        className="flex justify-center items-center"
                      >
                        <svg
                          aria-hidden="true"
                          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <div>
                          <Form.Group className="flex items-baseline gap-3">
                            <label className="min-w-[8rem] text-primary-700 ">
                              Pelaksana
                            </label>
                            <span className="text-primary-700">:</span>
                            <p className="text-sm text-primary-700">
                              {data.rows[0]?.pelaksana}
                            </p>
                          </Form.Group>
                          <Form.Group className="flex items-baseline gap-3 mt-4">
                            <label className="min-w-[8rem]  text-primary-700">
                              Tertuju
                            </label>
                            <span className="text-primary-700">:</span>
                            <p className="text-sm text-primary-700">
                              {data.rows[0]?.tertuju}
                            </p>
                          </Form.Group>
                          <Form.Group className="flex items-baseline gap-3 mt-4">
                            <label className="min-w-[8rem] text-primary-700">
                              Kegiatan
                            </label>
                            <span className="text-primary-700">:</span>
                            <p className="text-sm text-primary-700">
                              Memberikan rekomendasi mahasiswa
                            </p>
                          </Form.Group>
                          <Form.Group className="flex items-baseline gap-3 mt-4">
                            <label className="min-w-[8rem] text-primary-700">
                              Link
                            </label>
                            <span className="text-primary-700">:</span>
                            <Button
                              as="a"
                              href={`${data.rows[0]?.link_kegiatan}`}
                              variant="primary"
                              icon={
                                <Icon
                                  icon="material-symbols:link"
                                  width={10}
                                  height={10}
                                />
                              }
                              pill
                            >
                              Link
                            </Button>
                          </Form.Group>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </>
  );
};

export default DetailValidasi;
