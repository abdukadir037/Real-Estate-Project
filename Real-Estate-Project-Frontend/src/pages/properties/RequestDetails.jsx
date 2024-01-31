import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, Badge, Group, Image, NumberFormatter, Text } from "@mantine/core";
import { ImLocation2 } from "react-icons/im";
import { HiHome } from "react-icons/hi2";
import { FaBath } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import Map from "../../components/propertyContent/Map";
import {
  useApproveMutation,
  useGetRequestsQuery,
} from "../../store/api/PropertySlice";
import { useGetUserQuery } from "../../store/api/UserSlice";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { Carousel } from "@mantine/carousel";

function RequestDetails() {
  const { data: requests = [], error, isLoading } = useGetRequestsQuery();
  const { data: user = {}} = useGetUserQuery();

  const { id } = useParams();
  const navigate = useNavigate()
  const [value, setValue] = useState(false);

  const request = requests.find((request) => request && request._id === id);
  const [approve] = useApproveMutation();

  // Approve to Request
  const HandleApprove = (id) => {
    approve(id)
      .unwrap()
      .then((result) => {
        toast.success(result.message);
        navigate("/transaction-history")
        setValue(true);
      })
      .catch((error) => {
        toast.error(error.data.message);
      });
  };
  
  const slides = request?.property?.images.map((img) => (
    <Carousel.Slide key={img}>
      <Image
        src={img}
        className="w-full h-full !bg-cover !bg-center !bg-no-repeat !object-center"
      />
    </Carousel.Slide>
  ));

  return (
    <section>
      <div className="container relative">
        {isLoading ? (
          <div className="py-[14rem] flex gap-2 items-center justify-center ">
            <span className="w-6 h-6 rounded-full border-2 border-primaryColor border-l-white animate-spin"></span>
            Loading...
          </div>
        ) : (
          <>
            {/* Badge Available */}
            <div className="badge z-40 absolute top-2 left-[3rem] md:left-[4rem] lg:left-[5rem] xl:left-[7rem]">
              <Badge
                color={request?.property?.available ? "lime" : "red"}
                className="!capitalize !font-medium"
              >
                {request?.property?.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            {/* Cover Img */}
            <Carousel
              withIndicators
              className="!bg-cover img h-auto max-h-[300px] sm:max-h-[550px] xl:max-h-[750px] rounded-2xl overflow-hidden"
            >
              {slides}
            </Carousel>
            {/* Details */}
            <div className="flex flex-col xl:flex-row justify-between mt-4 gap-4">
              {/* info */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                  <h2 className="font-medium text-2xl md:text-3xl text-HeadingColor">
                    {request?.property?.title}
                  </h2>
                  <h3 className="text-xl md:text-3xl font-medium">
                    <NumberFormatter
                      prefix="$ "
                      value={request?.property?.price}
                      thousandSeparator
                      className="text-HeadingColor"
                    />

                    {request?.property?.type.toLowerCase() === "for rent" ? (
                      <Text span fz="sm" c="dimmed">
                        / mo
                      </Text>
                    ) : (
                      ""
                    )}
                  </h3>
                </div>
                <p className="my-2 whitespace-pre-wrap text-lg text-gray-600 ">
                  {request?.property?.description}
                </p>
                <Badge className="my-1 !capitalize !font-medium" >
                  {formatDistanceToNow(new Date(request?.createdAt), {
                    addSuffix: true,
                  }).split("about")}
                </Badge>

                {/* property info */}
                <div className="flex flex-col gap-3">
                  <Text size="xl" className="font-medium">
                    Property Info
                  </Text>
                  <div className="flex flex-col gap-4 sm:flex-row justify-between text-HeadingColor">
                    <span className="flex items-center text-sm sm:text-lg gap-2">
                      <HiHome />{" "}
                      <p className="text-sm">
                        {request?.property?.propertyType}
                      </p>
                    </span>
                    <span className="flex items-center text-lg gap-2">
                      <IoBed />{" "}
                      <p className="text-sm">
                        {request?.property?.bedrooms} Bed Rooms
                      </p>
                    </span>
                    <span className="flex items-center text-lg gap-2">
                      <FaBath />{" "}
                      <p className="text-sm">
                        {request?.property?.bathrooms} Bath Rooms
                      </p>
                    </span>
                  </div>
                </div>
                {/* address info */}
                <div className="flex flex-col gap-3 mt-4">
                  <Text size="xl" className="font-medium">
                    Address
                  </Text>
                  <h2 className="text-lg sm:text-xl flex !items-center gap-2">
                    <ImLocation2 />{" "}
                    <span className="text-sm sm:text-lg font-medium">
                      {request?.property?.address +
                        " , " +
                        request?.property?.city +
                        " - " +
                        request?.property?.country}{" "}
                    </span>
                  </h2>
                </div>

                {/* owner info */}
                {request?.property?.owner &&
                  request?.property?.owner._id !== user?._id && (
                    <div className="flex flex-col gap-3 mt-3">
                      <Text size="xl" className="font-medium">
                        Owner Info
                      </Text>
                      <div className="flex flex-col gap-3 md:flex-row justify-between">
                        <Group>
                          {/* avatar */}
                          <Avatar
                            src={request?.property?.owner?.avatar}
                            radius="xl"
                          />
                          {/* info */}
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>
                              {request?.property?.owner?.name}{" "}
                            </Text>
                            <Text c="dimmed" size="xs">
                              {request?.property?.owner?.email}
                            </Text>
                          </div>
                        </Group>
                        {/* buttons */}
                        <div className="flex flex-col gap-3 md:flex-row mt-3 md:mt-0">
                          <Link
                            to={`/property/${request?.property?._id}/contact/owner`}
                            className="w-full flex md:w-auto"
                          >
                            <button className="!w-full bg-primaryColor px-4 py-3 text-sm flex items-center justify-center rounded-xl text-white duration-100 hover:scale-105">
                              Contact Owner
                            </button>
                          </Link>
                          <button className="bg-primaryColor px-4 py-3 text-sm flex items-center justify-center rounded-xl text-white duration-100">
                            Pending approval
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                {/* sender  info */}
                {request.sender && request.sender._id !== user?._id && (
                  <div className="flex flex-col gap-3 mt-3">
                    <Text size="xl" className="font-medium">
                      Sender Info
                    </Text>
                    <div className="flex flex-col gap-3 md:flex-row justify-between">
                      <Group>
                        {/* avatar */}
                        <Avatar
                          src={request.sender && request.sender.avatar}
                          radius="xl"
                        />
                        {/* info */}
                        <div style={{ flex: 1 }}>
                          <Text size="sm" fw={500}>
                            {request.sender.name}{" "}
                          </Text>

                          <Text c="dimmed" size="xs">
                            {request.sender.email}
                          </Text>
                        </div>
                      </Group>
                      {/* buttons */}

                      <div className="flex flex-col gap-3 md:flex-row mt-3 md:mt-0">
                        <button
                          onClick={() => HandleApprove(request._id)}
                          className="bg-primaryColor px-4 py-3 text-sm flex items-center justify-center rounded-xl text-white duration-100 hover:scale-105"
                        >
                          {value ? "Approve Request" : "Approved Request"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/*  location map */}
              <div className="w-full xl:!w-[600px]">
                <Map
                  country={request?.property?.country}
                  city={request?.property?.city}
                  address={request?.property?.address}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default RequestDetails;
