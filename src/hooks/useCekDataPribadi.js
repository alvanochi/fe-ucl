import axios from "axios";

export const useCekDataPribadi = async (id) => {

  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/auth/cekDataPribadi/${id}`
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export default useCekDataPribadi;
