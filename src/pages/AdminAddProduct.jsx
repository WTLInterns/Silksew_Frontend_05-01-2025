// import { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Form, Input, Select, InputNumber, Button, Upload, Tag } from "antd";
// import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

// const { TextArea } = Input;
// const { Option } = Select;

// const AdminProductForm = () => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [dynamicColors, setDynamicColors] = useState(() => {
//     const savedColors = localStorage.getItem("dynamicColors");
//     return savedColors ? JSON.parse(savedColors) : [];
//   });
//   const [newColor, setNewColor] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [colorImages, setColorImages] = useState({});
//   const [uniqueSubcategories, setUniqueSubcategories] = useState([]);
//   const [categories, setCategories] = useState(["Indian & Fusion Wear", "Western Wear", "Formal Wear", "New Arrivals"]);
//   const [newCategory, setNewCategory] = useState('');
//   const [isAddingCategory, setIsAddingCategory] = useState(false);
//   const [newSubcategory, setNewSubcategory] = useState('');
//   const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
//   const [newSize, setNewSize] = useState('');
//   const [isAddingSize, setIsAddingSize] = useState(false);
//   const colorRefs = useRef({});
  
//   const [subcategories, setSubcategories] = useState({
//     "Indian & Fusion Wear": [
//       "Traditional Wear",
//       "Ethnic Wear",
//       "Kurtis",
//       "Tops & Tunics",
//       "Wedding Wear",
//       "Sarees",
//       "Lehengas",
//       "Salwar Suits",
//       "Indo Western"
//     ],
//     "Western Wear": [
//       "Casual Wear",
//       "Office Wear",
//       "Bussiness Casual",
//       "Blazzers",
//       "Formal Dresses",
//       "Work Wear",
//       "Street Style",
//       "Athleisure",
//       "Summer Wear",
//       "Winter Wear",
//       "Party Wear"
//     ],
//     "Formal Wear": [
//       "Formal Wear",
//       "Office Wear",
//       "Business Casual",
//       "Blazers",
//       "Formal Dresses",
//       "Work Wear"
//     ],
//     "New Arrivals": ["Kurtis"]
//   });

//   const [sizes, setSizes] = useState({
//     "Indian & Fusion Wear": ["XS", "S", "M", "L", "XL", "XXL"],
//     "Western Wear": ["XS", "S", "M", "L", "XL", "XXL"],
//     "Formal Wear": ["XS", "S", "M", "L", "XL", "XXL"],
//     "New Arrivals": ["XS", "S", "M", "L", "XL", "XXL"]
//   });

//   const colorOptions = [
//     { name: "AliceBlue" }, { name: "AntiqueWhite" }, { name: "Aqua" }, { name: "Aquamarine" },
//     { name: "Azure" }, { name: "Beige" }, { name: "Bisque" }, { name: "BlanchedAlmond" },
//     { name: "Blue" }, { name: "BlueViolet" }, { name: "Brown" }, { name: "Burlywood" },
//     { name: "CadetBlue" }, { name: "Chartreuse" }, { name: "Chocolate" }, { name: "Angel" },
//     { name: "CornflowerBlue" }, { name: "Cornsilk" }, { name: "Crimson" }, { name: "Cyan" },
//     { name: "DarkBlue" }, { name: "DarkCyan" }, { name: "DarkGoldenrod" }, { name: "DarkGray" },
//     { name: "DarkGreen" }, { name: "DarkKhaki" }, { name: "DarkMagenta" }, { name: "DarkOliveGreen" },
//     { name: "DarkOrange" }, { name: "DarkOrchid" }, { name: "DarkRed" }, { name: "DarkSalmon" },
//     { name: "DarkSeagreen" }, { name: "DarkSlateBlue" }, { name: "DarkSlateGray" }, { name: "DarkTurquoise" },
//     { name: "DarkViolet" }, { name: "DeepPink" }, { name: "DeepSkyBlue" }, { name: "DimGray" },
//     { name: "DodgerBlue" }, { name: "Firebrick" }, { name: "FloralWhite" }, { name: "ForestGreen" },
//     { name: "Fuchsia" }, { name: "Gainsboro" }, { name: "GhostWhite" }, { name: "Gold" },
//     { name: "Goldenrod" }, { name: "Gray" }, { name: "Green" }, { name: "GreenYellow" },
//     { name: "Honeydew" }, { name: "HotPink" }, { name: "IndianRed" }, { name: "Indigo" },
//     { name: "Ivory" }, { name: "Khaki" }, { name: "Lavender" }, { name: "LavenderBlush" },
//     { name: "LawnGreen" }, { name: "LemonChiffon" }, { name: "LightBlue" }, { name: "LightCoral" },
//     { name: "LightCyan" }, { name: "LightGoldenrodYellow" }, { name: "LightGreen" }, { name: "LightGrey" },
//     { name: "LightPink" }, { name: "LightSalmon" }, { name: "LightSeaGreen" }, { name: "LightSkyBlue" },
//     { name: "LightSlateGray" }, { name: "LightSteelBlue" }, { name: "LightYellow" }, { name: "Lime" },
//     { name: "LimeGreen" }, { name: "Linen" }, { name: "Magenta" }, { name: "Maroon" },
//     { name: "MediumAquamarine" }, { name: "MediumBlue" }, { name: "MediumOrchid" }, { name: "MediumPurple" },
//     { name: "MediumSeaGreen" }, { name: "MediumSlateBlue" }, { name: "MediumSpringGreen" }, { name: "MediumTurquoise" },
//     { name: "MediumVioletRed" }, { name: "MidnightBlue" }, { name: "MintCream" }, { name: "MistyRose" },
//     { name: "Moccasin" }, { name: "NavajoWhite" }, { name: "Navy" }, { name: "OldLace" },
//     { name: "OliveDrab" }, { name: "Orange" }, { name: "OrangeRed" }, { name: "Orchid" },
//     { name: "PaleGoldenrod" }, { name: "PaleGreen" }, { name: "PaleTurquoise" }, { name: "PaleVioletRed" },
//     { name: "PapayaWhip" }, { name: "PeachPuff" }, { name: "Peru" }, { name: "Pink" },
//     { name: "Plum" }, { name: "PowderBlue" }, { name: "Purple" }, { name: "Red" },
//     { name: "RosyBrown" }, { name: "RoyalBlue" }, { name: "SaddleBrown" }, { name: "Salmon" },
//     { name: "SandyBrown" }, { name: "SeaGreen" }, { name: "SeaShell" }, { name: "Sienna" },
//     { name: "Silver" }, { name: "SkyBlue" }, { name: "SlateBlue" }, { name: "Snow" },
//     { name: "SpringGreen" }, { name: "SteelBlue" }, { name: "Tan" }, { name: "Thistle" },
//     { name: "Teal" }, { name: "Tomato" }, { name: "Turquoise" }, { name: "Violet" },
//     { name: "Wheat" }, { name: "White" }, { name: "Whitesmoke" }, { name: "Yellow" },
//     { name: "YellowGreen" },
//   ];

