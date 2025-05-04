import React, { useState } from 'react'
import axios from "axios";
import History from './History';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
    const [data, setData] = useState([]);
    const [longurl, setLongurl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchLink = async () => {
        let storedIds = JSON.parse(localStorage.getItem("shortLinkIds")) || [];

        try {
            const { data } = await axios.post("/shortlink/getlinks", {
                ids: storedIds
            })

            if (data.success) {
                setData(data.data);
            }
        }
        catch (error) {
            console.log("Server Error", error);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const { data } = await axios.post("/shortlink/create", {
                longLink: longurl
            });

            if (data.success) {
                let storedIds = JSON.parse(localStorage.getItem("shortLinkIds")) || [];
                storedIds.push(data.data._id);
                localStorage.setItem("shortLinkIds", JSON.stringify(storedIds));

                await fetchLink();

                toast('Your Shortlink is Ready',
                    {
                        icon: '🎉',
                        duration: 3000,
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );

                // console.log("Saved IDs:", storedIds);
            }

            setLongurl("");
            setIsLoading(false);
        }
        catch (error) {
            console.log("Server Error", error);
            setIsLoading(false);
        }
    }


    return (
        <>
            <div className="flex flex-col justify-center mt-10 items-center">
                <h1
                    className="text-[30px] text-center w-[80%] md:text-[40px] lg:text-[50px] font-black text-transparent bg-clip-text bg-[radial-gradient(circle_at_center,_#EB568E,_#144EE3)]">
                    Shorten Your Loooong Links :)</h1>
                <p className="text-xs w-[80%] md:w-1/2 mt-3 text-center lg:text-sm font-extralight text-[#C9CED6]">
                    Trimio is an efficient and easy-to-use URL
                    shortening service that streamlines your online experience.</p>

                <form onSubmit={handleSubmit}
                    className="flex items-center justify-between my-6 md:my-10 bg-[#181E29] rounded-full p-1 md:p-[6px] w-full md:w-auto lg:w-1/2 border-2 border-[#353C4A]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                        stroke="currentColor" className=" size-4 md:size-5 ml-2 md:ml-5 text-[#C9CED6]">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>

                    <input type="url" name="longurl"
                        className="flex-1 py-3 bg-transparent text-xs md:text-base px-4 font-light outline-none focus:outline-none focus:ring-0"
                        id="" placeholder="Enter the link here"
                        value={longurl}
                        onChange={(e) => setLongurl(e.target.value)}
                        required
                    />
                    {
                        isLoading ? (
                            <>
                                <button disabled type="button" className="bg-[#144EE3] hidden md:flex cursor-pointer rounded-full font-medium text-sm text-white px-6 py-4">
                                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                    Loading...
                                </button>

                                <button disabled type="button" className="bg-[#144EE3] flex md:hidden cursor-pointer rounded-full font-medium text-sm text-white p-3">
                                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                </button>
                            </>

                        ) : (
                            <>
                                <button
                                    type='submit'
                                    className="bg-[#144EE3] hidden md:flex cursor-pointer rounded-full font-medium text-sm text-white px-6 py-4">Shorten
                                    Now!
                                </button>

                                <button
                                    type='submit'
                                    className="bg-[#144EE3] flex md:hidden cursor-pointer rounded-full font-medium text-sm text-white p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                        stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>

                                </button>
                            </>



                        )
                    }







                </form>

            </div>

            <History data={data} fetchLink={fetchLink} />
            <Toaster />
        </>
    )
}
