import { ImLocation2 } from "react-icons/im";
import { FaBath } from "react-icons/fa";
import { IoBed } from "react-icons/io5";
import { Badge, NumberFormatter, Text, Image } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function PropertyCard({ property }) {
  const slides = property.images.map((img, i) => (
    <Carousel.Slide key={i} >
      <Image src={img} className="w-full h-full !bg-cover !bg-center !bg-no-repeat !object-center"/>
    </Carousel.Slide>
  ));

  return (
    <div className="card w-[340px] bg-white flex flex-col shadow-[0px_0px_12px_rgb(0,0,0,0.1)] relative rounded-lg overflow-hidden duration-100 hover:scale-105 ">
      {/* Badge for sell */}
      {property.type.toLowerCase() === 'for sell' && (
        <Badge className="z-50 absolute top-2 right-3 !capitalize !font-medium">
          For Sell
        </Badge>
      )}
      {/* image */}
      <Carousel
        withIndicators
        height={200}
        className="w-full h-[cover] max-h-[200px]"
      >
        {slides}
      </Carousel>
      <div className="mt-1 flex flex-col gap-3 p-4">
        <h2 className="text-xl flex items-center gap-2 text-HeadingColor">
          <ImLocation2 />{" "}
          <span className="text-lg font-medium">
            {property.address +
              " , " +
              property.city +
              " - " +
              property.country}{" "}
          </span>
        </h2>
        <div className="flex items-center justify-between text-HeadingColor">
          <span className="flex items-center text-lg gap-2">
            <IoBed /> <p className="text-sm">{property.bedrooms} Bed Rooms</p>
          </span>
          <span className="flex items-center text-lg gap-2">
            <FaBath />{" "}
            <p className="text-sm">{property.bathrooms} Bath Rooms</p>
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-HeadingColor">
            <NumberFormatter
              prefix="$ "
              value={property.price}
              thousandSeparator
            />

            {property.type.toLowerCase() === "for rent" ? (
              <Text span fz="sm" c="dimmed">
                / mo
              </Text>
            ) : (
              ""
            )}
          </h2>
          <Link
            to={`/property/${property._id}/${property.title
              .toLowerCase()
              .split(" ")
              .join("-")}`}
          >
            <button className="bg-white text-primaryColor px-4 py-3 text-sm font-medium">
              See More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default PropertyCard;