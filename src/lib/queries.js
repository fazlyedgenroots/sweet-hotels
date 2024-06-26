import { bookingModel } from "@/models/booking-model";
import { hotelModel } from "@/models/hotels-model";
import { ratingModel } from "@/models/rating-model";
import { reviewModel } from "@/models/review-model";
import { userModel } from "@/models/user-model";
import { isDateInbetween, replaceMongoIdInArray, replaceMongoIdInObject } from "@/utils/data-utils";

async function getHotels(destination, checkin, checkout, stars) {
    const regex = new RegExp(destination, "i");
    const hotelsByDestination = await hotelModel
        .find({ city: { $regex: regex } })
        .select(["thumbNailUrl", "name", "highRate", "lowRate", "city", "propertyCategory"])
        .lean();

    let allHotels = hotelsByDestination;

    if (checkin && checkout) {

        allHotels = await Promise.all(
            allHotels.map(async (hotel) => {
                const found = await findBooking(hotel._id, checkin, checkout);
                if (found) {
                    hotel["isBooked"] = true;
                } else {
                    hotel["isBooked"] = false;
                }
                return hotel;
            })
        );
    }

    if(stars){
        const starArr = stars.split("|");
        allHotels = allHotels.filter((hotel) => {
            return starArr.includes(hotel.propertyCategory.toString());
        });
    }
    return replaceMongoIdInArray(allHotels);
}

async function findBooking(hotelId, checkin, checkout) {
    const matches = await bookingModel
        .find({ hotelId: hotelId.toString() })
        .lean();

    const found = matches.find((match) => {
        return (
            isDateInbetween(checkin, match.checkin, match.checkout) ||
            isDateInbetween(checkout, match.checkin, match.checkout)
        );
    });
    return found;
}

async function getHotelById(hotelId, checkin, checkout) {
    const hotelById = await hotelModel.findById(hotelId).lean();
    let hotel = hotelById;

    if (checkin && checkout) {
        const found = await findBooking(hotelId, checkin, checkout);
        if (found) {
            hotel["isBooked"] = true;
        } else {
            hotel["isBooked"] = false;
        }
    }
    return replaceMongoIdInObject(hotel);
}


async function getReviewsForAHotel(hotelId) {
    const reviews = await reviewModel.find({ hotelId: hotelId }).lean();
    return replaceMongoIdInArray(reviews);
}

async function getRatingsForAHotel(hotelId) {
    const ratings = await ratingModel.find({ hotelId: hotelId }).lean();
    return replaceMongoIdInArray(ratings);
}

async function getUserByEmail(email) {
    const user = await userModel.findOne({ email: email }).lean();
    return replaceMongoIdInObject(user);
}

async function getBookingsByUserId(userId) {
    const bookings = await bookingModel.find({ userId: userId }).lean();
    return replaceMongoIdInArray(bookings);
}


export {
    getHotels,
    getHotelById,
    getReviewsForAHotel,
    getRatingsForAHotel,
    findBooking,
    getUserByEmail,
    getBookingsByUserId
};