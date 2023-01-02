import React, { useEffect, useState } from 'react'

const Client = ({ username }) => {

    const [avatar, setAvatar] = useState('')

    function generateAvatar(name) {
        const [firstname, lastname] = name.split(' ')

        if (!lastname) {
            setAvatar(firstname.charAt(0))
            return;
        }

        setAvatar(`${firstname.charAt(0)}${lastname.charAt(0)}`)
        return;
    }

    useEffect(() => {
        generateAvatar(username)
    }, [])

    return (
        <div className='flex items-center justify-center flex-col mt-4'>
            <div
                className="w-12 h-12 bg-pink-600 text-white font-bold flex items-center justify-center text-2xl uppercase rounded-xl">
                {avatar}
            </div>
            <span className='text-xs mt-1 sm:block hidden font-semibold capitalize'>{username}</span>
        </div>
    )
}

export default Client