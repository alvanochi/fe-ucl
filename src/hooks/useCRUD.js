import { useState } from "react";
import axios from "axios";
import useForm from "./useForm";
import {
  MySwal,
  loadingAlert,
  toastAlert,
  warningAlert,
} from "../lib/sweetalert";
import _ from "underscore";

const INITIAL_OPTIONS = {
  onOpen: null,
  onClose: null,
  transformData: null,
  rules: null,
};

export const useCRUD = (API_URL, INITIAL_FORM, options = INITIAL_OPTIONS) => {
  const {
    form,
    option,
    setForm,
    setOption,
    reset,
    inputHandler,
    validate,
    validation,
    setValidation,
    setNestedFormArray,
  } = useForm(INITIAL_FORM, {
    rules: options.rules || INITIAL_OPTIONS.rules,
  });

  const [isSubmit, setIsSubmit] = useState(false);

  const show = async (id, { params = {}, transformData = null } = {}) => {
    try {
      loadingAlert();
      const request = await axios({
        method: "GET",
        url: `${API_URL}/${id}`,
        params: { ...params },
      });

      const response = await request.data;

      MySwal.close();

      let responseData =
        typeof transformData === "function"
          ? transformData(response.data)
          : response.data;
      if (INITIAL_FORM) {
        const keys = Object.keys(INITIAL_FORM);
        responseData = _.pick(responseData, keys);
      }

      setForm(responseData);
    } catch (error) {
      if (error.name == "AxiosError" && error?.response)
        toastAlert("error", error.response.data.message);
      else toastAlert("error", error.message || "Internal Server Error!");
    }
  };

  const destroy = async (id) => {
    return warningAlert(async () => {
      try {
        const request = await axios({
          method: "DELETE",
          url: `${API_URL}/${id}`,
        });

        const response = await request.data;

        MySwal.close();
        return toastAlert("success", response.message, 2000);
      } catch (error) {
        if (error.name == "AxiosError" && error?.response)
          toastAlert("error", error.response.data.message);
        else toastAlert("error", "Internal Server Error!");
      }
    });
  };

  const submitHandler = async (event, submitOptions = {}) => {
    event.preventDefault();

    if (options.rules) {
      validate();
      if (validation?.length > 0) return;
    }

    setIsSubmit(true);

    try {
      const dataType = event.target.attributes.type?.value;
      const resolvedForm =
        typeof options.transformData == "function"
          ? options.transformData(form)
          : form;

      let formdata = resolvedForm;

      if (dataType == "formdata") {
        formdata = new FormData();
        for (const [key, value] of Object.entries(resolvedForm)) {
          formdata.append(key, value);
        }
      }

      loadingAlert("Harap Tunggu", "Memproses permintaan...");
      const request = await axios({
        url: API_URL,
        method: option.method,
        data: formdata,
        ...submitOptions,
      });

      const response = await request.data;
      MySwal.close();

      options.success(response);
      setIsSubmit(false);

      return toastAlert("success", response.message, 2000);
    } catch (error) {
      console.error(error);
      if (error.name == "AxiosError" && error?.response)
        toastAlert("error", error.response.data.message);
      else toastAlert("error", error.message || "Internal Server Error!");

      setIsSubmit(false);
    }
  };

  return {
    show,
    destroy,
    submitHandler,
    isSubmit,
    formdata: {
      form,
      option,
      errors: validation,
      setForm,
      setNestedFormArray,
      setOption,
      reset,
      inputHandler,
    },
  };
};

export default useCRUD;
