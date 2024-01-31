import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  NativeSelect,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import {
  useEditPropertyMutation,
  useGetPropertiesQuery,
  useUpdateImagesMutation,
} from "../../store/api/PropertySlice";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useCountries from "../../hooks/useCountries";
import { IoClose } from "react-icons/io5";

const propertyTypes = ["Select Property Type", "House", "Villa", "Apartment"];

function AddPropertyContent() {
  const { data: properties = [], isLoading } = useGetPropertiesQuery();
  const [updateImages] = useUpdateImagesMutation();
  const [editProperty] = useEditPropertyMutation();

  const [step, setStep] = useState(1);
  const [errorImg, setErrorImg] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const { getCountries } = useCountries();
  const [property, setProperty] = useState({});
  const [images, setImages] = useState([]);

  const getInitialFormValues = () => ({
    country: property ? property.country : "",
    city: property ? property.city : "",
    address: property ? property.address : "",
    title: property ? property.title : "",
    type: property ? property.type : "",
    description: property ? property.description : "",
    price: property ? property.price : "",
    propertyType: property ? property.propertyType : "",
    bedrooms: property ? property.bedrooms : "",
    bathrooms: property ? property.bathrooms : "",
  });

  useEffect(() => {
    // Find the property when the properties or id change
    const foundProperty = properties.find((pro) => pro && pro._id === id) || {};
    setProperty(foundProperty);
  }, [properties, id, step]);

  useEffect(() => {
    if (property) {
      form.setValues(getInitialFormValues(property));
      setImages(property.images)
    }
  }, [property]);

  const form = useForm({
    initialValues: getInitialFormValues(),
    validate: (values) => {
      const errors = {};

      if (step === 1) {
        if (values.country.length < 3) {
          errors.country = "Please select country of property";
        }
        if (values.city.length < 3) {
          errors.city = "Please enter city of country";
        }
        if (values.address.length < 3) {
          errors.address = "Please enter address of property";
        }
      }

      if (step === 3) {
        if (values.title.length < 3) {
          errors.title = "Must have at least 3 characters";
        }
        if (
          values.propertyType === "Select Property Type" ||
          !values.type.trim()
        ) {
          errors.propertyType = "Please Select Property Type";
        }
        if (values.type === "Select Type" || !values.type.trim()) {
          errors.type = "Please Select Type";
        }
        if (values.description.length < 3) {
          errors.description = "Invalid description for property";
        }
        if (values.price < 50) {
          errors.price = "Price is required";
        }
        if (values.bathrooms < 1) {
          errors.bathrooms = "Bathrooms is required";
        }
        if (values.bedrooms < 1) {
          errors.bedrooms = "Bedrooms is required";
        }
      }

      return errors;
    },
  });

  const handleNextStep = (e) => {
    e.preventDefault();
  
    const { hasErrors } = form.validate();
  
    if (step === 2) {
      if (images.length === 0) {
        setErrorImg(true);
        return;
      }
    }
  
    if (!hasErrors) {
      setStep((current) => current + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const setupCloudinaryWidget = () => {
    if (window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_APP_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_APP_UPLOAD_PRESET,
          maxFiles: 30,
        },
        (err, result) => {
          if (err) {
            console.error(err);
          } else if (result.event === "success") {
            setImages((prevImages) => [...prevImages, result.info.secure_url]);
            setErrorImg(false);
          }
        }
      );
    }
  };

  useEffect(() => {
    setupCloudinaryWidget();
  }, []);

  const handleImageUpload = () => {
    widgetRef.current?.open();
  };

  const handleDeleteImg = (imageURL) => {
    const index = images.indexOf(imageURL);
    if (index !== -1) {
      const newImages = [...images];
      newImages.splice(index, 1);
      updateImages({ images: newImages, id })
        .unwrap()
    }
  };

  const handleSubmit = () => {
    editProperty({ propertyData: { ...form.values, images }, id })
      .unwrap()
      .then((result) => {
        toast.success(result.message);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.data.message);
      });
  };

  return (
    <div className="w-full md:w-2/4 xl:w-1/2 p-6 sm:p-8 rounded-lg flex flex-col shadow-[0px_0px_6px_rgb(0,0,0,0.1)]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 3) {
            handleSubmit();
          }
        }}
        className="w-full flex flex-col gap-3"
      >
        {step === 1 && (
          <>
            <h2 className="text-2xl md:text-3xl font-medium text-center">
              Location Info
            </h2>

            <Select
              label="Country"
              withAsterisk
              placeholder="Select your country"
              searchable
              clearable
              data={getCountries()}
              {...form.getInputProps("country")}
            />
            <TextInput
              label="City"
              withAsterisk
              placeholder="Type your city"
              {...form.getInputProps("city")}
            />
            <TextInput
              label="Address"
              withAsterisk
              placeholder="Type your address"
              {...form.getInputProps("address")}
            />
          </>
        )}

        {step === 2 && (
          <>
            {images.length <= 0 || images.length >= 30 ? (
              <h2 className="text-2xl md:text-3xl font-medium text-center">
                Upload Images
              </h2>
            ) : (
              <div
                className="cursor-pointer flex items-center justify-center gap-2 text-xl font-medium text-center text-primaryColor"
                onClick={handleImageUpload}
              >
                <AiOutlineCloudUpload />
                Upload More
              </div>
            )}

            <div className="w-full h-full flex itmes-center justify-center flex-col mt-4 gap-6">
              {images.length === 0 ? (
                <div
                  className={`w-full h-[260px] border-2 border-dashed ${
                    errorImg
                      ? "border-red-500 text-red-500"
                      : "border-primaryColor text-primaryColor"
                  } flex flex-col items-center justify-center cursor-pointer`}
                  onClick={handleImageUpload}
                >
                  <AiOutlineCloudUpload size={50} />
                  <span>Upload Image</span>
                </div>
              ) : (
                <div className="w-full h-full flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="w-[118px] sm:w-[140px] h-[80px] rounded-lg cursor-pointer relative group overflow-hidden"
                      onClick={() => handleDeleteImg(img)}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full bg-center bg-cover bg-no-repeat object-cover"
                      />
                      <div className="group-hover:flex hidden absolute top-0 left-0 bg-[rgba(0,0,0,0.4)] w-full h-full items-center justify-center text-white text-xl">
                        <IoClose />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl md:text-3xl font-medium text-center">
              Property Info
            </h2>
            <TextInput
              label="Title"
              withAsterisk
              placeholder="Type your title"
              {...form.getInputProps("title")}
            />
            <Textarea
              withAsterisk
              label="Description"
              placeholder="Description"
              {...form.getInputProps("description")}
            />
            <Select
              withAsterisk
              label="Property Type"
              placeholder="Property Type"
              clearable
              searchable
              data={propertyTypes}
              {...form.getInputProps("propertyType")}
            />
            <NativeSelect
              withAsterisk
              label="Type"
              placeholder="Select Type"
              data={["Select Type", "For Rent", "For Sell"]}
              {...form.getInputProps("type")}
            />
            <div className="w-full flex gap-2">
              <NumberInput
                label="Bedrooms"
                withAsterisk
                placeholder="1 bedroom"
                {...form.getInputProps("bedrooms")}
              />
              <NumberInput
                label="Bathrooms"
                withAsterisk
                placeholder="1 bathroom"
                {...form.getInputProps("bathrooms")}
              />
              <NumberInput
                withAsterisk
                label="Price"
                placeholder="$339.94"
                min={0}
                {...form.getInputProps("price")}
              />
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="mt-3 bg-gray-400 bg-opacity-90 hover:bg-opacity-100 px-6 py-2 text-sm flex items-center justify-center rounded text-white duration-100 "
            >
              Previous
            </button>
          )}
          {step === 3 ? (
            <button
              type="submit"
              className="mt-3 bg-primaryColor bg-opacity-90 hover:bg-opacity-100 px-6 py-2 text-sm flex items-center justify-center rounded text-white duration-100 "
            >
              Update Property
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => handleNextStep(e)}
              className="mt-3 bg-primaryColor bg-opacity-90 hover:bg-opacity-100 px-6 py-2 text-sm flex items-center justify-center rounded text-white duration-100 "
            >
              Next Step
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddPropertyContent;
