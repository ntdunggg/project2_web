import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { service } from "../../services";
import toast from "react-hot-toast";

const ListBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const loadBookings = () => {
        let cancelled = false;

        service.getBookings().then((data) => {
            if (cancelled) return;
            setBookings(data);
            setIsLoading(false);
        });

        return () => {
            cancelled = true;
        };
    };

    useEffect(()=>{
        const cleanup = loadBookings();
        return cleanup;
    },[]);

    const handleConfirmDirectPayment = async (bookingId) => {
        try {
            setUpdatingId(bookingId);
            const updatedBooking = await service.confirmDirectPayment(bookingId);
            setBookings((prev) => prev.map((item) => (item._id === bookingId ? updatedBooking : item)));
            toast.success('Direct payment confirmed');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? This will release the booked seats.")) {
            return;
        }
        try {
            setUpdatingId(bookingId);
            await service.cancelBooking(bookingId);
            setBookings((prev) => prev.filter((item) => item._id !== bookingId));
            toast.success('Booking cancelled successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    return !isLoading ? (
        <>
            <Title text1="List" text2='Bookings' />
            <div className="max-w-6xl mt-6 overflow-x-auto">
                <table className="w-full border-collaspe rounded-md overflow-hidden text-nowrap">
                    <thead>
                        <tr className="bg-primary/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">User Name</th>
                            <th className="p-2 font-medium">Movie Name</th>
                            <th className="p-2 font-medium">Show Time</th>
                            <th className="p-2 font-medium">Seats</th>
                            <th className="p-2 font-medium">Amount</th>
                            <th className="p-2 font-medium">Method</th>
                            <th className="p-2 font-medium">Status</th>
                            <th className="p-2 font-medium">Contact</th>
                            <th className="p-2 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-light">
                        {bookings.map((item, index)=>(
                            <tr key={index} className="border-b border-primary/20 bg-primary/5 even:bg-primary/10">
                                <td className="p-2 min-w-45 pl-5">
                                    {item.user.name}
                                </td>
                                <td className="p-2">
                                    {item.show.movie.title}
                                </td>
                                <td className="p-2">
                                    {dateFormat(item.show.showDateTime)}
                                </td>
                                <td className="p-2">
                                    {item.bookedSeats.join(", ")}
                                </td>
                                <td className="p-2">
                                    {currency} {item.amount}
                                </td>
                                <td className="p-2 capitalize">
                                    {item.paymentMethod || 'not selected'}
                                </td>
                                <td className="p-2">
                                    {item.paymentStatus}
                                </td>
                                <td className="p-2">
                                    {item.contactPhone || item.deliveryAddress || '-'}
                                </td>
                                <td className="p-2">
                                    {item.paymentStatus === 'awaiting-direct-payment' ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleConfirmDirectPayment(item._id)}
                                                disabled={updatingId === item._id}
                                                className="rounded-full bg-primary hover:bg-primary-dull px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                                            >
                                                {updatingId === item._id ? 'Updating...' : 'Confirm Pay'}
                                            </button>
                                            <button
                                                onClick={() => handleCancelBooking(item._id)}
                                                disabled={updatingId === item._id}
                                                className="rounded-full bg-rose-500 hover:bg-rose-600 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                                            >
                                                {updatingId === item._id ? 'Updating...' : 'Cancel'}
                                            </button>
                                        </div>
                                    ) : item.paymentStatus === 'paid' && item.paymentMethod === 'online' ? (
                                        <button
                                            onClick={() => handleCancelBooking(item._id)}
                                            disabled={updatingId === item._id}
                                            className="rounded-full bg-rose-500 hover:bg-rose-600 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                                        >
                                            {updatingId === item._id ? 'Cancelling...' : 'Cancel'}
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-500">No action</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />
}

export default ListBookings
