// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';

// function ForgotPassword() {
//     const { id, token } = useParams();
//     const history = useNavigate();
//     const [password, setPassword] = useState("");
//     const [isValid, setIsValid] = useState(false);  // Track token validity

//     const handleChange = (e) => {
//         setPassword(e.target.value);
//     };

//     const userValid = async () => {
//         const res = await fetch(`http://localhost:5003/api/forgot-password/forgotpassword/${id}/${token}`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });

//         const data = await res.json();
//         if (data.status === 401) {
//             toast.error("Token expired, please request a new one.", {
//                 position: "top-center"
//             });
//             // Redirect after 1 second to give time for the toast message
//             setTimeout(() => {
//                 history("/login");
//             }, 1000); 
//         } else {
//             setIsValid(true);  // Token is valid, show the form
//         }
//     };

//     const sendPassword = async (e) => {
//         e.preventDefault();

//         if (password === "") {
//             toast.error("Password is required!", { position: "top-center" });
//         } else if (password.length < 6) {
//             toast.error("Password must be 6 characters!", { position: "top-center" });
//         } else {
//             const res = await fetch(`http://localhost:5003/api/change-password/${id}/${token}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ password })
//             });

//             const data = await res.json();

//             if (data.status === 201) {
//                 setPassword("");
//                 toast.success("Password Updated Successfully!");
//             } else {
//                 toast.error("Token Expired. Generate a new link", { position: "top-center" });
//             }
//         }
//     };

//     useEffect(() => {
//         userValid();
//     }, []);

//     return (
//         <>
//             {isValid ? (
//                 <form onSubmit={sendPassword}>
//                     <div className="loginsignup">
//                         <div className="loginsignup-container">
//                             <h1>Enter Your New Password</h1>
//                             <div className="loginsignup-fields">
//                                 <label htmlFor="password" style={{ fontWeight: "600", color: "#333" }}>
//                                     New Password
//                                 </label>
//                                 <input
//                                     value={password}
//                                     onChange={handleChange}
//                                     type="password"
//                                     placeholder="Enter your new password"
//                                     required
//                                 />
//                             </div>
//                             <button type="submit">Send</button>
//                         </div>
//                     </div>
//                 </form>
//             ) : (
//                 <p>Redirecting...</p>  // Display a message while the page is redirecting or invalid
//             )}
//             <ToastContainer />
//         </>
//     );
// }

// export default ForgotPassword;


/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function ForgotPassword() {
  const { id, token } = useParams(); // get id + token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false); // track token validity
  const [loading, setLoading] = useState(true);

  // ✅ Verify token validity when page loads
  const verifyUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:5003/api/reset-password/forgotpassword/${id}/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.status === 401) {
        toast.error("Token expired or invalid. Please request a new link.", {
          position: "top-center",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setIsValid(true);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("Something went wrong. Try again later.");
      setTimeout(() => navigate("/login"), 1500);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle password update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Password is required!", { position: "top-center" });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.", {
        position: "top-center",
      });
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5003/api/reset-password/${id}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (data.status === 201) {
        toast.success("Password updated successfully!", {
          position: "top-center",
        });
        setPassword("");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error("Token expired or invalid. Please request a new link.", {
          position: "top-center",
        });
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Something went wrong. Try again later.");
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <>
      {loading ? (
        <p style={{ textAlign: "center", marginTop: "100px" }}>
          Verifying link...
        </p>
      ) : isValid ? (
        <form onSubmit={handleSubmit}>
          <div className="loginsignup">
            <div className="loginsignup-container" style={{ marginTop: "150px" }}>
              <h1>Enter Your New Password</h1>
              <div className="loginsignup-fields">
                <label
                  htmlFor="password"
                  style={{ fontWeight: "600", color: "#333" }}
                >
                  New Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your new password"
                  required
                />
              </div>
              <button type="submit">Update Password</button>
            </div>
          </div>
        </form>
      ) : (
        <p style={{ textAlign: "center", marginTop: "100px" }}>
          Redirecting...
        </p>
      )}
      <ToastContainer />
    </>
  );
}

export default ForgotPassword;
