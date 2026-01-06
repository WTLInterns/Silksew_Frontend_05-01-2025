
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Input, Select, InputNumber, Button, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const AdminProductForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [colors, setColors] = useState([]);
  const [dynamicColors, setDynamicColors] = useState(() => {
    // Initialize from localStorage
    const savedColors = localStorage.getItem("dynamicColors");
    return savedColors ? JSON.parse(savedColors) : [];
  }); // State for dynamic colors
  const [newColor, setNewColor] = useState(""); // State for new color input
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [colorImages, setColorImages] = useState({});
  const [uniqueSubcategories, setUniqueSubcategories] = useState([]);
  const colorRefs = useRef({});

  const categories = ["Indian & Fusion Wear", "Western Wear", "Formal Wear", "New Arrivals"];
  const subcategories = {
    "Indian & Fusion Wear": [
      "Traditional Wear",
      "Ethnic Wear",
      "Kurtis",
      "Tops & Tunics",
      "Wedding Wear",
      "Sarees",
      "Lehengas",
      "Salwar Suits",
      "Indo Western"
    ],
    "Western Wear": [
      "Casual Wear",
      "Office Wear",
      "Bussiness Casual",
      "Blazzers",
      "Formal Dresses",
      "Work Wear",
      "Street Style",
      "Athleisure",
      "Summer Wear",
      "Winter Wear",
      "Party Wear"
    ],
    "Formal Wear": [
      "Formal Wear",
      "Office Wear",
      "Business Casual",
      "Blazers",
      "Formal Dresses",
      "Work Wear"
    ],
    "New Arrivals":["Kurtis"]
  };
  const sizes = {
    "Indian & Fusion Wear": ["XS", "S", "M", "L", "XL", "XXL"],
    "Western Wear": ["XS", "S", "M", "L", "XL", "XXL"],
    "Formal Wear": ["XS", "S", "M", "L", "XL", "XXL"],
    "New Arrivals":["XS", "S", "M", "L", "XL", "XXL"]
  };

  const colorOptions = [
    { name: "AliceBlue" },
    { name: "AntiqueWhite" },
    { name: "Aqua" },
    { name: "Aquamarine" },
    { name: "Azure" },
    { name: "Beige" },
    { name: "Bisque" },
    { name: "BlanchedAlmond" },
    { name: "Blue" },
    { name: "BlueViolet" },
    { name: "Brown" },
    { name: "Burlywood" },
    { name: "CadetBlue" },
    { name: "Chartreuse" },
    { name: "Chocolate" },
    { name: "Angel" },
    { name: "CornflowerBlue" },
    { name: "Cornsilk" },
    { name: "Crimson" },
    { name: "Cyan" },
    { name: "DarkBlue" },
    { name: "DarkCyan" },
    { name: "DarkGoldenrod" },
    { name: "DarkGray" },
    { name: "DarkGreen" },
    { name: "DarkKhaki" },
    { name: "DarkMagenta" },
    { name: "DarkOliveGreen" },
    { name: "DarkOrange" },
    { name: "DarkOrchid" },
    { name: "DarkRed" },
    { name: "DarkSalmon" },
    { name: "DarkSeagreen" },
    { name: "DarkSlateBlue" },
    { name: "DarkSlateGray" },
    { name: "DarkTurquoise" },
    { name: "DarkViolet" },
    { name: "DeepPink" },
    { name: "DeepSkyBlue" },
    { name: "DimGray" },
    { name: "DodgerBlue" },
    { name: "Firebrick" },
    { name: "FloralWhite" },
    { name: "ForestGreen" },
    { name: "Fuchsia" },
    { name: "Gainsboro" },
    { name: "GhostWhite" },
    { name: "Gold" },
    { name: "Goldenrod" },
    { name: "Gray" },
    { name: "Green" },
    { name: "GreenYellow" },
    { name: "Honeydew" },
    { name: "HotPink" },
    { name: "IndianRed" },
    { name: "Indigo" },
    { name: "Ivory" },
    { name: "Khaki" },
    { name: "Lavender" },
    { name: "LavenderBlush" },
    { name: "LawnGreen" },
    { name: "LemonChiffon" },
    { name: "LightBlue" },
    { name: "LightCoral" },
    { name: "LightCyan" },
    { name: "LightGoldenrodYellow" },
    { name: "LightGreen" },
    { name: "LightGrey" },
    { name: "LightPink" },
    { name: "LightSalmon" },
    { name: "LightSeaGreen" },
    { name: "LightSkyBlue" },
    { name: "LightSlateGray" },
    { name: "LightSteelBlue" },
    { name: "LightYellow" },
    { name: "Lime" },
    { name: "LimeGreen" },
    { name: "Linen" },
    { name: "Magenta" },
    { name: "Maroon" },
    { name: "MediumAquamarine" },
    { name: "MediumBlue" },
    { name: "MediumOrchid" },
    { name: "MediumPurple" },
    { name: "MediumSeaGreen" },
    { name: "MediumSlateBlue" },
    { name: "MediumSpringGreen" },
    { name: "MediumTurquoise" },
    { name: "MediumVioletRed" },
    { name: "MidnightBlue" },
    { name: "MintCream" },
    { name: "MistyRose" },
    { name: "Moccasin" },
    { name: "NavajoWhite" },
    { name: "Navy" },
    { name: "OldLace" },
    { name: "OliveDrab" },
    { name: "Orange" },
    { name: "OrangeRed" },
    { name: "Orchid" },
    { name: "PaleGoldenrod" },
    { name: "PaleGreen" },
    { name: "PaleTurquoise" },
    { name: "PaleVioletRed" },
    { name: "PapayaWhip" },
    { name: "PeachPuff" },
    { name: "Peru" },
    { name: "Pink" },
    { name: "Plum" },
    { name: "PowderBlue" },
    { name: "Purple" },
    { name: "Red" },
    { name: "RosyBrown" },
    { name: "RoyalBlue" },
    { name: "SaddleBrown" },
    { name: "Salmon" },
    { name: "SandyBrown" },
    { name: "SeaGreen" },
    { name: "SeaShell" },
    { name: "Sienna" },
    { name: "Silver" },
    { name: "SkyBlue" },
    { name: "SlateBlue" },
    { name: "Snow" },
    { name: "SpringGreen" },
    { name: "SteelBlue" },
    { name: "Tan" },
    { name: "Thistle" },
    { name: "Teal" },
    { name: "Tomato" },
    { name: "Turquoise" },
    { name: "Violet" },
    { name: "Wheat" },
    { name: "White" },
    { name: "Whitesmoke" },
    { name: "Yellow" },
    { name: "YellowGreen" },
  ];

  // Load colors from localStorage on mount
  useEffect(() => {
    const savedColors = localStorage.getItem("dynamicColors");
    if (savedColors) {
      setDynamicColors(JSON.parse(savedColors));
    }
  }, []);

  // Auto-scroll to image upload when a new color is selected
  useEffect(() => {
    if (colors.length > 0) {
      const lastColor = colors[colors.length - 1];
      const element = colorRefs.current[lastColor];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [colors]);

  const handleImageUpload = (color) => ({ fileList: newFileList }) => {
    setColorImages((prev) => ({
      ...prev,
      [color]: newFileList,
    }));
  };

  const onFinish = (values) => {
    console.log("Form Values:", values);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    form.setFieldsValue({ subcategory: undefined, sizes: undefined });
    setUniqueSubcategories([]);
  };

  const handleSubcategoryChange = (value) => {
    setUniqueSubcategories((prev) =>
      prev.includes(value) ? prev : [...prev, value]
    );
  };

  const handleColorChange = (selectedColors) => {
    setColors(selectedColors);
    // Remove images for deselected colors
    setColorImages((prev) => {
      const updatedImages = {};
      selectedColors.forEach((color) => {
        if (prev[color]) updatedImages[color] = prev[color];
      });
      return updatedImages;
    });
  };

  // Handle adding a new color
  const handleAddColor = () => {
    const trimmedColor = newColor.trim();
    const isInColorOptions = colorOptions.some(
      (option) => option.name.toLowerCase() === trimmedColor.toLowerCase()
    );
    const isInDynamicColors = dynamicColors.some(
      (color) => color.toLowerCase() === trimmedColor.toLowerCase()
    );

    if (trimmedColor && !isInColorOptions && !isInDynamicColors) {
      const updatedColors = [...dynamicColors, trimmedColor];
      setDynamicColors(updatedColors);
      setColors([...colors, trimmedColor]); // Add to selected colors
      form.setFieldsValue({ colors: [...colors, trimmedColor] }); // Update form field
      // Save to localStorage
      localStorage.setItem("dynamicColors", JSON.stringify(updatedColors));
      setNewColor(""); // Clear input
      toast.success(`Color "${trimmedColor}" added successfully!`, {
        position: "top-right",
        autoClose: 1000,
      });
    } else if (!trimmedColor) {
      toast.error("Please enter a valid color name", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error("Color already exists in the dropdown", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Explicitly check for required fields
      if (!values.price || values.price <= 0) {
        throw new Error("Price is required and must be greater than 0");
      }

      // Validate images
      if (
        colors.length > 0 &&
        !Object.keys(colorImages).some((color) => colorImages[color]?.length > 0)
      ) {
        throw new Error("Please upload at least one image for a selected color");
      }

      // Prepare product data
      const productData = new FormData();
      productData.append("name", values.productName || "");
      productData.append("description", values.description || "");
      productData.append("price", values.price.toString());
      productData.append("oldPrice", values.oldPrice?.toString() || "0");
      productData.append("category", values.category || "");
      productData.append("subcategory", values.subcategory || "");
      productData.append("availableStock", values.stock?.toString() || "0");

      // Send sizes as an array
      values.sizes?.forEach((size) => {
        productData.append("availableSizes[]", size);
      });

      // Send colors as a plain array of strings
      colors.forEach((color) => {
        productData.append("availableColors[]", color);
      });

      // Upload images to Cloudinary and gather URLs
      const uploadedImagesByColor = {};
      for (const [color, images] of Object.entries(colorImages)) {
        if (images?.length > 0) {
          const uploadedImages = await Promise.all(
            images.map(async (file, index) => {
              if (!file.originFileObj) {
                throw new Error(`Invalid file for ${color} at index ${index}`);
              }
              const data = new FormData();
              data.append("file", file.originFileObj);
              data.append("upload_preset", "Silksew");
              data.append("cloud_name", "dejdni8vi");
              data.append("folder", "image");

              const res = await fetch(
                "https://api.cloudinary.com/v1_1/dejdni8vi/image/upload",
                {
                  method: "POST",
                  body: data,
                }
              );

              if (!res.ok) {
                throw new Error(
                  `Image upload failed for ${color}: ${res.statusText}`
                );
              }

              const uploadedImage = await res.json();
              return uploadedImage.secure_url;
            })
          );
          uploadedImagesByColor[color] = uploadedImages;
        }
      }
      productData.append("images", JSON.stringify(uploadedImagesByColor));

      // Send to backend
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.post(
        "https://api.silksew.com/api/products",
        productData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Product Added Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset form and state
        form.resetFields();
        setColorImages({});
        setColors([]);
        setUniqueSubcategories([]);
      }
    } catch (error) {
      const errorMessage =
        error.message || "An unexpected error occurred. Please check all required fields.";
      console.error("Error adding product:", error);
      toast.error(`Failed to add product: ${errorMessage}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div style={{ padding: "100px" }}>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category" onChange={handleCategoryChange}>
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedCategory && subcategories[selectedCategory] && (
            <Form.Item
              name="subcategory"
              label="Subcategory"
              rules={[{ required: true, message: "Please select a subcategory" }]}
            >
              <Select
                placeholder="Select subcategory"
                onChange={handleSubcategoryChange}
              >
                {subcategories[selectedCategory].map((sub) => (
                  <Option key={sub} value={sub}>
                    {sub}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter product description" },
            ]}
          >
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter price" },
              {
                validator: (_, value) =>
                  value > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Price must be greater than 0")),
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0.01}
              step={0.01}
              placeholder="Enter price"
            />
          </Form.Item>

          {/* <Form.Item name="oldPrice" label="Old Price">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter old price"
            />
          </Form.Item> */}

          <Form.Item
            name="stock"
            label="Available Stock"
            rules={[{ required: true, message: "Please enter available stock" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter available stock"
            />
          </Form.Item>

          {selectedCategory && sizes[selectedCategory] && (
            <Form.Item
              name="sizes"
              label="Available Sizes"
              rules={[{ required: true, message: "Please select at least one size" }]}
            >
              <Select mode="multiple" placeholder="Select available sizes">
                {sizes[selectedCategory].map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Dynamic Color Input */}
          <Form.Item label="Add New Color">
            <Input
              placeholder="Enter color name (e.g., Red, Blue)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              style={{ width: "70%", marginRight: "10px" }}
            />
            <Button type="primary" onClick={handleAddColor}>
              Add Color
            </Button>
          </Form.Item>

          <Form.Item
            name="colors"
            label="Colors"
            rules={[{ required: true, message: "Please select at least one color" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select colors"
              onChange={handleColorChange}
              getPopupContainer={(trigger) => trigger.parentNode}
              dropdownStyle={{ position: "absolute", maxHeight: "200px", overflowY: "auto" }}
            >
              {[...colorOptions.map((option) => option.name), ...dynamicColors].map((color) => (
                <Option key={color} value={color}>
                  {color}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {colors.map((color) => (
            <Form.Item
              key={color}
              label={`Images for ${color}`}
              rules={[{ required: true, message: `Please upload at least one image for ${color}` }]}
              getValueFromEvent={() => colorImages[color] || []}
            >
              <div ref={(el) => (colorRefs.current[color] = el)}>
                <Upload
                  listType="picture-card"
                  multiple
                  fileList={colorImages[color] || []}
                  onChange={handleImageUpload(color)}
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 4 }}>Upload</div>
                  </div>
                </Upload>
              </div>
            </Form.Item>
          ))}
        </Form>
      </div>

      <Form.Item>
        <Button type="primary" style={{ width: "100%" }} onClick={handleSubmit}>
          Add Product
        </Button>
      </Form.Item>
    </div>
  );
};

export default AdminProductForm;
