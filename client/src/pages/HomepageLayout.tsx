import { Outlet, useNavigate } from "react-router-dom";
import BigNavbar from "../components/BigNavbar";
import Footer from "../components/Footer";
import SmallNavbar from "../components/SmallNavbar";
import { createContext, useContext, useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { z } from "zod";

interface HomepageContext {
  user: UserContext;
  showSidebar: boolean;
  toggleSidebar: () => void;
  logoutUser: () => void;
}

type UserContext = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  __v: number;
  avatar?: string;
  avatarPublicId?: string;
  role: string;
};
export const UserSchema = z.object({
  user: z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    location: z.string(),
    __v: z.number(),
    avatar: z.string().optional(),
    avatarPublicId: z.string().optional(),
    role: z.string(),
  }),
});

export type User = z.infer<typeof UserSchema>;

const userQuery = {
  queryKey: ["user"],
  queryFn: async () => {
    try {
      const { data } = await customFetch.get<User>("/users/current-user");
      const result = UserSchema.safeParse(data);

      if (!result.success) {
        console.log(result.error.message);
        throw new Error("Failed to parse user");
      }
      return result.data;
    } catch (error) {
      return {
        user: {
          _id: "",
          firstName: "Pizza",
          lastName: "",
          email: "",
          location: "",
          __v: 0,
          avatar: "",
          avatarPublicId: "",
          role: "",
        },
      };
    }
  },
};

export const loader = (queryClient: QueryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    toast.info("Please login to your account");
    return {
      user: {
        _id: "",
        firstName: "Pizza",
        lastName: "",
        email: "",
        location: "",
        __v: 0,
        avatar: "",
        avatarPublicId: "",
        role: "",
      },
    };
  }
};

const HomepageContext = createContext<HomepageContext | undefined>(undefined);

type HomepageLayout = {
  queryClient: QueryClient;
};
const HomepageLayout = ({ queryClient }: HomepageLayout) => {
  const { data } = useQuery(userQuery);

  const user: UserContext = data?.user || {
    _id: "",
    firstName: "Guest",
    lastName: "",
    email: "",
    location: "",
    __v: 0,
    avatar: "",
    avatarPublicId: "",
    role: "",
  };

  const [showSidebar, setShowSidebar] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // const logoutUser = async () => {
  //   if (hasLoggedOut) return;
  //   setHasLoggedOut(true);
  //   await customFetch.get("/auth/logout");
  //   queryClient.clear();
  //   toast.success("Logout successful");
  //   navigate("/homepage");
  // };
  const logoutUser = async (showToast: boolean = true) => {
    if (hasLoggedOut) return;
    setHasLoggedOut(true);
    await customFetch.get("/auth/logout");
    queryClient.clear();
    if (showToast) {
      toast.success("Logout successful");
    }
    navigate("/homepage");
  };

  customFetch.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );

  // useEffect(() => {
  //   if (isAuthError && !hasLoggedOut) {
  //     logoutUser();
  //   }
  // }, [isAuthError, hasLoggedOut]);
  useEffect(() => {
    if (isAuthError && !hasLoggedOut) {
      logoutUser(false);
    }
  }, [isAuthError, hasLoggedOut]);

  return (
    <HomepageContext.Provider
      value={{
        user,
        showSidebar,
        toggleSidebar,
        logoutUser,
      }}
    >
      <BigNavbar />
      <SmallNavbar />
      <Outlet />
      <Footer />
    </HomepageContext.Provider>
  );
};

export const useHomepageContext = () => {
  const context = useContext(HomepageContext);
  if (context === undefined) {
    throw new Error(
      "useHomepageContext must be used within a HomepageProvider"
    );
  }
  return context;
};
export default HomepageLayout;
