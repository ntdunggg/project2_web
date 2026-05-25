import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { service } from "../../services";
import toast from "react-hot-toast";

const ListShows = () => {

    const currency = import.meta.env.VITE_CURRENCY
    const [shows, setShows] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [editingShow, setEditingShow] = useState(null);
    const [editForm, setEditForm] = useState({ showDateTime: '', showPrice: '' });
    const [savingId, setSavingId] = useState(null);

    useEffect(()=>{
        let cancelled = false;

        Promise.all([service.getShows(), service.getBookings()]).then(([showsData, bookingsData]) => {
            if (cancelled) return;
            setShows(showsData);
            setBookings(bookingsData);
            setLoading(false);
        }).catch((error) => {
            console.error(error);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const getShowBookings = (showId) => bookings.filter((booking) => booking.show?._id === showId);

    const handleDeleteShow = async (showId) => {
        if (!window.confirm('Delete this show and its related bookings?')) {
            return;
        }

        try {
            setDeletingId(showId);
            await service.deleteShow(showId);
            setShows((prev) => prev.filter((show) => show._id !== showId));
            setBookings((prev) => prev.filter((booking) => booking.show?._id !== showId));
            toast.success('Show deleted');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleStartEdit = (show) => {
        setEditingShow(show._id);
        setEditForm({
            showDateTime: new Date(show.showDateTime).toISOString().slice(0, 16),
            showPrice: String(show.showPrice),
        });
    };

    const handleSaveEdit = async (showId) => {
        try {
            setSavingId(showId);
            const updatedShow = await service.updateShow(showId, {
                showDateTime: new Date(editForm.showDateTime).toISOString(),
                showPrice: Number(editForm.showPrice),
            });
            setShows((prev) => prev.map((show) => (show._id === showId ? updatedShow : show)));
            setEditingShow(null);
            toast.success('Show updated');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSavingId(null);
        }
    };

    return !loading ? (
        <>
            <Title text1 ="List" text2='Shows' />
            <div className="max-w-6xl mt-6 overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
                    <thead>
                        <tr className="bg-primary/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">Movie Name</th>
                            <th className="p-2 font-medium">Show time</th>
                            <th className="p-2 font-medium">Total Bookings</th>
                            <th className="p-2 font-medium">Collected</th>
                            <th className="p-2 font-medium">Pending Direct</th>
                            <th className="p-2 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-light">
                        {shows.map((show, index)=>{
                            const showBookings = getShowBookings(show._id);
                            const collected = showBookings
                                .filter((booking) => booking.paymentStatus === 'paid')
                                .reduce((sum, booking) => sum + booking.amount, 0);
                            const pending = showBookings
                                .filter((booking) => booking.paymentStatus === 'awaiting-direct-payment')
                                .reduce((sum, booking) => sum + booking.amount, 0);

                            return (
                            <tr key={index} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                                <td className="p-2 min-w-45 pl-5">
                                    <div>{show.movie.title}</div>
                                    {show.isWednesday && (
                                        <div className="text-xs text-emerald-300">Wednesday 30% off</div>
                                    )}
                                </td>
                               <td className="p-2">
                                    {editingShow === show._id ? (
                                        <input
                                            type="datetime-local"
                                            value={editForm.showDateTime}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, showDateTime: event.target.value }))}
                                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none"
                                        />
                                    ) : (
                                        dateFormat(show.showDateTime)
                                    )}
                                </td>
                                  <td className="p-2">
                                    {showBookings.length}
                                </td>
                                  <td className="p-2">
                                    {editingShow === show._id ? (
                                        <div className="flex items-center gap-2">
                                            <span>{currency}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editForm.showPrice}
                                                onChange={(event) => setEditForm((prev) => ({ ...prev, showPrice: event.target.value }))}
                                                className="w-24 rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none"
                                            />
                                        </div>
                                    ) : (
                                        `${currency} ${collected}`
                                    )}
                                </td>
                                  <td className="p-2">
                                    {currency} {pending}
                                </td>
                                  <td className="p-2">
                                    <div className="flex items-center gap-2">
                                        {editingShow === show._id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSaveEdit(show._id)}
                                                    disabled={savingId === show._id}
                                                    className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
                                                >
                                                    {savingId === show._id ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={() => setEditingShow(null)}
                                                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleStartEdit(show)}
                                                className="rounded-full border border-white/15 px-3 py-1 text-xs text-gray-300 transition hover:bg-white/10"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteShow(show._id)}
                                            disabled={deletingId === show._id}
                                            className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {deletingId === show._id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />
}

export default ListShows
