import { Outlet, useNavigate } from "react-router-dom";
import BigNavbar from "../components/BigNavbar";
import Footer from "../components/Footer";
import SmallNavbar from "../components/SmallNavbar";
import { createContext, useContext, useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { z } from "zod";
import { QueryClient } from "@tanstack/react-query";

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

const HomepageContext = createContext<HomepageContext | undefined>(undefined);

type HomepageLayoutProps = {
  queryClient: QueryClient;
};

const HomepageLayout = ({ queryClient }: HomepageLayoutProps) => {
  const [user, setUser] = useState<UserContext>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    __v: 0,
    avatar: "",
    avatarPublicId: "",
    role: "",
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async (showToast: boolean = true) => {
    if (hasLoggedOut) return;
    setHasLoggedOut(true);
    await customFetch.get("/auth/logout");
    queryClient.clear();
    setUser({
      _id: "",
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      __v: 0,
      avatar: "",
      avatarPublicId: "",
      role: "",
    });
    if (showToast) {
      toast.success("Logout successful");
    }
    navigate("/homepage");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await customFetch.get<User>("/users/current-user");
        const result = UserSchema.safeParse(data);
        if (!result.success) {
          console.log(result.error.message);
          throw new Error("Failed to parse user");
        }
        setUser(result.data.user);
      } catch (error) {
        setUser({
          _id: "",
          firstName: "",
          lastName: "",
          email: "",
          location: "",
          __v: 0,
          avatar: "",
          avatarPublicId: "",
          role: "",
        });
      }
    };

    fetchUser();
  }, [isAuthError]);

  useEffect(() => {
    if (isAuthError && !hasLoggedOut) {
      logoutUser(false);
    }
  }, [isAuthError, hasLoggedOut]);

  customFetch.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );

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
