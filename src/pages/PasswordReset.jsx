import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';


export default function PasswordReset() {

    const [email, setEmail] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const response = await fetch("https://api.silksew.com/api/reset-password/sendpasswordlink", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.message) {
            setEmail("");
            toast.success("Password reset link sent successfully!");
        } else {
            toast.error("Invalid User");
        }
    }


    return (
        <>
            <form onSubmit={onSubmitHandler}>


                <div className="loginsignup">

                    <div className="loginsignup-container" style={{marginTop:"150px"}} >

                        <h1>Enter Your Email</h1>

                        <div className="loginsignup-fields">
                            <label htmlFor='email' style={{ fontWeight: "600", color: "#333" }}>Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <button type="submit">Send</button>

                    </div>
                </div>
            </form>
            <ToastContainer />
        </>
    )
}
