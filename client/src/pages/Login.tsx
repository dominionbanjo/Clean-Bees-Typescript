import {
  Form,
  Link,
  redirect,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Wrapper from "../assets/wrappers/LoginAndRegister";
import { FormRow } from "../components";
import { FaGoogle } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { IoChevronBackCircleOutline } from "react-icons/io5"; // Import the icon
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      await customFetch.post("/auth/login", data);
      queryClient.invalidateQueries();
      toast.success("Login successful");
      return redirect("/homepage");
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

const Login = () => {
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
        <h3>Login Here</h3>
        <FormRow type="email" name="email" defaultValue="" />
        <FormRow type="password" name="password" defaultValue="" />
        <button
          className="submit-btn"
          type="submit"
          id="btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in" : "Log In"}
        </button>
        <p>
          Don't have an account?{" "}
          <Link className="home-link formred" to="/register">
            Register
          </Link>
        </p>
        <p>
          Forgot your password?{" "}
          <Link className="home-link formred" to="/forgot-password">
            reset password
          </Link>
        </p>
        <div className="social">
          <div className="go">
            <FaGoogle /> Google
          </div>
          <div className="fb">
            <FaFacebookF /> Facebook
          </div>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Login;
