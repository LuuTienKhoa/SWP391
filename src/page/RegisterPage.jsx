import api from "../config/axios";
import { useNavigate } from "react-router-dom";
import Cover_Image from "../assets/bg.jpg";
import { Form, Input } from "antd";
import GOOGLE_ICON from "../assets/google.svg";
import { Link } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();

  // vùng của javascript
  const handleLogin = async (values) => {
    console.log(values);

    try {
      // gửi request đến server
      const response = await api.post("login", values);
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response.data);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex items-start">
        <div className="relative w-1/2 h-full flex flex-col">
          <img src={Cover_Image} alt="Cover" className="w-full h-full" />
        </div>

        <div className="w-1/2 h-full bg-white flex flex-col p-10 justify-between items-center">
          <h1 className="w-full max-w-[500px] mx-auto text-xl font-semibold text-black mr-auto">
            F Koi Shop
          </h1>

          <div className="w-full flex flex-col max-w-[500px]">
            <div className="w-full flex flex-col mb-2">
              <h3 className="text-3xl font-semibold mb-2">Register</h3>
              <p className="text-base text-gray-500 mb-2">
                Welcome to the F Koi Shop! Please enter your details.
              </p>
            </div>

            <div className="w-full flex flex-col">
              <Form
                className="w-full"
                labelCol={{ span: 24 }}
                onFinish={handleLogin}
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                      type: "email", // Ensure the input is a valid email
                    },
                  ]}
                >
                  <Input
                    type="email"
                    placeholder="Email"
                    className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  />
                </Form.Item>

                <Form.Item>
                  <div className="w-ful flex flex-col">
                    <button className="w-ful text-white my-2 font-semibold bg-black rounded-md p-4 border-2 border-black text-center flex items-center justify-center">
                      Register
                    </button>
                  </div>
                </Form.Item>

                <div className="w-full flex items-center justify-center relative py-2">
                  <div className="w-full h-[1px] bg-black"></div>
                  <p className="text-lg absolute text-black/80 bg-white">or</p>
                </div>
                <Form.Item>
                  <button className="w-full text-black my-2 bg-white border-2 border-black rounded-md p-4 text-center flex items-center justify-center">
                    <img
                      src={GOOGLE_ICON}
                      className="h-6 mr-2"
                      alt="Google Icon"
                    />
                    Sign Up With Google
                  </button>
                </Form.Item>
              </Form>
            </div>
          </div>

          <div className="w-full flex flex-col items-center p-10">
            <p className="text-sm font-semibold text-black mb-2">
              You alredy have an acconut!{" "}
              <span className=" font-semibold text-blue-500 hover:underline cursor-pointer">
                <Link to="/login  ">Login here</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;