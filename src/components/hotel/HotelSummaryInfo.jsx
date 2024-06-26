import HotelRating from "./HotelRating";
import HotelReviewNumber from "./HotelReviewNumber";
import Link from "next/link";

const HotelSummaryInfo = ({ fromListPage, info, checkin, checkout }) => {
  let params = "";
  if (checkin && checkout) {
    params = `?checkin=${checkin}&checkout=${checkout}`;
  }
  return (
    <>
      <div className={fromListPage ? "flex-1" : "flex-1 container"}>
        <h2 className={fromListPage ? "font-bold text-lg" : "font-bold text-2xl"}>{info?.name}</h2>
        <p>📍 {info?.city}</p>
        <div className="flex gap-2 items-center my-4">
          <HotelRating id={info?.id} />
          <HotelReviewNumber id={info?.id} />
        </div>
        <div className="flex gap-4 items-center">
          <span className="bg-yellow-300 p-1 rounded-md">{info?.propertyCategory} Star Property</span>
          {info?.isBooked && <span className="text-red-500 font-semibold">Sold Out</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2 md:items-end justify-center">
        <h2 className="text-2xl font-bold md:text-right">${(info?.highRate + info?.lowRate) / 2}/night</h2>
        <p className=" md:text-right">Per Night for 1 Room</p>

        {
          fromListPage ? (<Link href={`/hotels/${info?.id}${params}`} className="btn-primary bg-primary">Details</Link>) :
            (
              <Link
                href={info?.isBooked ? "" : `/payment/${info?.id}${params}`}
                className={info?.isBooked ? "btn-disabled" : "btn-primary bg-primary"}
                disabled={info?.isBooked}
              >Book</Link>)
        }
      </div>
    </>
  );
};

export default HotelSummaryInfo;