//   useEffect(() => {
//     const savedColors = localStorage.getItem("dynamicColors");
//     if (savedColors) {
//       setDynamicColors(JSON.parse(savedColors));
//     }
//   }, []);

//   useEffect(() => {
//     if (colors.length > 0) {
//       const lastColor = colors[colors.length - 1];
//       const element = colorRefs.current[lastColor];
//       if (element) {
//         element.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//     }
//   }, [colors]);

//   const handleImageUpload = (color) => ({ fileList: newFileList }) => {
//     setColorImages((prev) => ({
//       ...prev,
//       [color]: newFileList,
//     }));
//   };

//   const onFinish = (values) => {
//     console.log("Form Values:", values);
//   };

//   const handleCategoryChange = (value) => {
//     if (value === 'add-category') {
//       setIsAddingCategory(true);
//       return;
//     }
//     setSelectedCategory(value);
//     form.setFieldsValue({ subcategory: undefined, sizes: undefined });
//     setUniqueSubcategories([]);
//   };

//   const handleAddNewCategory = () => {
//     const trimmedCategory = newCategory.trim();
//     if (trimmedCategory && !categories.includes(trimmedCategory)) {
//       const updatedCategories = [...categories, trimmedCategory];
//       setCategories(updatedCategories);
      
//       // Initialize the new category in both subcategories and sizes
//       setSubcategories(prev => ({
//         ...prev,
//         [trimmedCategory]: []
//       }));
      
//       setSizes(prev => ({
//         ...prev,
//         [trimmedCategory]: []
//       }));
      
//       setSelectedCategory(trimmedCategory);
//       form.setFieldsValue({ 
//         category: trimmedCategory,
//         subcategory: undefined
//       });
//       setNewCategory('');
//       setIsAddingCategory(false);
      
//       toast.success(`Category "${trimmedCategory}" added successfully!`, {
//         position: "top-right",
//         autoClose: 1000,
//       });
//     } else if (!newCategory.trim()) {
//       toast.error("Please enter a category name", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } else {
//       toast.error("Category already exists", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   const handleAddNewSubcategory = () => {
//     if (newSubcategory.trim() && selectedCategory) {
//       const subcat = newSubcategory.trim();
//       if (!subcategories[selectedCategory]?.includes(subcat)) {
//         setSubcategories(prev => ({
//           ...prev,
//           [selectedCategory]: [...(prev[selectedCategory] || []), subcat]
//         }));
//         setNewSubcategory('');
//         setIsAddingSubcategory(false);
//         form.setFieldsValue({ subcategory: subcat });
//         toast.success(`Subcategory "${subcat}" added successfully!`, {
//           position: "top-right",
//           autoClose: 1000,
//         });
//       } else {
//         toast.error("Subcategory already exists", {
//           position: "top-right",
//           autoClose: 2000,
//         });
//       }
//     } else if (!newSubcategory.trim()) {
//       toast.error("Please enter a subcategory name", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } else {
//       toast.error("Please select a category first", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   const handleAddNewSize = () => {
//     if (newSize.trim() && selectedCategory) {
//       const size = newSize.trim().toUpperCase();
//       if (!sizes[selectedCategory]?.includes(size)) {
//         setSizes(prev => ({
//           ...prev,
//           [selectedCategory]: [...(prev[selectedCategory] || []), size]
//         }));
//         setNewSize('');
//         setIsAddingSize(false);
        
