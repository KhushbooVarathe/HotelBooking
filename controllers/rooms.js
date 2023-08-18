const RoomSchema = require('../modals/Room')
const UserSchema=require('../modals/Users')
const HotelSchema = require('../modals/Hotels')
const createError = require('../utils/error')
const BookedRoom = require('../modals/Bookedrooms')
var express = require('express')
const app = express()
app.use(express.json())
const baseUrl = 'http://localhost:7000/'

const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId
  console.log(hotelId, 'hotelId', req.body, req.file)
  req.body.roomNumbers = [{ number: req.body.roomNumbers[0] }]
  // req.body.photos = [{ filename: req.file.filename, path: req.file.path }]
  req.body.photos = [{ filename: `${baseUrl}${req.file.path}` }]
  const newRoom = new RoomSchema(req.body)
  console.log(newRoom, 'newRoom')
  try {
    const savedRoom = await newRoom.save()
    console.log(savedRoom, 'savedRoom')
    try {
      await HotelSchema.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id }
      })
    } catch (error) {
      next(error)
    }
    res.status(200).json(`${savedRoom.title} ADDED SUCCESSFULLY`)
  } catch (error) {
    next(error)
  }
}
const updateRoom = async (req, res, next) => {
  console.log('req.body', req.body)
  req.body.photos = [{ filename: `${baseUrl}${req.file.path}` }]
  try {
    const updatenewRoom = await RoomSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    console.log('updatenewRoom', updatenewRoom)
    res.status(200).send(updatenewRoom)
  } catch (err) {
    // console.log("er",err)
    // res.status(500).json(err)
    next(err)
  }
}

const deleteRoom = async (req, res, next) => {
  console.log('req.body', req)
  const hoteldeleteId = req.params.hotelId
  console.log(hoteldeleteId, 'hoteldeleteId', req.params.id)
  try {
    const deletenewRoom = await RoomSchema.findByIdAndDelete(req.params.id)
    console.log('deletenewRoom', deletenewRoom)

    try {
      await HotelSchema.findByIdAndUpdate(hoteldeleteId, {
        $pull: { rooms: req.params.id }
      })
    } catch (error) {
      next(error)
    }

    res.status(200).send('room has been deleted')
  } catch (err) {
    // console.log("er",err)
    // res.status(500).json(err)
    next(err)
  }
}

const Room = async (req, res, next) => {
  console.log('I am room routes', req.body, 'hehehheeh')

  try {
    const Rooms = await RoomSchema.find()
    res.status(200).send(Rooms)
  } catch (err) {
    next(err)
    // console.log("er",err)
    // res.status(500).json(err)
  }
}


const AddHotelRoom = async (req, res, next) => {
  console.log(req.params.id, 'I am AddHotelRoom routes')

  try {
    const getHotel = await HotelSchema.findById(req.params.id)
    console.log('getHotel', getHotel, typeof getHotel, getHotel.rooms)

    // Use Promise.all to wait for all room fetching operations to complete
    const RoomsAll = await Promise.all(
      getHotel.rooms.map(async roomid => {
        const getRooms = await RoomSchema.findById(roomid)
        console.log(getRooms, 'getroooomsssssss')
        return getRooms
      })
    )

    console.log(RoomsAll)
    res.send(RoomsAll)
  } catch (err) {
    console.log('error', err)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching rooms for the hotel.' })
  }
}

