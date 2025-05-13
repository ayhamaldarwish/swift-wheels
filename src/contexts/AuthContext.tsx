
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Booking } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  loadUserFromStorage,
  saveUserToStorage,
  removeUserFromStorage,
  loadBookingsFromStorage,
  saveBookingsToStorage
} from "@/data/mockData";

/**
 * Auth Context Type Definition
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithPin: (username: string, pin: string) => Promise<boolean>;
  register: (username: string, name: string, email: string, password: string, pin?: string) => Promise<boolean>;
  logout: () => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  updateUserInfo: (name: string, email: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  deleteAccount: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 *
 * Provides authentication state and methods to the application
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Load user and bookings from localStorage on initial render
  useEffect(() => {
    // Load user from localStorage
    const storedUser = loadUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }

    // Load bookings from localStorage
    const storedBookings = loadBookingsFromStorage();
    if (storedBookings.length > 0) {
      setBookings(storedBookings);
    }
  }, []);

  // Save bookings to localStorage whenever it changes
  useEffect(() => {
    if (bookings.length > 0) {
      saveBookingsToStorage(bookings);
    }
  }, [bookings]);

  /**
   * Login function
   *
   * Authenticates a user with username and password
   */
  const login = async (username: string, password: string): Promise<boolean> => {
    // This is a mock login function for demo purposes
    try {
      if (!username || !password) {
        toast({
          title: t("auth.login.error.title"),
          description: t("auth.login.error.description"),
          variant: "destructive",
        });
        return false;
      }

      // Simulate checking credentials against mockUsers
      // In a real app, this would be an API call
      const isAdmin = username.toLowerCase() === "admin";

      const mockUser: User = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        username,
        name: isAdmin ? "Admin User" : username,
        email: `${username.toLowerCase()}@example.com`,
        role: isAdmin ? "admin" : "user",
        permissions: isAdmin
          ? ["view_cars", "book_cars", "view_own_bookings", "view_all_bookings", "manage_cars", "manage_users"]
          : ["view_cars", "book_cars", "view_own_bookings"]
      };

      // Security check - validate password (very basic for demo)
      if (password.length < 6) {
        toast({
          title: t("auth.login.error.title"),
          description: t("auth.login.error.password"),
          variant: "destructive",
        });
        return false;
      }

      setUser(mockUser);
      saveUserToStorage(mockUser);

      toast({
        title: t("auth.login.success.title"),
        description: t("auth.login.success.description").replace("{0}", username),
        variant: "default",
      });

      return true;
    } catch (error) {
      toast({
        title: t("auth.error.title"),
        description: t("auth.login.error.unexpected"),
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Login with PIN function
   *
   * Authenticates a user with username and PIN
   */
  const loginWithPin = async (username: string, pin: string): Promise<boolean> => {
    // This is a mock login function for demo purposes
    try {
      if (!username || !pin) {
        toast({
          title: t("auth.login.error.title"),
          description: t("auth.login.error.description"),
          variant: "destructive",
        });
        return false;
      }

      // Validate PIN format (must be 4 digits)
      if (!/^\d{4}$/.test(pin)) {
        toast({
          title: t("auth.login.error.title"),
          description: t("login.validation.pin"),
          variant: "destructive",
        });
        return false;
      }

      // Simulate checking credentials against mockUsers
      // In a real app, this would be an API call
      const isAdmin = username.toLowerCase() === "admin";

      // For demo purposes, we'll accept any valid 4-digit PIN
      // In a real app, you would verify the PIN against stored values
      const mockUser: User = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        username,
        name: isAdmin ? "Admin User" : username,
        email: `${username.toLowerCase()}@example.com`,
        role: isAdmin ? "admin" : "user",
        permissions: isAdmin
          ? ["view_cars", "book_cars", "view_own_bookings", "view_all_bookings", "manage_cars", "manage_users"]
          : ["view_cars", "book_cars", "view_own_bookings"],
        pin: pin
      };

      setUser(mockUser);
      saveUserToStorage(mockUser);

      toast({
        title: t("auth.login.success.title"),
        description: t("auth.login.success.description").replace("{0}", username),
        variant: "default",
      });

      return true;
    } catch (error) {
      toast({
        title: t("auth.error.title"),
        description: t("auth.login.error.unexpected"),
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Register function
   *
   * Creates a new user account
   */
  const register = async (username: string, name: string, email: string, password: string, pin?: string): Promise<boolean> => {
    try {
      // Validate all required fields
      if (!username || !name || !email || !password) {
        toast({
          title: t("auth.register.error.title"),
          description: t("auth.register.error.description"),
          variant: "destructive",
        });
        return false;
      }

      // Security checks
      if (username.length < 3) {
        toast({
          title: t("auth.register.error.title"),
          description: t("auth.register.error.username"),
          variant: "destructive",
        });
        return false;
      }

      if (password.length < 6) {
        toast({
          title: t("auth.register.error.title"),
          description: t("auth.register.error.password"),
          variant: "destructive",
        });
        return false;
      }

      // Validate PIN if provided
      if (pin && !/^\d{4}$/.test(pin)) {
        toast({
          title: t("auth.register.error.title"),
          description: t("login.validation.pin"),
          variant: "destructive",
        });
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: t("auth.register.error.title"),
          description: t("auth.register.error.email"),
          variant: "destructive",
        });
        return false;
      }

      // Check if username is 'admin' to assign admin role (for demo purposes)
      const isAdmin = username.toLowerCase() === "admin";

      const mockUser: User = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        username,
        name,
        email,
        role: isAdmin ? "admin" : "user",
        permissions: isAdmin
          ? ["view_cars", "book_cars", "view_own_bookings", "view_all_bookings", "manage_cars", "manage_users"]
          : ["view_cars", "book_cars", "view_own_bookings"],
        pin: pin
      };

      setUser(mockUser);
      saveUserToStorage(mockUser);

      toast({
        title: t("auth.register.success.title"),
        description: t("auth.register.success.description").replace("{0}", name),
        variant: "default",
      });

      return true;
    } catch (error) {
      toast({
        title: t("auth.error.title"),
        description: t("auth.register.error.unexpected"),
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Logout function
   *
   * Signs out the current user
   */
  const logout = () => {
    try {
      setUser(null);
      removeUserFromStorage();

      toast({
        title: t("auth.logout.success.title"),
        description: t("auth.logout.success.description"),
        variant: "default",
      });
    } catch (error) {
      toast({
        title: t("auth.error.title"),
        description: t("auth.logout.error.description"),
        variant: "destructive",
      });
    }
  };

  /**
   * Add Booking function
   *
   * Creates a new booking for the current user
   */
  const addBooking = (booking: Booking) => {
    try {
      setBookings((prevBookings) => [...prevBookings, booking]);

      toast({
        title: t("booking.success.title"),
        description: t("booking.success.description"),
        variant: "default",
      });
    } catch (error) {
      toast({
        title: t("booking.error.title"),
        description: t("booking.error.description"),
        variant: "destructive",
      });
    }
  };

  /**
   * Cancel Booking function
   *
   * Cancels an existing booking
   */
  const cancelBooking = (bookingId: string) => {
    try {
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));

      toast({
        title: t("booking.cancel.success.title"),
        description: t("booking.cancel.success.description"),
        variant: "default",
      });
    } catch (error) {
      toast({
        title: t("booking.cancel.error.title"),
        description: t("booking.cancel.error.description"),
        variant: "destructive",
      });
    }
  };

  /**
   * Check if the current user has a specific permission
   *
   * @param permission - The permission to check
   * @returns True if the user has the permission, false otherwise
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  };

  /**
   * Check if the current user is an admin
   */
  const isAdmin = !!user && user.role === "admin";

  /**
   * Update User Information
   *
   * Updates the user's name and email
   */
  const updateUserInfo = async (name: string, email: string): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: t("auth.error.title"),
          description: t("auth.error.not_logged_in"),
          variant: "destructive",
        });
        return false;
      }

      // Validate inputs
      if (!name || !email) {
        toast({
          title: t("profile.update.error.title"),
          description: t("auth.register.error.description"),
          variant: "destructive",
        });
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: t("profile.update.error.title"),
          description: t("auth.register.error.email"),
          variant: "destructive",
        });
        return false;
      }

      // Update user information
      const updatedUser = {
        ...user,
        name,
        email
      };

      setUser(updatedUser);
      saveUserToStorage(updatedUser);

      toast({
        title: t("profile.update.success.title"),
        description: t("profile.update.success.desc"),
        variant: "default",
      });

      return true;
    } catch (error) {
      toast({
        title: t("auth.error.title"),
        description: t("auth.error.unexpected"),
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Update Password
   *
   * Updates the user's password
   */
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: t("auth.error.title"),
          description: t("auth.error.not_logged_in"),
          variant: "destructive",
        });
        return false;
      }

      // Validate inputs
      if (!currentPassword || !newPassword) {
        toast({
          title: t("profile.password.error.title"),
          description: t("auth.register.error.description"),
          variant: "destructive",
        });
        return false;
      }

      // In a real app, we would verify the current password against stored hash
      // For demo purposes, we'll just check if it's at least 6 characters
      if (currentPassword.length < 6) {
        toast({
          title: t("profile.password.error.title"),
          description: t("profile.password.error.current"),
          variant: "destructive",
        });
        return false;
      }

      // Validate new password
      if (newPassword.length < 6) {
        toast({
          title: t("profile.password.error.title"),
          description: t("profile.password.error.length"),
          variant: "destructive",
        });
        return false;
      }

      // In a real app, we would update the password in the database
      // For demo purposes, we'll just show a success message
      toast({
        title: t("profile.password.success.title"),
        description: t("profile.password.success.desc"),
        variant: "default",
      });

      return true;
    } catch (error) {
      toast({
        title: t("auth.error.title"),
        description: t("auth.error.unexpected"),
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Delete Account
   *
   * Deletes the user's account
   */
  const deleteAccount = async (password: string): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: t("auth.error.title"),
          description: t("auth.error.not_logged_in"),
          variant: "destructive",
        });
        return false;
      }

      // Validate password
      if (!password) {
        toast({
          title: t("auth.error.title"),
          description: t("auth.login.error.password"),
          variant: "destructive",
        });
        return false;
      }

      // In a real app, we would verify the password against stored hash
      // For demo purposes, we'll just check if it's at least 6 characters
      if (password.length < 6) {
        toast({
          title: t("auth.error.title"),
          description: t("auth.login.error.password"),
          variant: "destructive",
        });
        return false;
      }

      // Delete user account
      setUser(null);
      removeUserFromStorage();

      // In a real app, we would also delete user data from the database
      // For demo purposes, we'll just log out the user
      toast({
        title: t("auth.logout.success.title"),
        description: t("auth.logout.success.description"),
        variant: "default",
      });

      return true;
    } catch (error) {
      toast({
        title: t("auth.error.title"),
        description: t("auth.error.unexpected"),
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        hasPermission,
        login,
        loginWithPin,
        register,
        logout,
        bookings,
        addBooking,
        cancelBooking,
        updateUserInfo,
        updatePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 *
 * Custom hook to access the auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