//         // Get current selected sizes from form
//         const currentSizes = form.getFieldValue('sizes') || [];
//         form.setFieldsValue({ sizes: [...currentSizes, size] });
        
//         toast.success(`Size "${size}" added successfully!`, {
//           position: "top-right",
//           autoClose: 1000,
//         });
//       } else {
//         toast.error("Size already exists", {
//           position: "top-right",
//           autoClose: 2000,
//         });
//       }
//     } else if (!newSize.trim()) {
//       toast.error("Please enter a size", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } else {
//       toast.error("Please select a category first", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   const handleRemoveSize = (sizeToRemove) => {
//     if (selectedCategory) {
//       setSizes(prev => ({
//         ...prev,
//         [selectedCategory]: prev[selectedCategory].filter(size => size !== sizeToRemove)
//       }));
      
//       // Remove from form values if selected
//       const currentSizes = form.getFieldValue('sizes') || [];
//       form.setFieldsValue({ 
//         sizes: currentSizes.filter(size => size !== sizeToRemove)
//       });
      
//       toast.success(`Size "${sizeToRemove}" removed successfully!`, {
//         position: "top-right",
//         autoClose: 1000,
//       });
//     }
//   };

//   const handleSubcategoryChange = (value) => {
//     if (value === 'add-subcategory') {
//       if (selectedCategory) {
//         setIsAddingSubcategory(true);
//       } else {
//         toast.error("Please select a category first", {
//           position: "top-right",
//           autoClose: 2000,
//         });
//       }
//       return;
//     }
//     setUniqueSubcategories((prev) =>
//       prev.includes(value) ? prev : [...prev, value]
//     );
//   };

//   const handleColorChange = (selectedColors) => {
//     setColors(selectedColors);
//     setColorImages((prev) => {
//       const updatedImages = {};
//       selectedColors.forEach((color) => {
//         if (prev[color]) updatedImages[color] = prev[color];
//       });
//       return updatedImages;
//     });
//   };

//   const handleAddColor = () => {
//     const trimmedColor = newColor.trim();
//     const isInColorOptions = colorOptions.some(
//       (option) => option.name.toLowerCase() === trimmedColor.toLowerCase()
//     );
//     const isInDynamicColors = dynamicColors.some(
//       (color) => color.toLowerCase() === trimmedColor.toLowerCase()
//     );

//     if (trimmedColor && !isInColorOptions && !isInDynamicColors) {
//       const updatedColors = [...dynamicColors, trimmedColor];
//       setDynamicColors(updatedColors);
//       setColors([...colors, trimmedColor]);
//       form.setFieldsValue({ colors: [...colors, trimmedColor] });
//       localStorage.setItem("dynamicColors", JSON.stringify(updatedColors));
//       setNewColor("");
//       toast.success(`Color "${trimmedColor}" added successfully!`, {
//         position: "top-right",
//         autoClose: 1000,
//       });
//     } else if (!trimmedColor) {
//       toast.error("Please enter a valid color name", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } else {
//       toast.error("Color already exists in the dropdown", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       if (!values.price || values.price <= 0) {
//         throw new Error("Price is required and must be greater than 0");
//       }

//       if (
//         colors.length > 0 &&
//         !Object.keys(colorImages).some((color) => colorImages[color]?.length > 0)
//       ) {
//         throw new Error("Please upload at least one image for a selected color");
//       }

//       const productData = new FormData();
//       productData.append("name", values.productName || "");
//       productData.append("description", values.description || "");
//       productData.append("price", values.price.toString());
//       productData.append("oldPrice", values.oldPrice?.toString() || "0");
//       productData.append("category", values.category || "");
//       productData.append("subcategory", values.subcategory || "");
//       productData.append("availableStock", values.stock?.toString() || "0");

//       values.sizes?.forEach((size) => {
//         productData.append("availableSizes[]", size);
//       });

//       colors.forEach((color) => {
//         productData.append("availableColors[]", color);
//       });

//       const uploadedImagesByColor = {};
//       for (const [color, images] of Object.entries(colorImages)) {
//         if (images?.length > 0) {
//           const uploadedImages = await Promise.all(
//             images.map(async (file, index) => {
//               if (!file.originFileObj) {
//                 throw new Error(`Invalid file for ${color} at index ${index}`);
//               }
//               const data = new FormData();
//               data.append("file", file.originFileObj);
//               data.append("upload_preset", "Silksew");
//               data.append("cloud_name", "dejdni8vi");
//               data.append("folder", "image");

