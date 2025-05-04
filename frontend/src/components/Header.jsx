import React from 'react'

export default function Header() {
    return (
        <nav className="flex justify-between items-center md:px-5">
            <h1
                className="text-3xl flex font-black text-transparent bg-clip-text bg-[linear-gradient(to_right,_#EB568E,_#144EE3)]">
                Trimio <span className='text-[#C9CED6] text-base'>®</span>
            </h1>


            <div className="flex items-center gap-5">
                <button
                    className="bg-[#181E29] cursor-pointer flex items-center gap-2 py-2 md:py-3 rounded-full text-sm font-medium px-6 border border-[#353C4A] text-white">
                    Login
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>


                </button>
                <button
                    className="bg-[#144EE3] hidden md:flex cursor-pointer rounded-full font-medium shadow-lg shadow-[#144EE34D] text-sm text-white px-6 py-3">Register
                    Now</button>
            </div>
        </nav>
    )
}
