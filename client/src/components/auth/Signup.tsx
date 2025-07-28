import { useState } from "react";
import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../helper/port";


const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Signup = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const navigate = useNavigate()


  const signUpWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save user info in localStorage
    localStorage.setItem("userEmail", user.email || "");
    localStorage.setItem("userName", user.displayName || "");
    localStorage.setItem("userPhoto", user.photoURL || "");
    

    await axios.post(`${BASE_URL}/api/users`, {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
    });

    navigate('/dashboard');
    toast.success('Login Successfull')
  } catch (error) {
    console.error("Google Sign-In error:", error);
    toast.error('something went wrong')
  }
};


  const sendOtpToEmail = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/send-otp`, { email });
      toast.success("OTP sent to email.");
      setShowOtpInput(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP.");
    }
  };

const verifyOtp = async () => {
  try {
    
    const response = await axios.post(`${BASE_URL}/api/verify-otp`, { email, otp });

  
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", "");
    localStorage.setItem("userPhoto", "");

  
    await axios.post(`${BASE_URL}/api/users`, {
      name: "",
      email,
      photo: "",
    });

  
    navigate("/dashboard");
    toast.success("Login Successful");
  } catch (error) {
    console.error("OTP verification failed:", error);
    toast.error("Invalid or expired OTP.");
  }
};




  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 px-4 py-12">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>

          {/* Google Sign-in */}
          <button
            onClick={signUpWithGoogle}
            className="flex items-center justify-center w-full bg-white border border-gray-300 hover:shadow-md text-sm font-medium py-2 px-4 rounded-lg transition duration-200 mb-4"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Sign up with Google
          </button>

          <div className="text-center text-sm text-gray-500 my-4">or</div>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 text-sm"
          />
          <button
            onClick={sendOtpToEmail}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mb-2"
          >
            Send OTP to Email
          </button>

      
          {showOtpInput && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 text-sm"
              />
              <button
                onClick={verifyOtp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Verify OTP
              </button>
            </>
          )}

          <p className="text-center text-xs text-gray-500 mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Right: Brand Visual */}
      <div className="flex-1 hidden md:flex items-center justify-center bg-blue-900 text-white">
        <h1 className="text-[7vw] font-extrabold tracking-tight rotate-[-90deg] whitespace-nowrap">
          NoteQuill
        </h1>
      </div>
    </div>
  );
};

export default Signup;
