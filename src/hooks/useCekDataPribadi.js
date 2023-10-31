import axios from "axios";

export const useCekDataPribadi = async (id) => {
  // const request = await axios({
  //   url: `${process.env.API_ENDPOINT}/auth/cekDataPribadi/${id}`,
  //   method: "GET",
  // });

  // const response = await request;

  // console.log(response);

  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/auth/cekDataPribadi/${id}`
    );
    // console.log(await response.json());
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export default useCekDataPribadi;
