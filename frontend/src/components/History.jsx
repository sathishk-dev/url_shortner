import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { saveAs } from 'file-saver'


export default function History({ data, fetchLink }) {

    const [isModelOpen, setIsModelOpen] = useState(false);
    const [qrLink, setQrLink] = useState("");

    useEffect(() => {
        fetchLink();
    }, [])

    const copyLink = (link) => {
        navigator.clipboard.writeText(`${import.meta.env.VITE_SERVER_URL}/${link}`)
            .then(() => {
                toast('Link copied to clipboard!',
                    {
                        icon: '👍',
                        duration: 2000,
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy link');
            });
    };

    const toggleModal = (qr) => {
        if (qr) {
            setQrLink(qr);
            setIsModelOpen(true);
        } else {
            setIsModelOpen(false);
        }
    };

    const renderOriginalLink = (link) => {
        try {
            const url = new URL(link);
            const domain = url.hostname;
            const iconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
            const defaultIcon = "https://cdn-icons-png.flaticon.com/512/535/535239.png";

            let displayText = link.length > 30 ? link.substring(0, 30) + '...' : link;

            return (
                <div className="flex items-center">
                    <img src={iconUrl} onError={(e) => e.target.src = defaultIcon} alt="Icon" className="w-5 h-5 rounded-full flex-shrink-0" />
                    <a href={link} className="ml-2" target="_blank" rel="noopener noreferrer">{displayText}</a>
                </div>
            );
        } catch {
            return <span>{link}</span>;
        }
    };

    const downloadQr = async (qrUrl) => {
        try {
            const now = new Date();
            const timestamp = now.toISOString().replace(/[-:.]/g, "").slice(0, 15);

            const filename = `linkly_qr_${timestamp}.png`;
            saveAs(qrUrl, filename);

        }
        catch (error) {
            console.error('Download failed', error);
            alert('Failed to download QR code.');
        }
    };

    const handleDelete = async (linkId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this link?");
        if (!confirmDelete) return;

        try {
            const { data } = await axios.delete(`/shortlink/delete/${linkId}`);
            if (data.success) {
                let storedIds = JSON.parse(localStorage.getItem("shortLinkIds")) || [];
                const updatedIds = storedIds.filter(id => id !== linkId);

                localStorage.setItem("shortLinkIds", JSON.stringify(updatedIds));

                fetchLink();

                toast('Link Successfully deleted!', {
                    icon: '✅',
                    duration: 2000,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        } catch (error) {
            console.log("Server Error", error);
        }
    }




    return (
        <div className="relative overflow-x-auto w-[90%] mx-auto max-h-[450px] overflow-y-auto">
            <table className="w-full text-sm text-left rtl:text-right text-[#C9CED6]">
                <thead className="text-xs text-[#C9CED6] uppercase bg-[#181E29] rounded-t-lg sticky top-0 z-10">
                    <tr className="rounded-t-lg">
                        <th scope="col" className="px-6 py-5 rounded-tl-lg">Short Link</th>
                        <th scope="col" className="px-6 py-5">Original Link</th>
                        <th scope="col" className="px-6 py-5">QR Code</th>
                        <th scope="col" className="px-6 py-5">Clicks</th>
                        <th scope="col" className="px-6 py-5 rounded-tr-lg">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index} className="bg-[rgba(24,30,41,0.22)] opacity-80 backdrop-blur-lg border-b-4 border-transparent">
                                    <td className="px-6 py-5 font-light text-sm flex">
                                        <span>{`${import.meta.env.VITE_SERVER_URL}/${item.shortLink}`}</span>
                                        <button onClick={() => copyLink(item.shortLink)} className="bg-[#1C283F] cursor-pointer hover:bg-[#144EE3] ml-2 rounded-full p-1 flex justify-center items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                                className="size-4">
                                                <path
                                                    d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                                                <path
                                                    d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
                                            </svg>
                                        </button>
                                    </td>

                                    <td className="px-6 py-5 font-light text-sm">
                                        {renderOriginalLink(item.longLink)}
                                    </td>

                                    <td className="px-6 py-5 font-light text-sm">
                                        <svg onClick={() => toggleModal(item.qr)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                            stroke="currentColor" className="size-6 cursor-pointer">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                                        </svg>
                                    </td>

                                    <td className="px-6 py-5 font-light text-sm">{item.clicks}</td>

                                    <td className="px-6 py-5 font-light text-sm">
                                        <button onClick={() => handleDelete(item._id)} type='button' className='hover:text-red-600'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))) : (

                            <tr className="bg-[rgba(24,30,41,0.22)] opacity-80 backdrop-blur-lg border-b-4 border-transparent">
                                <td colSpan={5} className="px-6 py-5 font-light text-sm text-center">You have no Links</td>
                            </tr>
                        )

                    }
                </tbody>
            </table>

            {/* QR Show Modal */}
            {
                isModelOpen && (
                    <div tabIndex="-1" aria-hidden="true"
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[80%] md:w-[40%] lg:w-[25%] ">

                        <div className="relative bg-white rounded-lg shadow-sm p-1">
                            <div className="flex items-center justify-between pr-2">
                                <h3 className=" md:text-lg font-semibold pl-5 md:pt-3 text-gray-900">
                                    Scan this QR
                                </h3>
                                <button
                                    className="text-gray-400 bg-transparent z-10 cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-10 h-10 inline-flex justify-center items-center"
                                    onClick={() => toggleModal()}
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            <div className="flex justify-center">
                                <img src={qrLink}
                                    alt="QR Code" className="w-full h-auto rounded" />
                            </div>

                            <button onClick={() => downloadQr(qrLink)} className='bg-[#1C283F] items-center justify-center py-2 w-full rounded-md flex gap-2'>
                                Download
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                                    <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )
            }

            <Toaster />

        </div>
    );
}