//               const res = await fetch(
//                 "https://api.cloudinary.com/v1_1/dejdni8vi/image/upload",
//                 {
//                   method: "POST",
//                   body: data,
//                 }
//               );

//               if (!res.ok) {
//                 throw new Error(
//                   `Image upload failed for ${color}: ${res.statusText}`
//                 );
//               }

//               const uploadedImage = await res.json();
//               return uploadedImage.secure_url;
//             })
//           );
//           uploadedImagesByColor[color] = uploadedImages;
//         }
//       }
//       productData.append("images", JSON.stringify(uploadedImagesByColor));

//       const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//       const response = await axios.post(
//         "https://api.silksew.com/api/products",
//         productData,
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : "",
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 201 || response.status === 200) {
//         toast.success("Product Added Successfully!", {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });

//         form.resetFields();
//         setColorImages({});
//         setColors([]);
//         setUniqueSubcategories([]);
//       }
//     } catch (error) {
//       const errorMessage =
//         error.message || "An unexpected error occurred. Please check all required fields.";
//       console.error("Error adding product:", error);
//       toast.error(`Failed to add product: ${errorMessage}`, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   return (
//     <div style={{ padding: "100px" }}>
//       <ToastContainer
//         position="top-right"
//         autoClose={1000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//       <div style={{ maxHeight: "500px", overflowY: "auto" }}>
//         <Form form={form} layout="vertical" onFinish={onFinish}>
//           <Form.Item
//             name="productName"
//             label="Product Name"
//             rules={[{ required: true, message: "Please enter product name" }]}
//           >
//             <Input placeholder="Enter product name" />
//           </Form.Item>

//           <Form.Item
//             name="category"
//             label="Category"
//             rules={[{ required: true, message: "Please select a category" }]}
//           >
//             {isAddingCategory ? (
//               <div style={{ display: 'flex', gap: '8px' }}>
//                 <Input
//                   placeholder="Enter new category name"
//                   value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   style={{ flex: 1 }}
//                 />
//                 <Button type="primary" onClick={handleAddNewCategory}>
//                   Add
//                 </Button>
//                 <Button onClick={() => {
//                   setIsAddingCategory(false);
//                   setNewCategory('');
//                   form.setFieldsValue({ category: undefined });
//                 }}>
//                   Cancel
//                 </Button>
//               </div>
//             ) : (
//               <Select 
//                 placeholder="Select category" 
//                 onChange={handleCategoryChange}
//                 dropdownRender={menu => (
//                   <div>
//                     {menu}
//                     <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
//                       <Button 
//                         type="text" 
//                         icon={<PlusOutlined />} 
//                         onClick={() => handleCategoryChange('add-category')}
//                         style={{ width: '100%', textAlign: 'left' }}
//                       >
//                         Add New Category
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               >
//                 {categories.map((cat) => (
//                   <Option key={cat} value={cat}>
//                     {cat}
//                   </Option>
//                 ))}
//               </Select>
//             )}
//           </Form.Item>

//           {selectedCategory && (
//             <Form.Item
//               name="subcategory"
//               label="Subcategory"
//               rules={[{ required: true, message: "Please select a subcategory" }]}
//             >
//               {isAddingSubcategory ? (
//                 <div style={{ display: 'flex', gap: '8px' }}>
//                   <Input
//                     placeholder="Enter new subcategory name"
//                     value={newSubcategory}
//                     onChange={(e) => setNewSubcategory(e.target.value)}
//                     style={{ flex: 1 }}
//                   />
//                   <Button type="primary" onClick={handleAddNewSubcategory}>
//                     Add
//                   </Button>
//                   <Button onClick={() => {
//                     setIsAddingSubcategory(false);
//                     setNewSubcategory('');
//                     form.setFieldsValue({ subcategory: undefined });
//                   }}>
//                     Cancel
//                   </Button>
//                 </div>
//               ) : (
//                 <Select
//                   placeholder="Select subcategory"
//                   onChange={handleSubcategoryChange}
//                   dropdownRender={menu => (
//                     <div>
//                       {menu}
//                       <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
//                         <Button 
//                           type="text" 
//                           icon={<PlusOutlined />} 
//                           onClick={() => handleSubcategoryChange('add-subcategory')}
//                           style={{ width: '100%', textAlign: 'left' }}
//                         >
//                           Add New Subcategory
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 >
//                   {subcategories[selectedCategory]?.map((sub) => (
//                     <Option key={sub} value={sub}>
//                       {sub}
//                     </Option>
//                   ))}
//                 </Select>
//               )}
//             </Form.Item>
//           )}

//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[
//               { required: true, message: "Please enter product description" },
//             ]}
//           >
//             <TextArea rows={4} placeholder="Enter product description" />
//           </Form.Item>

//           <Form.Item
//             name="price"
//             label="Price"
//             rules={[
//               { required: true, message: "Please enter price" },
//               {
//                 validator: (_, value) =>
//                   value > 0
//                     ? Promise.resolve()
//                     : Promise.reject(new Error("Price must be greater than 0")),
//               },
//             ]}
//           >
//             <InputNumber
//               style={{ width: "100%" }}
//               min={0.01}
//               step={0.01}
//               placeholder="Enter price"
//             />
//           </Form.Item>

//           <Form.Item
//             name="stock"
//             label="Available Stock"
//             rules={[{ required: true, message: "Please enter available stock" }]}
//           >
//             <InputNumber
//               style={{ width: "100%" }}
//               min={0}
//               placeholder="Enter available stock"
//             />
//           </Form.Item>

//           {selectedCategory && (
//             <div>
//               <Form.Item
//                 name="sizes"
//                 label="Available Sizes"
//                 rules={[{ required: true, message: "Please select at least one size" }]}
//               >
//                 <Select
//                   mode="multiple"
//                   placeholder="Select available sizes"
//                   dropdownRender={menu => (
//                     <div>
//                       {menu}
//                       <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
//                         {isAddingSize ? (
//                           <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
//                             <Input
//                               placeholder="Enter new size (e.g., XS, S, M)"
//                               value={newSize}
//                               onChange={(e) => setNewSize(e.target.value)}
//                               style={{ flex: 1 }}
//                             />
//                             <Button type="primary" onClick={handleAddNewSize}>
//                               Add
//                             </Button>
//                             <Button onClick={() => {
//                               setIsAddingSize(false);
//                               setNewSize('');
//                             }}>
//                               Cancel
//                             </Button>
//                           </div>
//                         ) : (
//                           <Button 
//                             type="text" 
//                             icon={<PlusOutlined />} 
//                             onClick={() => setIsAddingSize(true)}
//                             style={{ width: '100%', textAlign: 'left' }}
//                           >
//                             Add New Size
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 >
//                   {sizes[selectedCategory]?.map((size) => (
//                     <Option key={size} value={size}>
//                       {size}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
              
//               {/* Display available sizes with remove option */}
//               <div style={{ marginBottom: '16px' }}>
//                 <div style={{ marginBottom: '8px', fontWeight: '500' }}>Available Sizes for this Category:</div>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
//                   {sizes[selectedCategory]?.map((size) => (
//                     <Tag
//                       key={size}
//                       closable
//                       onClose={() => handleRemoveSize(size)}
//                       style={{ padding: '4px 8px', fontSize: '14px' }}
//                     >
//                       {size}
//                     </Tag>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           <Form.Item label="Add New Color">
//             <Input
//               placeholder="Enter color name (e.g., Red, Blue)"
//               value={newColor}
//               onChange={(e) => setNewColor(e.target.value)}
//               style={{ width: "70%", marginRight: "10px" }}
//             />
//             <Button type="primary" onClick={handleAddColor}>
//               Add Color
//             </Button>
//           </Form.Item>

//           <Form.Item
//             name="colors"
//             label="Colors"
//             rules={[{ required: true, message: "Please select at least one color" }]}
//           >
//             <Select
//               mode="multiple"
//               placeholder="Select colors"
//               onChange={handleColorChange}
//               getPopupContainer={(trigger) => trigger.parentNode}
//               dropdownStyle={{ position: "absolute", maxHeight: "200px", overflowY: "auto" }}
//             >
//               {[...colorOptions.map((option) => option.name), ...dynamicColors].map((color) => (
//                 <Option key={color} value={color}>
//                   {color}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {colors.map((color) => (
//             <Form.Item
//               key={color}
//               label={`Images for ${color}`}
//               rules={[{ required: true, message: `Please upload at least one image for ${color}` }]}
//               getValueFromEvent={() => colorImages[color] || []}
//             >
//               <div ref={(el) => (colorRefs.current[color] = el)}>
//                 <Upload
//                   listType="picture-card"
//                   multiple
//                   fileList={colorImages[color] || []}
//                   onChange={handleImageUpload(color)}
//                   beforeUpload={() => false}
//                 >
//                   <div>
//                     <PlusOutlined />
//                     <div style={{ marginTop: 4 }}>Upload</div>
//                   </div>
//                 </Upload>
//               </div>
//             </Form.Item>
//           ))}
//         </Form>
//       </div>

//       <Form.Item>
//         <Button type="primary" style={{ width: "100%" }} onClick={handleSubmit}>
//           Add Product
//         </Button>
//       </Form.Item>
//     </div>
//   );
// };

// export default AdminProductForm;



import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Input, Select, InputNumber, Button, Upload, Tag } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const AdminProductForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [colors, setColors] = useState([]);
  const [dynamicColors, setDynamicColors] = useState(() => {
    const savedColors = localStorage.getItem("dynamicColors");
    return savedColors ? JSON.parse(savedColors) : [];
  });
  const [newColor, setNewColor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [colorImages, setColorImages] = useState({});
  const [uniqueSubcategories, setUniqueSubcategories] = useState([]);
  const [categories, setCategories] = useState(["Indian & Fusion Wear", "Western Wear", "Formal Wear", "New Arrivals"]);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [isAddingSize, setIsAddingSize] = useState(false);
  const colorRefs = useRef({});
  
  const [subcategories, setSubcategories] = useState({
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
    "New Arrivals": ["Kurtis"]
  });

  const [sizes, setSizes] = useState({
    "Indian & Fusion Wear": ["XS", "S", "M", "L", "XL", "XXL"],
    "Western Wear": ["XS", "S", "M", "L", "XL", "XXL"],
    "Formal Wear": ["XS", "S", "M", "L", "XL", "XXL"],
    "New Arrivals": ["XS", "S", "M", "L", "XL", "XXL"]
  });

  const colorOptions = [
    { name: "AliceBlue" }, { name: "AntiqueWhite" }, { name: "Aqua" }, { name: "Aquamarine" },
    { name: "Azure" }, { name: "Beige" }, { name: "Bisque" }, { name: "BlanchedAlmond" },
    { name: "Blue" }, { name: "BlueViolet" }, { name: "Brown" }, { name: "Burlywood" },
    { name: "CadetBlue" }, { name: "Chartreuse" }, { name: "Chocolate" }, { name: "Angel" },
    { name: "CornflowerBlue" }, { name: "Cornsilk" }, { name: "Crimson" }, { name: "Cyan" },
    { name: "DarkBlue" }, { name: "DarkCyan" }, { name: "DarkGoldenrod" }, { name: "DarkGray" },
    { name: "DarkGreen" }, { name: "DarkKhaki" }, { name: "DarkMagenta" }, { name: "DarkOliveGreen" },
    { name: "DarkOrange" }, { name: "DarkOrchid" }, { name: "DarkRed" }, { name: "DarkSalmon" },
    { name: "DarkSeagreen" }, { name: "DarkSlateBlue" }, { name: "DarkSlateGray" }, { name: "DarkTurquoise" },
    { name: "DarkViolet" }, { name: "DeepPink" }, { name: "DeepSkyBlue" }, { name: "DimGray" },
    { name: "DodgerBlue" }, { name: "Firebrick" }, { name: "FloralWhite" }, { name: "ForestGreen" },
    { name: "Fuchsia" }, { name: "Gainsboro" }, { name: "GhostWhite" }, { name: "Gold" },
    { name: "Goldenrod" }, { name: "Gray" }, { name: "Green" }, { name: "GreenYellow" },
    { name: "Honeydew" }, { name: "HotPink" }, { name: "IndianRed" }, { name: "Indigo" },
    { name: "Ivory" }, { name: "Khaki" }, { name: "Lavender" }, { name: "LavenderBlush" },
    { name: "LawnGreen" }, { name: "LemonChiffon" }, { name: "LightBlue" }, { name: "LightCoral" },
    { name: "LightCyan" }, { name: "LightGoldenrodYellow" }, { name: "LightGreen" }, { name: "LightGrey" },
    { name: "LightPink" }, { name: "LightSalmon" }, { name: "LightSeaGreen" }, { name: "LightSkyBlue" },
    { name: "LightSlateGray" }, { name: "LightSteelBlue" }, { name: "LightYellow" }, { name: "Lime" },
    { name: "LimeGreen" }, { name: "Linen" }, { name: "Magenta" }, { name: "Maroon" },
    { name: "MediumAquamarine" }, { name: "MediumBlue" }, { name: "MediumOrchid" }, { name: "MediumPurple" },
    { name: "MediumSeaGreen" }, { name: "MediumSlateBlue" }, { name: "MediumSpringGreen" }, { name: "MediumTurquoise" },
    { name: "MediumVioletRed" }, { name: "MidnightBlue" }, { name: "MintCream" }, { name: "MistyRose" },
    { name: "Moccasin" }, { name: "NavajoWhite" }, { name: "Navy" }, { name: "OldLace" },
    { name: "OliveDrab" }, { name: "Orange" }, { name: "OrangeRed" }, { name: "Orchid" },
    { name: "PaleGoldenrod" }, { name: "PaleGreen" }, { name: "PaleTurquoise" }, { name: "PaleVioletRed" },
    { name: "PapayaWhip" }, { name: "PeachPuff" }, { name: "Peru" }, { name: "Pink" },
    { name: "Plum" }, { name: "PowderBlue" }, { name: "Purple" }, { name: "Red" },
    { name: "RosyBrown" }, { name: "RoyalBlue" }, { name: "SaddleBrown" }, { name: "Salmon" },
    { name: "SandyBrown" }, { name: "SeaGreen" }, { name: "SeaShell" }, { name: "Sienna" },
    { name: "Silver" }, { name: "SkyBlue" }, { name: "SlateBlue" }, { name: "Snow" },
    { name: "SpringGreen" }, { name: "SteelBlue" }, { name: "Tan" }, { name: "Thistle" },
    { name: "Teal" }, { name: "Tomato" }, { name: "Turquoise" }, { name: "Violet" },
    { name: "Wheat" }, { name: "White" }, { name: "Whitesmoke" }, { name: "Yellow" },
    { name: "YellowGreen" },
  ];

  useEffect(() => {
    const savedColors = localStorage.getItem("dynamicColors");
    if (savedColors) {
      setDynamicColors(JSON.parse(savedColors));
    }
  }, []);

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
    if (value === 'add-category') {
      setIsAddingCategory(true);
      return;
    }
    setSelectedCategory(value);
    form.setFieldsValue({ subcategory: undefined, sizes: undefined });
    setUniqueSubcategories([]);
  };

  const handleAddNewCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      const updatedCategories = [...categories, trimmedCategory];
      setCategories(updatedCategories);
      
      // Initialize the new category in both subcategories and sizes
      setSubcategories(prev => ({
        ...prev,
        [trimmedCategory]: []
      }));
      
      setSizes(prev => ({
        ...prev,
        [trimmedCategory]: []
      }));
      
      setSelectedCategory(trimmedCategory);
      form.setFieldsValue({ 
        category: trimmedCategory,
        subcategory: undefined
      });
      setNewCategory('');
      setIsAddingCategory(false);
      
      toast.success(`Category "${trimmedCategory}" added successfully!`, {
        position: "top-right",
        autoClose: 1000,
      });
    } else if (!newCategory.trim()) {
      toast.error("Please enter a category name", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error("Category already exists", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleAddNewSubcategory = () => {
    if (newSubcategory.trim() && selectedCategory) {
      const subcat = newSubcategory.trim();
      if (!subcategories[selectedCategory]?.includes(subcat)) {
        setSubcategories(prev => ({
          ...prev,
          [selectedCategory]: [...(prev[selectedCategory] || []), subcat]
        }));
        setNewSubcategory('');
        setIsAddingSubcategory(false);
        form.setFieldsValue({ subcategory: subcat });
        toast.success(`Subcategory "${subcat}" added successfully!`, {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error("Subcategory already exists", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } else if (!newSubcategory.trim()) {
      toast.error("Please enter a subcategory name", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error("Please select a category first", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleAddNewSize = () => {
    if (newSize.trim() && selectedCategory) {
      const size = newSize.trim().toUpperCase();
      if (!sizes[selectedCategory]?.includes(size)) {
        setSizes(prev => ({
          ...prev,
          [selectedCategory]: [...(prev[selectedCategory] || []), size]
        }));
        setNewSize('');
        setIsAddingSize(false);
        
        // Get current selected sizes from form
        const currentSizes = form.getFieldValue('sizes') || [];
        form.setFieldsValue({ sizes: [...currentSizes, size] });
        
        toast.success(`Size "${size}" added successfully!`, {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error("Size already exists", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } else if (!newSize.trim()) {
      toast.error("Please enter a size", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error("Please select a category first", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    if (selectedCategory) {
      setSizes(prev => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory].filter(size => size !== sizeToRemove)
      }));
      
      // Remove from form values if selected
      const currentSizes = form.getFieldValue('sizes') || [];
      form.setFieldsValue({ 
        sizes: currentSizes.filter(size => size !== sizeToRemove)
      });
      
      toast.success(`Size "${sizeToRemove}" removed successfully!`, {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleSubcategoryChange = (value) => {
    if (value === 'add-subcategory') {
      if (selectedCategory) {
        setIsAddingSubcategory(true);
      } else {
        toast.error("Please select a category first", {
          position: "top-right",
          autoClose: 2000,
        });
      }
      return;
    }
    setUniqueSubcategories((prev) =>
      prev.includes(value) ? prev : [...prev, value]
    );
  };

  const handleColorChange = (selectedColors) => {
    setColors(selectedColors);
    setColorImages((prev) => {
      const updatedImages = {};
      selectedColors.forEach((color) => {
        if (prev[color]) updatedImages[color] = prev[color];
      });
      return updatedImages;
    });
  };

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
      setColors([...colors, trimmedColor]);
      form.setFieldsValue({ colors: [...colors, trimmedColor] });
      localStorage.setItem("dynamicColors", JSON.stringify(updatedColors));
      setNewColor("");
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

      if (!values.price || values.price <= 0) {
        throw new Error("Price is required and must be greater than 0");
      }

      if (
        colors.length > 0 &&
        !Object.keys(colorImages).some((color) => colorImages[color]?.length > 0)
      ) {
        throw new Error("Please upload at least one image for a selected color");
      }

      const productData = new FormData();
      productData.append("name", values.productName || "");
      productData.append("description", values.description || "");
      productData.append("price", values.price.toString());
      productData.append("oldPrice", values.oldPrice?.toString() || "0");
      productData.append("category", values.category || "");
      productData.append("subcategory", values.subcategory || "");
      productData.append("availableStock", values.stock?.toString() || "0");

      values.sizes?.forEach((size) => {
        productData.append("availableSizes[]", size);
      });

      colors.forEach((color) => {
        productData.append("availableColors[]", color);
      });

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
    <div className="admin-product-form-container">
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
      <div className="form-scroll-container">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" className="mobile-input" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            {isAddingCategory ? (
              <div className="flex-column-mobile">
                <Input
                  placeholder="Enter new category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mobile-input"
                />
                <Button type="primary" onClick={handleAddNewCategory} className="mobile-button">
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategory('');
                    form.setFieldsValue({ category: undefined });
                  }}
                  className="mobile-button"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Select
                placeholder="Select category"
                onChange={handleCategoryChange}
                className="mobile-select"
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => handleCategoryChange('add-category')}
                        className="mobile-dropdown-button"
                      >
                        Add New Category
                      </Button>
                    </div>
                  </div>
                )}
              >
                {categories.map((cat) => (
                  <Select.Option key={cat} value={cat}>
                    {cat}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

          {selectedCategory && (
            <Form.Item
              name="subcategory"
              label="Subcategory"
              rules={[{ required: true, message: "Please select a subcategory" }]}
            >
              {isAddingSubcategory ? (
                <div className="flex-column-mobile">
                  <Input
                    placeholder="Enter new subcategory name"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    className="mobile-input"
                  />
                  <Button type="primary" onClick={handleAddNewSubcategory} className="mobile-button">
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingSubcategory(false);
                      setNewSubcategory('');
                      form.setFieldsValue({ subcategory: undefined });
                    }}
                    className="mobile-button"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Select
                  placeholder="Select subcategory"
                  onChange={handleSubcategoryChange}
                  className="mobile-select"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => handleSubcategoryChange('add-subcategory')}
                          className="mobile-dropdown-button"
                        >
                          Add New Subcategory
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {subcategories[selectedCategory]?.map((sub) => (
                    <Select.Option key={sub} value={sub}>
                      {sub}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter product description" },
            ]}
          >
            <TextArea rows={4} placeholder="Enter product description" className="mobile-input" />
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
              className="mobile-input-number"
              min={0.01}
              step={0.01}
              placeholder="Enter price"
              controls={false}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Available Stock"
            rules={[{ required: true, message: "Please enter available stock" }]}
          >
            <InputNumber
              className="mobile-input-number"
              min={0}
              placeholder="Enter available stock"
              controls={false}
            />
          </Form.Item>

          {selectedCategory && (
            <div>
              <Form.Item
                name="sizes"
                label="Available Sizes"
                rules={[{ required: true, message: "Please select at least one size" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select available sizes"
                  className="mobile-select"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
                        {isAddingSize ? (
                          <div className="flex-column-mobile">
                            <Input
                              placeholder="Enter new size (e.g., XS, S, M)"
                              value={newSize}
                              onChange={(e) => setNewSize(e.target.value)}
                              className="mobile-input"
                            />
                            <Button type="primary" onClick={handleAddNewSize} className="mobile-button">
                              Add
                            </Button>
                            <Button
                              onClick={() => {
                                setIsAddingSize(false);
                                setNewSize('');
                              }}
                              className="mobile-button"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => setIsAddingSize(true)}
                            className="mobile-dropdown-button"
                          >
                            Add New Size
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                >
                  {sizes[selectedCategory]?.map((size) => (
                    <Select.Option key={size} value={size}>
                      {size}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Display available sizes with remove option */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '8px', fontWeight: '500' }}>
                  Available Sizes for this Category:
                </div>
                <div className="size-tags-container">
                  {sizes[selectedCategory]?.map((size) => (
                    <Tag
                      key={size}
                      closable
                      onClose={() => handleRemoveSize(size)}
                      className="size-tag"
                    >
                      {size}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Form.Item label="Add New Color">
            <Input
              placeholder="Enter color name (e.g., Red, Blue)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="mobile-input"
            />
            <Button type="primary" onClick={handleAddColor} className="mobile-button">
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
              className="mobile-select"
              getPopupContainer={(trigger) => trigger.parentNode}
              dropdownStyle={{
                position: 'absolute',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 9999,
              }}
            >
              {[...colorOptions.map((option) => option.name), ...dynamicColors].map((color) => (
                <Select.Option key={color} value={color}>
                  {color}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {colors.map((color) => (
            <Form.Item
              key={color}
              label={`Images for ${color}`}
              rules={[
                {
                  required: true,
                  message: `Please upload at least one image for ${color}`,
                },
              ]}
              getValueFromEvent={() => colorImages[color] || []}
            >
              <div ref={(el) => (colorRefs.current[color] = el)}>
                <Upload
                  listType="picture-card"
                  multiple
                  fileList={colorImages[color] || []}
                  onChange={handleImageUpload(color)}
                  beforeUpload={() => false}
                  className="mobile-upload"
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
        <Button type="primary" className="mobile-submit-button" onClick={handleSubmit}>
          Add Product
        </Button>
      </Form.Item>
    </div>
  );
};

export default AdminProductForm;