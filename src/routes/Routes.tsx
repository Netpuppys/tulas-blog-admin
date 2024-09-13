import SinglePost from "@/components/shared/SinglePost";
import DashboardLayout from "@/layouts/DashboardLayout";
import Login from "@/pages/Auth/Login";
import AllPosts from "@/pages/Dashboard/AllPosts";
import CreatePost from "@/pages/Dashboard/CreatePost";
import Home from "@/pages/Dashboard/Home";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

export default function Routes() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          // element={isTokenAvailable ? <Navigate to="/" /> : <Login />}
          element={<Login />}
        />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="all-posts" element={<AllPosts />} />
          <Route path="posts/1" element={<SinglePost />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

// const isTokenAvailable = localStorage.getItem("token");

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// const userRole = decodeJwtToken(isTokenAvailable as string)?.role;

// {isTokenAvailable ? (
//     <Route path="/" element={<AppLayout />}>
//       {/* Your existing routes inside AppLayout */}
//       <Route path="booking" element={<BookingList />} />
//       <Route path="booking/new" element={<FreeBooking />} />
//       <Route path="booking/new/:date" element={<BookingTheatres />} />
//       <Route
//         path="booking/new/:date/:theatreId"
//         element={<FreeBookingForm />}
//       />
//       <Route path="booking/:bookingId" element={<SingleBooking />} />
//       <Route path="reports" element={<Reports />} />

//       {/* {userRole === "admin" && (
//         <>
//           <Route path="date-block" element={<DateBlock />} />
//           <Route
//             path="date-block/:selectedDate"
//             element={<SelectedDate />}
//           />
//           <Route path="theater" element={<TheaterList />} />
//           <Route path="event" element={<EventList />} />
//           <Route path="decoration" element={<DecorationList />} />
//           <Route path="rose" element={<RoseList />} />
//           <Route path="photography" element={<PhotographyList />} />
//           <Route path="cake" element={<CakeList />} />
//           <Route path="food" element={<FoodList />} />
//           <Route path="changePassword" element={<ChangePassword />} />

//           <Route path="*" element={<Navigate to="/" />} />
//         </>
//       )} */}

//       {/* <Route path="*" element={<Navigate to="/" />} /> */}

//       {/* <Route path="*" element={<Navigate to="/" />} /> */}
//     </Route>
//   ) : (
//     <>
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="*" element={<Navigate to="/login" />} />
//     </>
//   )}
