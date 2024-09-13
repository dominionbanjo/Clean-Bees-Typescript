import { Form, redirect, useNavigate, useNavigation } from "react-router-dom";
import Wrapper from "../assets/wrappers/LoginAndRegister";
import { FormRow } from "../components";
import { IoChevronBackCircleOutline } from "react-icons/io5"; // Import the icon
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const url = new URL(request.url);
  const password = data.password;
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  try {
    const response: AxiosResponse = await customFetch.post(
      "auth/reset-password",
      {
        password,
        token,
        email,
      }
    );

    toast.success(response.data.msg);
    return redirect("/login");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(error.response.data.msg);
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("Request error");
      }
    } else {
      toast.error("An unknown error occurred");
    }
    //   toast.error(error?.response?.data?.msg);
    return error;
  }
};

const ResetPassword = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <div className="icon-container">
        <button
          onClick={() => navigate(-1)}
          className="back-icon"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <IoChevronBackCircleOutline
            style={{ color: "white", zIndex: "999999" }}
            size={30}
          />
        </button>
      </div>
      <Form method="post">
        <h3>Reset Password</h3>
        <FormRow type="password" name="password" defaultValue="" />

        <button
          className="submit-btn"
          type="submit"
          id="btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
      </Form>
    </Wrapper>
  );
};

export default ResetPassword;
