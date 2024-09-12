import { Form, redirect } from "react-router-dom";
import Wrapper from "../assets/wrappers/ProfilePage";
import { FormRow } from "../components";
import { useHomepageContext } from "./HomepageLayout";
import { useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const file = (formData.get("avatar") as File) || null;
    if (file && file.size > 500000) {
      toast.error("Image size too large");
      return null;
    }

    try {
      await customFetch.patch("/users/update-user", formData);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated successfully");
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

const Profile = () => {
  const {
    user: { firstName, lastName, email, location },
    logoutUser,
  } = useHomepageContext();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <button className="logout-button" onClick={logoutUser}>
        Logout
      </button>
      <Form method="post" encType="multipart/form-data">
        <h1
          style={{
            textAlign: "center",
            color: "grey",
            textTransform: "capitalize",
            marginBottom: "25px",
          }}
        >
          profile
        </h1>
        <div className="form-center">
          <div className="form-row">
            <label htmlFor="avatar" className="label">
              Select an image file (max 0.5 MB)
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="form-input"
              accept="image/*"
            />
          </div>
          <FormRow
            type="text"
            name="firstName"
            labelText="first name"
            defaultValue={firstName}
          />
          <FormRow
            type="text"
            name="lastName"
            labelText="last name"
            defaultValue={lastName}
          />
          <FormRow type="email" name="email" defaultValue={email} />
          <FormRow type="text" name="location" defaultValue={location} />
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "submitting" : "submit"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};
export default Profile;