const getoneRoom = async (req, res, next) => {
  console.log('I am roomone routes', req.body, 'hehehheeh')

  try {
    const AllRoom = await RoomSchema.findById(req.params.id)
    res.status(200).send(AllRooms)
  } catch (err) {
    next(err)
    // console.log("er",err)
    // res.status(500).json(err)
  }
}
const AlreadyBookedHotelRooms = async (req, res, next) => {
  console.log("alreadybookedrooms route", req.body, req.params.id);
  try {
    const getData = await BookedRoom.find({ roomId: req.params.id });

    if (getData.length === 0) {
      console.log("No room found with this id");
      return res.send("No room found with this id");
    } else {
      console.log(getData, "getdataaaaaaa", typeof getData);
      const fromDateToMatch = req.body.fromDate; // Keep it as a string

      let isAlreadyBooked = false;

      getData.forEach((ob) => {
        const matchingFromDate = ob.fromDate.includes(req.body.fromDate);
        const matchingToDate = ob.toDate.includes(req.body.toDate);

        console.log(ob.fromDate, "obbbbbbbbbbbb", matchingFromDate, matchingToDate);

        if (matchingFromDate && matchingToDate) {
          isAlreadyBooked = true;
        }
      });

      if (isAlreadyBooked) {
        res.send(false);
      } else {
        res.send(true);
      }
    }
  } catch (error) {
    console.error("Error fetching booked rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const BookedRooms = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.body;
    const { userid, roomid, paramsid } = req.params;

    // Validate fromDate and toDate
    if (!fromDate || !toDate || new Date(fromDate) >= new Date(toDate)) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    const [hoteldata, roomdata] = await Promise.all([
      HotelSchema.findById(paramsid),
      RoomSchema.findById(roomid),
    ]);

    if (!hoteldata || !roomdata) {
      return res.status(404).json({ error: 'Hotel or room not found' });
    }

    // Create an object to store room details
    // const roomDetails = {
    //   roomTitle: roomdata.title,
    //   roomPrice: roomdata.price,
    //   roomMaxPeople: roomdata.maxPeople,
    //   roomNumber: roomdata.roomNumbers[0].number,
    //   roomdesc: roomdata.desc,
    // };

    // Create a new document using the BookedRoom model
    const newBookedRoom = new BookedRoom({
      userId: userid,
      roomId:roomid,
      hotelName: hoteldata.name,
      roomTitle: roomdata.title,
      roomPrice: roomdata.price,
      roomMaxPeople: roomdata.maxPeople,
      roomNumber: roomdata.roomNumbers[0].number,
      roomdesc: roomdata.desc,
      // roomDetails: roomDetails, // Set roomDetails
      // ...roomDetails, // Spread the room details into the newBookedRoom object
      roomphotos: roomdata.photos.map(photo => ({ filename: photo.filename })), // Set roomphotos correctly
      isBooking: true,
      fromDate: fromDate,
      toDate: toDate
    });

    // Save the new document in the database
    await newBookedRoom.save();

    // Update bookedDate in RoomSchema
    try {
      await RoomSchema.updateOne(
        { _id: roomid },
        { $push: { bookedDate: fromDate } }
      );

      console.log('Room data updated successfully');
    } catch (err) {
      console.error('Error updating room data:', err);
      return res.status(500).json({ error: 'Error updating room data' });
    }

    console.log('Data saved successfully');
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};















const YourBookedRooms=async(req,res,next)=>{
  console.log('your booking', req.params.id)
  const userId = req.params.id
const bookings = await BookedRoom.find({ userId })

    console.log('Your bookings:', bookings, typeof bookings)
    res.send({data:"hehehe",bookings})
}



// const YourBookedRooms = async (req, res, next) => {
//   console.log('your booking', req.params.id)
//   const userId = req.params.id
//   try {
//     // Use the BookedRoom model to find all documents with the given userId
//     const bookings = await BookedRoom.find({ userId })

//     console.log('Your bookings:', bookings, typeof bookings)

//     // Use Promise.all to wait for all the room data and hotel data requests to complete
//     const bookingDataPromises = bookings.map(async booking => {
//       console.log(booking.roomId, 'hggggggggggggggggggggggfjghfj')
//       const getBooked = await BookedRoom.find({ roomId: booking.roomId })
//       console.log(getBooked, 'getbooked')

//       // Find room data using the RoomSchema model
//       const bookedRoom = await RoomSchema.findById(booking.roomId)
//       console.log(bookedRoom, 'bookedrommm')

//       // Find hotel data using the HotelSchema model
//       const bookedHotel = await HotelSchema.findById(booking.hotelId)
//       console.log(bookedHotel, 'bookedhotel')

//       // Return an object containing both room and hotel data for the current booking
//       return { room: bookedRoom, hotel: bookedHotel, booking: getBooked }
//     })

//     // Wait for all data requests to complete
//     const bookingData = await Promise.all(bookingDataPromises)

//     // Now bookingData will contain an array of objects, each containing room and hotel data for each booking
//     console.log('Booking data with room and hotel information:', bookingData)

//     // You can send the bookingData as a response to the client if needed
//     res.json(bookingData)
//   } catch (error) {
//     // Handle any errors that occurred during the process
//     console.error('Error fetching data:', error)
//     res.status(500).send('Error fetching data')
//   }
// }


const CancelBooking = async (req, res, next) => {
  try {
    const cancelId = req.params.cancelid;
    console.log(cancelId, "paramsidddddd");

    // Find the booked room by its ID and update the isBooking field to false
    const cancelRoomBooking = await BookedRoom.findByIdAndUpdate(
      cancelId,
      { isBooking: false },
      { new: true } // This option returns the updated document
    );

    if (!cancelRoomBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('Booking canceled:', cancelRoomBooking);
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};



// const CancelBooking = async (req, res, next) => {
//   console.log('cancel booking', req.params.roomid, req.params.userid, req.body);

//   req.body.isBooking = false;
//   console.log(req.body.dta, 'rewrfdd');

//   try {
//     const roomId = req.params.roomid; // Extract the room ID from the request parameters

//     const getbookedRoom = await BookedRoom.findByIdAndUpdate(
//       req.body.dta,
//       { isBooking: false }, // Update data: Set the 'isBooking' property to false
//       { new: true } // Option: Return the updated document
//     ).exec();

//     if (!getbookedRoom) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     console.log(getbookedRoom, "getbookedRoom");

//     // You can now use the 'getbookedRoom' object to perform any further processing if needed.

//     // Finally, you can send a response or do further processing.
//     res.status(200).json({ message: 'Booking canceled successfully' });
//   } catch (error) {
//     console.error('Error while canceling booking:', error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };
// const AllBookedRooms = async (req, res, next) => {
//   try {
//     const allrooms = await BookedRoom.find({});
//     console.log(allrooms, "allrooms");

//     const allUserDataPromises = allrooms.map(async (ob) => {
//       const roomData = await RoomSchema.findById(ob.roomId);
//       console.log('roomData: ', roomData);
//       const hotelData = await HotelSchema.findById(ob.hotelId);
//       console.log('hotelData: ', hotelData);
//       console.log(ob.userId, "obj");
//       const userData = await UserSchema.findById(ob.userId);
//       console.log('userData', userData);
//       return { userData, roomData, hotelData }; // Return userData, roomData, and hotelData
//     });

//     const allUserDataWithRoomAndHotelData = await Promise.all(allUserDataPromises);
//     console.log('allUserDataWithRoomAndHotelData', allUserDataWithRoomAndHotelData);

//     res.send(allUserDataWithRoomAndHotelData);
//   } catch (error) {
//     console.error('Error while fetching all booked rooms:', error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };

const AllBookedRooms = async (req, res, next) => {
  try {
    const allrooms = await BookedRoom.find({});
    console.log(allrooms, "allrooms", typeof allrooms);
    
    const resultArray = [];

    await Promise.all(allrooms.map(async rooms => {
      console.log("each_rooom=========>", rooms);
      const getUser = await UserSchema.findById(rooms.userId);
      console.log('getUser===============>: ', getUser);

      resultArray.push({
        user: getUser,
        room: rooms
      });
    }));

    res.json(resultArray); // Send the combined data as a JSON response
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};

module.exports = {
  CancelBooking,
  AlreadyBookedHotelRooms,
  Room,
  BookedRooms,
  YourBookedRooms,
  getoneRoom,
  createRoom,
  deleteRoom,
  updateRoom,
  AddHotelRoom,AllBookedRooms
}
